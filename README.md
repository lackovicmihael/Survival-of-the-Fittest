# Survival of the Fittest

**Survival of the Fittest** je studentski projekt izrađen za kolegij **Web Programiranje**. Aplikacija omogućuje korisnicima registraciju, prijavu, pregled fitness izazova, slanje rezultata, prikupljanje bodova, pregled profila, leaderboard te izračun BMI vrijednosti.

Projekt koristi vlastiti **Django REST API** za komunikaciju s **Firebase Firestore** bazom podataka.

---

## Tehnologije

### Frontend

* HTML5
* CSS3
* Bootstrap 5
* Bootstrap Icons
* Vanilla JavaScript
* Fetch API

### Backend

* Python
* Django
* Django REST Framework

### Baza podataka

* Firebase Firestore

### Razmjena podataka

* JSON

---

## Funkcionalnosti

* Registracija korisnika
* Prijava korisnika
* Hashiranje lozinki na backendu
* Pregled fitness izazova
* Filtriranje izazova po kategoriji
* Prikaz detalja izazova
* Slanje rezultata izazova
* Automatsko dodavanje bodova nakon uspješnog završetka izazova
* Korisnički profil
* Pregled vlastitih rezultata
* Leaderboard
* BMI kalkulator
* Stranica s korištenim izvorima

---

## Firebase postavljanje

Prije pokretanja projekta potrebno je napraviti Firebase projekt i uključiti **Cloud Firestore Database**.

1. Otvoriti **Firebase Console**.
2. Napraviti novi projekt.
3. Uključiti **Cloud Firestore**.
4. U **Project Settings → Service Accounts** generirati novi **Private Key**.
5. Preuzetu datoteku spremiti u:

```text
backend/serviceAccountKey.json
```

---

## Pokretanje projekta

### 1. Otvoriti backend direktorij

```bash
cd backend
```

### 2. Napraviti virtual environment

```bash
python -m venv venv
```

### 3. Aktivirati virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

### 4. Instalirati potrebne pakete

```bash
pip install -r requirements.txt
```

### 5. Napraviti `.env` datoteku

**Windows**

```bash
copy .env.example .env
```

**Linux / macOS**

```bash
cp .env.example .env
```

### 6. Pokrenuti Django migracije

```bash
python manage.py migrate
```

### 7. Ubaciti početne challenge podatke u Firestore

```bash
python manage.py seed_challenges
```

### 8. Pokrenuti backend

```bash
python manage.py runserver
```

Backend će biti dostupan na:

```text
http://127.0.0.1:8000
```

### 9. Pokrenuti frontend

Otvoriti datoteku:

```text
frontend/index.html
```

pomoću **Live Server** ekstenzije u Visual Studio Codeu.

---

## API rute

| Metoda | Ruta                   | Opis                       |
| ------ | ---------------------- | -------------------------- |
| POST   | `/api/register`        | Registracija korisnika     |
| POST   | `/api/login`           | Prijava korisnika          |
| GET    | `/api/challenges`      | Dohvat svih izazova        |
| GET    | `/api/challenges/<id>` | Dohvat pojedinog izazova   |
| POST   | `/api/submissions`     | Slanje rezultata izazova   |
| GET    | `/api/my-submissions`  | Dohvat vlastitih rezultata |
| GET    | `/api/profile`         | Korisnički profil          |
| GET    | `/api/leaderboard`     | Leaderboard korisnika      |
| POST   | `/api/bmi`             | Izračun BMI vrijednosti    |

---

## Firestore kolekcije

Projekt koristi sljedeće kolekcije:

* `users`
* `challenges`
* `submissions`