from pathlib import Path

import firebase_admin
from django.conf import settings
from firebase_admin import credentials, firestore


_db = None


def get_db():
    """Vraća Firestore klijent. Service account key mora biti postavljen lokalno."""
    global _db
    if _db is not None:
        return _db

    credentials_path = Path(settings.FIREBASE_CREDENTIALS)
    if not credentials_path.exists():
        raise FileNotFoundError(
            f'Firebase service account nije pronađen: {credentials_path}. '
            'Kopiraj serviceAccountKey.example.json u serviceAccountKey.json i ubaci stvarne Firebase podatke.'
        )

    if not firebase_admin._apps:
        cred = credentials.Certificate(str(credentials_path))
        firebase_admin.initialize_app(cred)

    _db = firestore.client()
    return _db
