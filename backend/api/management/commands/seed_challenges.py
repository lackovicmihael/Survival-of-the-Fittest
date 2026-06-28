from django.core.management.base import BaseCommand

from api.firebase import get_db


CHALLENGES = [
    {
        'id': '50-push-ups',
        'title': '50 Push Ups',
        'description': 'Napravi 50 sklekova u jednom treningu. Možeš pauzirati, ali cilj je završiti cijeli broj ponavljanja.',
        'category': 'Strength',
        'difficulty': 'Medium',
        'target': 50,
        'unit': 'reps',
        'points': 25,
        'image': 'assets/img/challenges/push-ups.svg',
        'video': 'https://www.youtube.com/embed/IODxDxX7oi4',
    },
    {
        'id': '100-squats',
        'title': '100 Squats',
        'description': 'Odrađuje se 100 čučnjeva s vlastitom težinom uz pravilnu tehniku i kontroliran tempo.',
        'category': 'Strength',
        'difficulty': 'Medium',
        'target': 100,
        'unit': 'reps',
        'points': 25,
        'image': 'assets/img/challenges/squats.svg',
        'video': 'https://www.youtube.com/embed/aclHkVaku9U',
    },
    {
        'id': '5-km-run',
        'title': '5 km Run',
        'description': 'Istrči ukupno 5 kilometara. Tempo nije presudan, bitno je završiti zadanu udaljenost.',
        'category': 'Cardio',
        'difficulty': 'Hard',
        'target': 5,
        'unit': 'km',
        'points': 50,
        'image': 'assets/img/challenges/run.svg',
        'video': 'https://www.youtube.com/embed/brFHyOtTwH4',
    },
    {
        'id': '2-minute-plank',
        'title': '2 Minute Plank',
        'description': 'Zadrži plank položaj 2 minute. Fokus je na stabilnom trupu i pravilnom položaju leđa.',
        'category': 'Core',
        'difficulty': 'Medium',
        'target': 120,
        'unit': 'seconds',
        'points': 25,
        'image': 'assets/img/challenges/plank.svg',
        'video': 'https://www.youtube.com/embed/pSHjTRCQxIw',
    },
    {
        'id': '50-sit-ups',
        'title': '50 Sit Ups',
        'description': 'Napravi 50 trbušnjaka u jednom treningu uz kontroliran pokret i stabilan ritam.',
        'category': 'Core',
        'difficulty': 'Easy',
        'target': 50,
        'unit': 'reps',
        'points': 10,
        'image': 'assets/img/challenges/sit-ups.svg',
        'video': 'https://www.youtube.com/embed/1fbU_MkV7NE',
    },
    {
        'id': '20-burpees',
        'title': '20 Burpees',
        'description': 'Odrađuje se 20 burpee ponavljanja. Izazov kombinira snagu, eksplozivnost i kondiciju.',
        'category': 'Cardio',
        'difficulty': 'Hard',
        'target': 20,
        'unit': 'reps',
        'points': 50,
        'image': 'assets/img/challenges/burpees.svg',
        'video': 'https://www.youtube.com/embed/TU8QYVW0gDU',
    },
    {
        'id': '10-pull-ups',
        'title': '10 Pull Ups',
        'description': 'Napravi 10 zgibova. Zahtijeva jačinu leđa, ruku i dobru kontrolu tijela.',
        'category': 'Strength',
        'difficulty': 'Hard',
        'target': 10,
        'unit': 'reps',
        'points': 50,
        'image': 'assets/img/challenges/pull-ups.svg',
        'video': 'https://www.youtube.com/embed/eGo4IYlbE5g',
    },
    {
        'id': '15-minute-cycling',
        'title': '15 Minute Cycling',
        'description': 'Vozi bicikl 15 minuta bez dulje pauze. Izazov je prikladan za kardio trening manjeg intenziteta.',
        'category': 'Cardio',
        'difficulty': 'Easy',
        'target': 15,
        'unit': 'minutes',
        'points': 10,
        'image': 'assets/img/challenges/cycling.svg',
        'video': 'https://www.youtube.com/embed/qWy_aOlB45Y',
    },
    {
        'id': '30-lunges',
        'title': '30 Lunges',
        'description': 'Napravi 30 iskoraka ukupno. Izazov pogađa noge, stabilnost i ravnotežu.',
        'category': 'Strength',
        'difficulty': 'Easy',
        'target': 30,
        'unit': 'reps',
        'points': 10,
        'image': 'assets/img/challenges/lunges.svg',
        'video': 'https://www.youtube.com/embed/QOVaHwm-Q6U',
    },
    {
        'id': '3-km-walk',
        'title': '3 km Walk',
        'description': 'Prohodaj 3 kilometra. Jednostavan izazov za aktivan dan i početak fitness rutine.',
        'category': 'Cardio',
        'difficulty': 'Easy',
        'target': 3,
        'unit': 'km',
        'points': 10,
        'image': 'assets/img/challenges/walk.svg',
        'video': 'https://www.youtube.com/embed/njeZ29umqVE',
    },
]


class Command(BaseCommand):
    help = 'Upisuje početne fitness izazove u Firestore kolekciju challenges.'

    def handle(self, *args, **options):
        db = get_db()
        for challenge in CHALLENGES:
            db.collection('challenges').document(challenge['id']).set(challenge)
            self.stdout.write(self.style.SUCCESS(f'Dodan/a: {challenge["title"]}'))
        self.stdout.write(self.style.SUCCESS('Seed podaci su uspješno spremljeni u Firestore.'))
