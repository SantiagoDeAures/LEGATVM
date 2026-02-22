# LEGATVM DESIGN

## Functional Requirements

- An interface displaying all created volumes before logging in.

- The interface must have a header with buttons for logging in and registering, and a navbar with an "About" option.

- A presentation page explaining its main activity and contact information.

- The interface must have a search bar and category filters.

- The interface must have a banner with a GIF of a cinematic scene (this will be used for news in the future).

- If the user tries to access one of the volumes, they will be redirected to the login page.

- The login page must have email and password fields.

- The page must offer a "Forgot Password" option.

- The registration page must contain a form with the following fields:

* Email address

* Username

* Password

* Confirm password

- Each of these fields must be validated. The username and email address must not be in the database, and the passwords must match.

- Upon submitting the registration form, a confirmation email must be sent to the entered email address so that the account can be activated.

- The password recovery page must include a label indicating that the email address of the account for which the password is to be recovered must be entered, along with its corresponding input field and submit button.

- The input field must validate that the email address exists in the database.

- Upon confirmation of the email address, a password recovery message will be sent, and this email will redirect the user to a page to enter and confirm the new password.

- When the user is logged in, the header will change slightly, now displaying a navbar with profile, coin balance, and "About" information.

- The header will also have the option to display a modal with a button to go to "My Volumes," "My Profile," and a "Log Out" button.

- Clicking on a volume will display a preview in a modal, explaining the content. If it's not a free volume, it will show the price in coins and a button to start. If it's not the first time accessing the volume, the price will no longer be displayed, and the button will offer the option to continue.

- Progress through a volume will be saved, and the cinematic will resume after the last round of questions answered.

- If a user fails the test, they will have the option to revisit the volume or retake the test.

- The profile page will contain contact information.

## Non-Functional Requirements

- Passwords must be encrypted.

- Communication between the client and server must be exclusively via HTTPS.

- The system should only allow 5 login attempts per minute per IP address.

- The system should allow adding new modules without affecting existing functionality.

- The code must follow best practice standards and be properly documented.

- The system should not store payment information.

## Use Cases

- As a customer, I want to register to create an account in the system.

- As a customer, I want to log in to access my modules of interest.

- As a customer, I want to access the "Forgot your password?" option to recover my account.

- As a customer, I want to pay for a subscription volume to gain access to it.

- As a customer, I want to access a subscription volume to begin consuming the content.

- As a customer, I want to pause a subscription volume to continue later without losing my progress.

- As a customer, I want to resume a subscription volume to continue from where I left off.

## Business Rules

- The user will pass the tests when they achieve a score higher than 70%.

Newly registered users will have 150 coins available in their wallet.

## Data Model

### User 

```json
{ 
"id": "string", 
"username": "string", 
"password": "string", 
"email": "string"
}

```

### Volume 

```json
{ 
"id": "string", 
"title": "string", 
"description": "string", 
"categories": [], 
"price": "number", 
"thumbnail": "string"
}

```

### chapter 

```json
{ 
"id": "string", 
"volumeId": "string", 
"title": "string", 
"type": "string", 
"contentUrl": "string"
}

```

### Proof 

```json
{ 
"id": "string", 
"chapterId": "string", 
"questions": [], 
"timeLimit": "number"
}

```

### Question

```json
{
"id": "string",
"challengeId": "string",
"question": "string",
"options": [

{
"id": "string",
"text": "string"
}
],
"correctAnswers": []
}

```


### Volume Progress

```json
{
"userId": "string",
"volumeId": "string",
"completedChapters": [],
"progress": "number",
"completed": "boolean"
}

```

### Wallet

```json
{
"id": "string",
"userId": "string",
"balance": "number"
}

```

## Technologies to Use

The following technologies will be used to create the application:

Frontend: TypeScript, React, React DOM

Backend: TypeScript,NodeJS, Express, JWT, Rate Limiting

Database: PostgreSQL

