# DISEÑO DE LEGATVM

## Requisitos Funcionales

- Una interfaz con todos los volúmenes creados antes de logerse.

- La interfaz debe tener un header con el botón de iniciar sección, registrarse y un navbar con la opción de ir a acerca de.

- Una página de presentación, explicando su actividad principal y sus contactos.

- La interfaz debe tener barra de busqueda y filtros por categorías.

- La interfaz debe tener un banner con un GIF con una escena cinematografica (En un futuro será utilizado para las novedades)

- Si el usuario trata de acceder a uno de los volmenes se abrirá el modal para logearse.

- El modal para logearse debe tener input de correo electronico y contraseña.

- El modal debe ofrecer opción para autenticarse con Google.

- El modal debe ofrecer opción de registrarse y de olvide contraseña.

- La página de registro debe contener un formulario con los siguientes campos:

    * Correo electronico
    * Nombre de uuario
    * Contraseña
    * Confirmar contraseña

- Cada uno de estos campos debe validarse, el nombre usuario y el correo no deben estar en la base de datos y las contraseñas deben coincidir.

- Al enviar el formulario de registro se debe enviar un correo de confirmación al correo electronico ingresado para que la cuenta pueda activarse.

- En la página de recuperar contraseña debe haber un label inidicando que se ingrese el correo de la cuenta de la cual se desea recuperar la contraseña y su respectivo Input y botón de envio.

- El input debe validar que el correo exista en la base de datos.

- Al confirmarse el correo, se enviará un mensaje de recuperación de contraseña y este correo le redigirá a una página para ingresar la nueva contraseña y la confirmación de esta.

- Se enviará un correo indicando que el cambio de contraseña fue exitoso.

- Cuando el usuario este logeado el header cambiara un poco, ahora tendrá un navbar con perfil, pricing y acerca de.

- El header también tendrá un botón de ir a mis volúmenes, cantidad de monedas disponibles y botón de cerrar sección.

- Al darle click a uno de los volúmenes se mostrará una vista previa en un modal, explicando el contenido, si no es un volumen gratuito mostrará el precio en cantidad de monedas y un botón con la opción de iniciar, si no es la primera vez que se accede al volumen ya no mostrará el costo, el botón dará la opción de continuar y la barra de progreso.

- Al avanzar con un volumen se guardará el progreso, y se retomará con la cinematica siguiente a la última ronda de preguntas respondidas.

- En los desafios que incluyan cuestionarios, para algunas preguntas puntuales habrá un reloj de cuenta regresiva, enseñando el tiempo restante para responder la pregunta.

- Cuando un usuario no pasa la prueba tendrá las opciones de volver a ver el volumen o de reintentar la prueba

- La página del perfil tendrá la información del contacto, y la opción de editar ciertos datos.

- La página de pricing ofrecerá diferentes promociones para adquirir monedas para acceder a los volúmenes.


## Requisitos No Funcionales

- Las contraseñas deben cifrarse.

- La comunicación entre cliente y servidor debe realizarse exclusivamente mediante HTTPS.

- El sistema solo debe permitir 5 intentos de login por minuto por IP

- El sistema debe permitir agregar nuevos módulos sin afectar el funcionamiento existente.

- El código debe seguir estándares de buenas prácticas y estar debidamente documentado.

- El sistema no debe almacenar información de medios de pago.

## Casos de Uso

- Como usuario cliente quiero registrarme para obtener mi cuenta en el sistema.

- Como usuario cliente quiero logearme para acceder a mis módulos de interés.

- Cómo usuario cliente quiero acceder a "olvide mi contraseña" para recuperar mi cuenta.

- Como usuario cliente quiero acceder a la sección de pricing para recargar mi cartera y adquirir más volúmenes.


## Reglas de Negocio

- El usuario pasará las pruebas cuando tenga un puntaje mayor al 70% de aprobación.

- El usuario que recién se registre tendrá disponibles en su cartera 150 modenas.

## Modelo de Datos

### Usuario

 ```json
{
    "id": "string",
    "username": "string",
    "password": "string",
    "email": "string"
}

```

### Volumen

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

### capítulo

 ```json
{
    "id": "string",
    "volumeId": "string",
    "title": "string",
    "type": "string",
    "contentUrl": "string"
}

```

### Prueba

 ```json
{
    "id": "string",
    "chapterId": "string",
    "questions": [],
    "timeLimit": "number"
}

```

### Pregunta

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


### Progreso de Volumen

 ```json
{
    "userId": "string",
    "volumeId": "string",
    "completedChapters": [],
    "progress": "number",
    "completed": "boolean"
}

```

## Tecnologías a Utilizar

Para la creación de la aplicación se hara uso de las siguientes tecnologías:

Frontend: TypeScript, React, React DOM

Backend: NodeJS, Express, JWT, Rate Limiting

Base de datos: PostgreSQL

Estas tecnologías fueron seleccionados debido a que son sobre las cuales se tiene mayor dominio, pero no se descartan futuros cambios de acuerdo a las necesidades del proyecto.


## Endpoints API

### Usuario

### Registrar usuario

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

### Autenticación de Usuario

**POST** `/api/auth/login`

Request:

 ```json
{
    "email": "example@email.com",
    "password": "./gbo18InP"
}

```

Response: `200`
 
 ```json
{
    "accesToken": "abc123xyz"
}

```

### Cerrar sesión 

**POST** `/api/auth/logout`

Response: `204`

Headers:

Cookie: refreshToken=xyz
Authorization: Bearer <accessToken>


### Volumen

### Obtener Volúmenes

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

### Obtener detalles del volumen

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

### Capítulo

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

### Prueba

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