# Survival of the Fittest

**Survival of the Fittest** is a student project developed for the **Web Programming** course. The application allows users to register, log in, browse fitness challenges, submit challenge results, earn points, view their profile, compete on the leaderboard, and calculate their BMI.

The project uses a custom **Django REST API** to communicate with a **Firebase Firestore** database.

---

# Technologies

## Frontend

* HTML5
* CSS3
* Bootstrap 5
* Bootstrap Icons
* Vanilla JavaScript
* Fetch API

## Backend

* Python
* Django
* Django REST Framework

## Database

* Firebase Firestore

## Data Exchange Format

* JSON

---

# Features

* User registration
* User login
* Password hashing on the backend
* Browse fitness challenges
* Filter challenges by category
* View challenge details
* Submit challenge results
* Automatic point awarding after successful challenge completion
* User profile
* View personal challenge history
* Leaderboard
* BMI calculator
* Sources and references page

---

# Firebase Setup

Before running the project, create a Firebase project and enable **Cloud Firestore Database**.

1. Open **Firebase Console**.
2. Create a new Firebase project.
3. Enable **Cloud Firestore Database**.
4. Go to **Project Settings → Service Accounts** and generate a new **Private Key**.
5. Place the downloaded file in:

```text
backend/serviceAccountKey.json
```

---

# Running the Project

## 1. Open the backend directory

```bash
cd backend
```

## 2. Create a virtual environment

```bash
python -m venv venv
```

## 3. Activate the virtual environment

**Windows**

```bash
venv\Scripts\activate
```

**Linux / macOS**

```bash
source venv/bin/activate
```

## 4. Install the required dependencies

```bash
pip install -r requirements.txt
```

## 5. Create the `.env` file

**Windows**

```bash
copy .env.example .env
```

**Linux / macOS**

```bash
cp .env.example .env
```

## 6. Run Django migrations

```bash
python manage.py migrate
```

## 7. Seed the initial challenge data into Firestore

```bash
python manage.py seed_challenges
```

## 8. Start the backend server

```bash
python manage.py runserver
```

The backend will be available at:

```text
http://127.0.0.1:8000
```

## 9. Run the frontend

Open:

```text
frontend/index.html
```

using the **Live Server** extension in Visual Studio Code.

---

# API Endpoints

| Method | Endpoint               | Description                             |
| ------ | ---------------------- | --------------------------------------- |
| POST   | `/api/register`        | Register a new user                     |
| POST   | `/api/login`           | User login                              |
| GET    | `/api/challenges`      | Retrieve all challenges                 |
| GET    | `/api/challenges/<id>` | Retrieve a specific challenge           |
| POST   | `/api/submissions`     | Submit a challenge result               |
| GET    | `/api/my-submissions`  | Retrieve the current user's submissions |
| GET    | `/api/profile`         | Retrieve the current user's profile     |
| GET    | `/api/leaderboard`     | Retrieve the leaderboard                |
| POST   | `/api/bmi`             | Calculate BMI                           |

---

# Firestore Collections

The project uses the following Firestore collections:

* `users`
* `challenges`
* `submissions`
