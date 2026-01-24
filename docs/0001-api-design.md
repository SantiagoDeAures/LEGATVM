# DISEÑO DE LEGATVM

# Requisitos Funcionales

- Una interfaz con todos los volúmenes creados antes de logerse.

- La interfaz debe tener un header con el botón de iniciar sección, registrarse y un navbar con la opción de ir a acerca de LEGATVM.

- Una página de presentación de LEGATVM, explicando su actividad principal y sus contactos.

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

- En la página de recuperar contraseña debe haber un label inidcando que se ingrese el correo de la cuenta de la cual se desea recuperar la contraseña y su respectivo Input y botón de envio.

- El input debe validar que el correo exista en la base de datos.

- Al confirmarse el correo, se enviará un mensaje de recuperación de contraseña y este correo le redigirá a una página para ingresar la nueva contraseña y la confirmación de esta.

- Se enviará un correo indicando que el cambio de contraseña fue exitoso.

- Cuando el usuario este logeado el header cambiara un poco, ahora tendrá un navbar con perfil, pricing y acerca de LEGATVM.

- El header también tendrá un botón de ir a mis volúmenes, cantidad de monedas disponibles y botón de cerrar sección.

- Al avanzar con un volumen se guardará el progreso, y se retomará con la cinematica siguiente a la última ronda de preguntas respondidas.

- La página del perfil tendrá la información del contacto, y la opción de editar ciertos datos.

- La página de pricing ofrecerá diferentes promociones para adquirir monedas para acceder a los volúmenes.


# Requisitos No Funcionales