These technologies were selected because they are the ones we have the most expertise in, but future changes are possible depending on the project's needs.



## API Endpoint Reference

### Auth Endpoints

---

#### `POST /api/auth/register`
**Auth:** None (public)

**Request body:**
```json
{ "email": "user@example.com", "username": "UserName", "password": "Str0ng!Pass" }
```

**201 — Success:**
```json
{ "message": "Registro exitoso. Revisa tu correo para activar tu cuenta" }
```

**400 — Missing fields:**
```json
{ "message": "Faltan campos requeridos" }
```

**409 — Email or username already exists:**
```json
{ "message": "Usuario o email ya existe" }
```

---

#### `POST /api/auth/login`
**Auth:** None (public)

**Request body:**
```json
{ "email": "ana@test.com", "password": "123456" }
```

**200 — Success:**
Sets `refreshToken` httpOnly cookie. Body:
```json
{
  "user": {
    "id": "user-uuid-1",
    "username": "Ana Developer",
    "email": "ana@test.com",
    "wallet": { "balance": 500 }
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIs..."
}
```
> Note: `refreshToken` is sent only via cookie, never in the response body.

**400 — Missing fields:**
```json
{ "message": "Faltan campos requeridos" }
```

**401 — Invalid credentials:**
```json
{ "message": "Credenciales inválidas" }
```

---

#### `POST /api/auth/logout`
**Auth:** None (uses `refreshToken` cookie)

**Request:** No body. Send the `refreshToken` cookie.

**204 — Success:**
Clears `refreshToken` cookie. Body:
```json
{ "message": "Sección cerrada exitosamente" }
```

**204 — Without cookie:** Also returns 204 (no-op).

---

#### `POST /api/auth/refresh`
**Auth:** None (uses `refreshToken` cookie)

**Request:** No body. Send the `refreshToken` cookie obtained from login.

**200 — Success:**
```json
{ "accessToken": "eyJhbGciOiJIUzI1NiIs..." }
```

**404 — Invalid/expired token:**
```json
{ "message": "token invalido" }
```

---

### Volume Endpoints

---

#### `GET /api/volumes`
**Auth:** None (public)

**Query params:** `?category=historia` (optional)

**200 — All volumes:**
```json
{
  "data": [
    { "id": "01", "title": "Historia de la IA", "thumbnail": "https://example.com/ia.jpg" },
    { "id": "02", "title": "Filosofía Griega", "thumbnail": "https://example.com/filosofia.jpg" }
  ]
}
```

**200 — Filtered (no match):**
```json
{ "data": [] }
```

---

#### `GET /api/volumes/:volumeId/continue`
**Auth:** Bearer token required

**Headers:** `Authorization: Bearer <accessToken>`

**200 — Next incomplete chapter:**
```json
{
  "id": "ch-03",
  "volumeId": "01",
  "title": "Redes neuronales",
  "type": "video",
  "contentUrl": "https://example.com/ch03.mp4",
  "isCompleted": false
}
```

**200 — All chapters completed:**
```json
{ "message": "Todos los capítulos completados", "completed": true }
```

**404 — Volume not found:**
```json
{ "message": "Volumen no encontrado" }
```

**401 — Not authenticated:**
```json
{ "message": "Token no proporcionado" }
```

> Side effect: marks the volume as "started" for the user.

---

#### `GET /api/volumes/:volumeId/:chapterId/prueba`
**Auth:** Bearer token required

**Headers:** `Authorization: Bearer <accessToken>`

**200 — Prueba found:**
```json
{
  "id": "01",
  "questions": [
    {
      "id": "q_01",
      "question": "¿Quién acuñó el término Inteligencia Artificial?",
      "options": [
        { "id": "a", "text": "Alan Turing" },
        { "id": "b", "text": "John McCarthy" },
        { "id": "c", "text": "Marvin Minsky" },
        { "id": "d", "text": "Claude Shannon" }
      ]
    }
  ]
}
```
> Note: correct answers are **not** exposed in the response.

