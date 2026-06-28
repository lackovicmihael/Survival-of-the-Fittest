from datetime import datetime, timezone
import re

from django.contrib.auth.hashers import make_password, check_password
from google.cloud import firestore as google_firestore
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .auth_utils import create_token, get_current_user, public_user
from .firebase import get_db

EMAIL_RE = re.compile(r'^[^@\s]+@[^@\s]+\.[^@\s]+$')


def _required(data, fields):
    missing = [field for field in fields if not str(data.get(field, '')).strip()]
    return missing


def _doc_to_dict(doc):
    data = doc.to_dict() or {}
    data['id'] = doc.id
    return data


def _validate_register(data):
    errors = {}
    username = str(data.get('username', '')).strip()
    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))
    confirm = str(data.get('confirmPassword', data.get('confirm_password', '')))

    if len(username) < 3:
        errors['username'] = 'Korisničko ime mora imati najmanje 3 znaka.'
    if not EMAIL_RE.match(email):
        errors['email'] = 'Unesi ispravnu email adresu.'
    if len(password) < 6:
        errors['password'] = 'Lozinka mora imati najmanje 6 znakova.'
    if password != confirm:
        errors['confirmPassword'] = 'Lozinke se ne podudaraju.'

    return errors, username, email, password


@api_view(['GET'])
def api_root(request):
    return Response({
        'project': 'Survival of the Fittest',
        'endpoints': [
            'POST /api/register',
            'POST /api/login',
            'GET /api/challenges',
            'GET /api/challenges/<id>',
            'POST /api/submissions',
            'GET /api/my-submissions',
            'GET /api/profile',
            'GET /api/leaderboard',
            'POST /api/bmi',
        ]
    })


@api_view(['POST'])
def register(request):
    data = request.data or {}
    errors, username, email, password = _validate_register(data)
    if errors:
        return Response({'errors': errors}, status=400)

    db = get_db()
    users_ref = db.collection('users')

    email_exists = users_ref.where('email', '==', email).limit(1).stream()
    if any(email_exists):
        return Response({'errors': {'email': 'Email je već registriran.'}}, status=400)

    username_exists = users_ref.where('username', '==', username).limit(1).stream()
    if any(username_exists):
        return Response({'errors': {'username': 'Korisničko ime je zauzeto.'}}, status=400)

    user_ref = users_ref.document()
    user = {
        'id': user_ref.id,
        'username': username,
        'email': email,
        'passwordHash': make_password(password),
        'points': 0,
    }
    user_ref.set(user)

    return Response({
        'message': 'Registracija uspješna.',
        'token': create_token(user_ref.id),
        'user': public_user(user),
    }, status=201)


@api_view(['POST'])
def login(request):
    data = request.data or {}
    missing = _required(data, ['email', 'password'])
    if missing:
        return Response({'error': 'Email i lozinka su obavezni.'}, status=400)

    email = str(data.get('email', '')).strip().lower()
    password = str(data.get('password', ''))

    db = get_db()
    matches = list(db.collection('users').where('email', '==', email).limit(1).stream())
    if not matches:
        return Response({'error': 'Neispravan email ili lozinka.'}, status=401)

    user = _doc_to_dict(matches[0])
    if not check_password(password, user.get('passwordHash', '')):
        return Response({'error': 'Neispravan email ili lozinka.'}, status=401)

    return Response({
        'message': 'Prijava uspješna.',
        'token': create_token(user['id']),
        'user': public_user(user),
    })


@api_view(['GET'])
def challenges(request):
    db = get_db()
    docs = db.collection('challenges').stream()
    items = [_doc_to_dict(doc) for doc in docs]
    difficulty_order = {'Easy': 1, 'Medium': 2, 'Hard': 3}
    items.sort(key=lambda item: (difficulty_order.get(item.get('difficulty'), 9), item.get('title', '')))
    return Response({'challenges': items})


@api_view(['GET'])
def challenge_detail(request, challenge_id):
    db = get_db()
    doc = db.collection('challenges').document(challenge_id).get()
    if not doc.exists:
        return Response({'error': 'Izazov nije pronađen.'}, status=404)
    return Response({'challenge': _doc_to_dict(doc)})


