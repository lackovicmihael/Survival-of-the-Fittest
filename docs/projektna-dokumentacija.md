# Projektna dokumentacija: Survival of the Fittest

## 1. Opis projekta

Survival of the Fittest je web aplikacija za praćenje jednostavnih fitness izazova. Korisnik može pregledavati izazove, otvoriti detalje pojedinog izazova, registrirati se, prijaviti se, poslati rezultat i osvojiti bodove ako rezultat zadovoljava zadani cilj. Aplikacija prikazuje i leaderboard s najboljim korisnicima te profil s osobnim rezultatima.

Projekt je izrađen kao studentski projekt za kolegij Web Programiranje. Cilj projekta je prikazati rad s frontend tehnologijama, vlastitim backend API-jem, Firebase Firestore bazom, AJAX dohvatom podataka i validacijom korisničkog unosa.

## 2. Korištene tehnologije

Frontend dio koristi HTML5, CSS3, Bootstrap 5, Bootstrap Icons i Vanilla JavaScript. Dinamički podaci dohvaćaju se pomoću Fetch API-ja.

Backend dio koristi Django i Django REST Framework. Backend izlaže vlastiti REST API i komunicira s Firebase Firestore bazom pomoću Firebase Admin SDK-a.

Baza podataka je Firebase Firestore. Podaci se razmjenjuju u JSON formatu.

## 3. Arhitektura aplikacije

Aplikacija koristi jednostavnu klijent-poslužitelj arhitekturu:

```text
HTML/CSS/JavaScript frontend
        ↓ AJAX / Fetch
Django REST API
        ↓ Firebase Admin SDK
Firebase Firestore
```

Frontend nema direktan pristup bazi. Svi zahtjevi prema bazi idu preko Django backenda.

## 4. Baza podataka

Projekt koristi tri glavne Firestore kolekcije.

### users

Kolekcija `users` čuva korisničke podatke. Lozinka se ne sprema kao običan tekst, nego kao hash.

Polja:
- id
- username
- email
- passwordHash
- points

### challenges

Kolekcija `challenges` čuva fitness izazove.

Polja:
- id
- title
- description
- category
- difficulty
- target
- unit
- points
- image
- video

### submissions

Kolekcija `submissions` čuva rezultate korisnika.

Polja:
- id
- userId
- challengeId
- result
- completed
- date

## 5. Funkcionalnosti

### Registracija i prijava

Korisnik se registrira pomoću korisničkog imena, emaila, lozinke i potvrde lozinke. Frontend provjerava osnovne uvjete, a backend ponavlja validaciju. Nakon uspješne registracije ili prijave korisnik dobiva token koji se sprema u localStorage.

### Pregled izazova

Stranica Challenges dohvaća sve izazove iz backend API-ja i prikazuje ih u Bootstrap karticama. Filteri All, Strength, Cardio i Core implementirani su pomoću JavaScripta.

### Detalji izazova

Stranica Challenge Details prikazuje naziv, opis, kategoriju, težinu, bodove, cilj, sliku i YouTube video. Korisnik može poslati rezultat bez ponovnog učitavanja stranice.

### Bodovanje

Ako je rezultat veći ili jednak cilju izazova, rezultat se označava kao completed. Korisnik dobiva bodove za prvi uspješan završetak određenog izazova.

### Profil

Profil prikazuje korisničko ime, email, ukupne bodove, broj završenih izazova i popis vlastitih rezultata.

### Leaderboard

Leaderboard prikazuje top 10 korisnika sortiranih po bodovima.

### BMI kalkulator

BMI kalkulator nalazi se na Home stranici. Frontend šalje visinu i težinu na backend endpoint `/api/bmi`, backend računa BMI i vraća rezultat u JSON formatu.

## 6. API rute

| Metoda | Ruta | Opis |
|---|---|---|
| POST | `/api/register` | Registracija korisnika |
| POST | `/api/login` | Prijava korisnika |
| GET | `/api/challenges` | Dohvat svih izazova |
| GET | `/api/challenges/<id>` | Dohvat detalja izazova |
| POST | `/api/submissions` | Slanje rezultata |
| GET | `/api/my-submissions` | Dohvat vlastitih rezultata |
| GET | `/api/profile` | Dohvat profila |
| GET | `/api/leaderboard` | Dohvat top 10 korisnika |
| POST | `/api/bmi` | Izračun BMI vrijednosti |

## 7. Validacija

Frontend validacija:
- obavezna polja
- email format
- duljina lozinke
- potvrda lozinke
- numerički rezultat
- pozitivna visina i težina

Backend validacija:
- ponovljena validacija registracije
- provjera zauzetog emaila i korisničkog imena
- provjera lozinke kod prijave
- provjera tokena na zaštićenim rutama
- provjera numeričkog rezultata
- provjera BMI ulaza

## 8. Responzivnost

Dizajn je izveden pomoću Bootstrap grida i vlastitog CSS-a. Stranice su prilagođene za mobitel, tablet i desktop.

## 9. Literatura

- Django dokumentacija: https://docs.djangoproject.com/
- Django REST Framework dokumentacija: https://www.django-rest-framework.org/
- Firebase dokumentacija: https://firebase.google.com/docs/firestore
- Bootstrap dokumentacija: https://getbootstrap.com/docs/
- Bootstrap Icons: https://icons.getbootstrap.com/
- MDN Web Docs - Fetch API: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
- MDN Web Docs - HTML forms: https://developer.mozilla.org/en-US/docs/Learn/Forms
