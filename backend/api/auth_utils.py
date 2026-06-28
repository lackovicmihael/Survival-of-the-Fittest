from django.core import signing
from django.conf import settings
from rest_framework.response import Response

from .firebase import get_db

TOKEN_MAX_AGE_SECONDS = 60 * 60 * 24 * 7


def create_token(user_id):
    return signing.dumps({'userId': user_id}, salt=settings.SECRET_KEY)


def decode_token(token):
    data = signing.loads(token, salt=settings.SECRET_KEY, max_age=TOKEN_MAX_AGE_SECONDS)
    return data.get('userId')


def get_current_user(request):
    auth_header = request.headers.get('Authorization', '')
    if not auth_header.startswith('Bearer '):
        return None, Response({'error': 'Authorization token nedostaje.'}, status=401)

    token = auth_header.replace('Bearer ', '').strip()
    try:
        user_id = decode_token(token)
    except Exception:
        return None, Response({'error': 'Neispravan ili istekao token.'}, status=401)

    db = get_db()
    user_doc = db.collection('users').document(user_id).get()
    if not user_doc.exists:
        return None, Response({'error': 'Korisnik ne postoji.'}, status=401)

    user = user_doc.to_dict()
    user['id'] = user_doc.id
    return user, None


def public_user(user):
    return {
        'id': user.get('id'),
        'username': user.get('username'),
        'email': user.get('email'),
        'points': user.get('points', 0),
    }