**404 — Not found:**
```json
{ "message": "Prueba no encontrada" }
```

**401 — Not authenticated:**
```json
{ "message": "Token no proporcionado" }
```

---

#### `POST /api/pruebas/:pruebaId/submit`
**Auth:** Bearer token required

**Headers:** `Authorization: Bearer <accessToken>`

**Request body:**
```json
{
  "answers": [
    { "questionId": "q_01", "selectedOptions": ["b"] },
    { "questionId": "q_02", "selectedOptions": ["b"] },
    { "questionId": "q_03", "selectedOptions": ["b"] },
    { "questionId": "q_04", "selectedOptions": ["b"] },
    { "questionId": "q_05", "selectedOptions": ["b"] }
  ]
}
```

**200 — Passed (≥70%):**
```json
{
  "score": 100,
  "passed": true,
  "correctCount": 5,
  "totalQuestions": 5,
  "volumeCompleted": false
}
```

**200 — Failed (<70%):**
```json
{
  "score": 20,
  "passed": false,
  "correctCount": 1,
  "totalQuestions": 5
}
```
> Note: `volumeCompleted` is only present when `passed` is `true`.

**400 — Missing answers:**
```json
{ "message": "Se requieren las respuestas" }
```

**404 — Prueba not found:**
```json
{ "message": "Prueba no encontrada" }
```

**401 — Not authenticated:**
```json
{ "message": "Token no proporcionado" }
```

---

#### `POST /api/volumes/:volumeId/purchase`
**Auth:** Bearer token required

**Headers:** `Authorization: Bearer <accessToken>`

**Request:** No body needed.

**200 — Success:**
```json
{
  "message": "Volumen comprado exitosamente",
  "remainingBalance": 400
}
```

**409 — Already owned:**
```json
{ "message": "Ya posees este volumen" }
```

**404 — Volume not found:**
```json
{ "message": "Volumen no encontrado" }
```

**400 — Insufficient funds:**
```json
{ "message": "Saldo insuficiente" }
```

**401 — Not authenticated:**
```json
{ "message": "Token no proporcionado" }
```

---

#### `GET /api/volumes/:volumeId/started`
**Auth:** Bearer token required

**Headers:** `Authorization: Bearer <accessToken>`

**200 — Started:**
```json
{ "started": true }
```

**200 — Not started:**
```json
{ "started": false }
```

**404 — Volume not found:**
```json
{ "message": "Volumen no encontrado" }
```

**401 — Not authenticated:**
```json
{ "message": "Token no proporcionado" }
```

---

### User Endpoints

---

#### `GET /api/users/volumes`
**Auth:** Bearer token required

**Headers:** `Authorization: Bearer <accessToken>`

**200 — User's owned volumes:**
```json
{
  "data": [
    { "id": "01", "title": "Historia de la IA", "thumbnail": "https://example.com/ia.jpg" }
  ]
}
```

**401 — Not authenticated:**
```json
{ "message": "Token no proporcionado" }
```

---

### Summary Table

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login, get tokens |
| POST | `/api/auth/logout` | Cookie | Revoke refresh token |
| POST | `/api/auth/refresh` | Cookie | Get new access token |
| GET | `/api/volumes` | Public | List all volumes (optional `?category`) |
| GET | `/api/volumes/:volumeId/continue` | Bearer | Get next chapter + mark started |
| GET | `/api/volumes/:volumeId/:chapterId/prueba` | Bearer | Get prueba questions |
| POST | `/api/pruebas/:pruebaId/submit` | Bearer | Submit prueba answers |
| POST | `/api/volumes/:volumeId/purchase` | Bearer | Purchase a volume |
| GET | `/api/volumes/:volumeId/started` | Bearer | Check if volume was started |
| GET | `/api/users/volumes` | Bearer | List user's owned volumes |
| GET | `/:volumeId` | Bearer | Volume details |

