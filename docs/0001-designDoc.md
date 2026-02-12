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


## Endpoints API

### User

### Register User

**POST**  `/api/auth/register`

Request:
 
 ```json
{
    "email": "example@email.com",
    "username": "user10",
    "password": "./gbo18InP",
}

```

Response: ``201 created`
 
 ```json
{
    "message": "Registro exitoso. Revisa tu correo para activar tu cuenta"
}

```

**POST**  `/api/auth/verify-email`

Request:

 ```json
{
    "token": "abc123xyz"
}

```

Response: ``200`
 
 ```json
{
    "message": "Has activado tu cuenta, ahora puedes iniciar sección"
}

```

### User Authentication

**POST** `/api/auth/login`

Request:

 ```json
{
    "email": "example@email.com",
    "password": "./gbo18InP"
}

```

Response: `200`
 

### Log Out

**POST** `/api/auth/logout`

Response: `204`

Cookie: refreshToken=xyz


### Refresh Token

**POST** `/api/auth/refresh`

Response: `200`

Cookie: refreshToken=xyz


### Volume

### Get Volumes

**GET** `/api/volumes`

Query params (opcinal)

?category=javascript
&level=beginner
&page=1
&limit=10

Response: `200`
 
 ```json
{
    {
  "data": [
    {
      "id": "01",
      "title": "Historia de la IA",
      "thumbnail": "url"
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 3
  }
}

}

```

### Get My Volumes

**GET** `/api/users/volumes`

Response: `200`
 
 ```json
{
    {
  "data": [
    {
      "id": "01",
      "title": "Historia de la IA",
      "thumbnail": "url"
    }
  ],
  "pagination": {
    "page": 1,
    "totalPages": 3
  }
}

}

```
### Get volume details

**GET** `/api/volumes/:volumId`

Response: `200`
 
 ```json
{
  "id": "01",
  "title": "Historia de la IA",
  "description": " La IA ...",
  "categories": ["historia", "tecnología"],
}

```

### Chapter

**GET** `/api/volumes/:volumeId/chapters`

Response: `200`
 
 ```json
{
  "id": "01",
  "title": "El sueño antiguo de crear inteligencia",
  "type": "video",
  "isCompleted": "false"
}

```

### Test

**GET** `/api/volumes/:volumeId/:chapterId/prueba`

Response: `200`
 
 ```json
{
  "id": "01",
  "timeLimit": 600,
  "questions": [
    {
      "id": "q_01",
      "type": "multiple_choice",
      "question": "¿Por qué el deseo de crear inteligencia artificial existe desde antes de las computadoras?",
      "options": [
        { "id": "a", "text": "Porque la inteligencia se percibe como algo mágico" },
        { "id": "b", "text": "Porque el ser humano busca comprender y replicar su propia mente" },
        { "id": "c", "text": "Porque las máquinas siempre han sido parte de la sociedad" },
      ]
    }
  ]
}

```

**POST** `/api/pruebas/pruebaId/submit`

Request:

 ```json
{
    "answers": [
        {
            "questionId": "q_01",
            "selectedOptions": ["b"]
        }
    ]
}

```