@api_view(['POST'])
def submit_result(request):
    user, error_response = get_current_user(request)
    if error_response:
        return error_response

    data = request.data or {}
    missing = _required(data, ['challengeId', 'result'])
    if missing:
        return Response({'error': 'Challenge ID i rezultat su obavezni.'}, status=400)

    try:
        result = float(data.get('result'))
    except (TypeError, ValueError):
        return Response({'error': 'Rezultat mora biti broj.'}, status=400)

    if result < 0:
        return Response({'error': 'Rezultat ne može biti negativan.'}, status=400)

    challenge_id = str(data.get('challengeId')).strip()
    db = get_db()
    challenge_doc = db.collection('challenges').document(challenge_id).get()
    if not challenge_doc.exists:
        return Response({'error': 'Izazov nije pronađen.'}, status=404)

    challenge = _doc_to_dict(challenge_doc)
    target = float(challenge.get('target', 0))
    completed = result >= target
    awarded_points = 0

    if completed:
        user_submissions = db.collection('submissions').where('userId', '==', user['id']).stream()
        previous_completed = any(
            (doc.to_dict() or {}).get('challengeId') == challenge_id
            and (doc.to_dict() or {}).get('completed') is True
            for doc in user_submissions
        )
        if not previous_completed:
            awarded_points = int(challenge.get('points', 0))
            db.collection('users').document(user['id']).update({
                'points': google_firestore.Increment(awarded_points)
            })

    submission_ref = db.collection('submissions').document()
    submission = {
        'id': submission_ref.id,
        'userId': user['id'],
        'challengeId': challenge_id,
        'result': result,
        'completed': completed,
        'date': datetime.now(timezone.utc).isoformat(),
    }
    submission_ref.set(submission)

    return Response({
        'message': 'Rezultat je spremljen.',
        'submission': submission,
        'completed': completed,
        'awardedPoints': awarded_points,
    }, status=201)


@api_view(['GET'])
def my_submissions(request):
    user, error_response = get_current_user(request)
    if error_response:
        return error_response

    db = get_db()
    docs = db.collection('submissions').where('userId', '==', user['id']).stream()
    submissions = [_doc_to_dict(doc) for doc in docs]
    submissions.sort(key=lambda item: item.get('date', ''), reverse=True)

    for item in submissions:
        challenge_doc = db.collection('challenges').document(item.get('challengeId')).get()
        if challenge_doc.exists:
            challenge = challenge_doc.to_dict()
            item['challengeTitle'] = challenge.get('title')
            item['unit'] = challenge.get('unit')
            item['points'] = challenge.get('points')

    return Response({'submissions': submissions})


@api_view(['GET'])
def profile(request):
    user, error_response = get_current_user(request)
    if error_response:
        return error_response

    db = get_db()
    docs = db.collection('submissions').where('userId', '==', user['id']).stream()
    submissions = [_doc_to_dict(doc) for doc in docs]
    completed_count = len([item for item in submissions if item.get('completed')])

    return Response({
        'user': public_user(user),
        'completedCount': completed_count,
        'submissionCount': len(submissions),
    })


@api_view(['GET'])
def leaderboard(request):
    db = get_db()
    docs = db.collection('users').order_by('points', direction=google_firestore.Query.DESCENDING).limit(10).stream()
    users = []
    for index, doc in enumerate(docs, start=1):
        user = _doc_to_dict(doc)
        users.append({
            'rank': index,
            'id': user.get('id'),
            'username': user.get('username'),
            'points': user.get('points', 0),
        })
    return Response({'leaderboard': users})


@api_view(['POST'])
def bmi(request):
    data = request.data or {}
    missing = _required(data, ['height', 'weight'])
    if missing:
        return Response({'error': 'Visina i težina su obavezni.'}, status=400)

    try:
        height_cm = float(data.get('height'))
        weight_kg = float(data.get('weight'))
    except (TypeError, ValueError):
        return Response({'error': 'Visina i težina moraju biti brojevi.'}, status=400)

    if height_cm <= 0 or weight_kg <= 0:
        return Response({'error': 'Visina i težina moraju biti veće od nule.'}, status=400)

    height_m = height_cm / 100
    value = round(weight_kg / (height_m ** 2), 1)

    if value < 18.5:
        category = 'Pothranjenost'
    elif value < 25:
        category = 'Normalna težina'
    elif value < 30:
        category = 'Prekomjerna težina'
    else:
        category = 'Pretilost'

    return Response({
        'bmi': value,
        'category': category,
    })
