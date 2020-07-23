# servinol-API
API REST para tienda en linea servinol

# Autorización
La mayoría de las peticiones requieren autorización para procesarse. La autorización se verifica enviando con la petición el header **authorization**.
Para obtener un token es necesario autenticarse en **/api/users/login**

En caso de hacer una petición sin los permisos suficientes se recibirá una de las siguientes respuestas según el caso:
- **401**: Se requiere renovar la autenticación.
  - Body: ***Token expired***
- **403**: Acceso sin los permisos requeridos.
  - Body: ***Forbidden***

# /api/users
Se encarga de todas las operaciones relacionadas a los usuarios.
Los objetos de usuario tienen la siguiente estructura: 
```
    {
        id: int,
        email: string,
        password: string,
        name: string,
        role: string
    }
```

## Registro
- Ruta: **/api/users**
- Petición: **POST**
- Restricción: ninguna.
- Cuerpo de la petición:
```
{
    "email": string,
    "password": string
}
```
### Respuestas:
- **201:** El usuario se registró exitosamente. Responde con el usuario recién creado.
  - Body: Un objeto con los datos del usuario creado.

- **400:** El usuario no se pudo registrar por que ya existe una cuenta con el mismo email.
  - Body: ***Duplicated email***

## Consulta de todos los usuarios
- Ruta: **/api/users**
- Petición: **GET**
- Restricción: Autenticación de usuario con rol de administrador.
### Respuestas:
- **200**: Peticion aceptada.
  - Body: Arreglo con los objetos de los usuarios obtenidos.

## Consulta de un usuario
- Ruta: **/api/users/:id**
- Petición: **GET**
- Restricción: Una o ambas condiciones:
  - El usuario a consultar es el mismo que hace la petición.
  - Petición hecha por un usuario con permisos de admin.
### Respuestas:
- **200**: Peticion aceptada.
  - Body: Objeto con los datos del usuario.

- **404**: Usuario no encontrado.
  - Body: ***User not found***

### Actualización
- Ruta: **/api/users/:id**
- Petición: **PUT**
- Restricción: Una o ambas condiciones:
  - El usuario a actualizar es el mismo que hace la petición.
  - Petición hecha por un usuario con permisos de admin.
- Cuerpo de la petición: Objeto con los campos a actualizar. Ejemplos:
```
{
    "password": "MyNewPassword"
}
{
    "name": "MyNewName",
    "password": "AnotherPassword"
}
```
### Respuestas:
- **204**: Actualización realizada.
  - Body: *VACIO*
- **400**: Se intentó actualizar un campo no permitido (id, email).
  - Body: ***Tried to update fixed value***

### Eliminación
- Ruta: **/api/users/:id
- Petición: **DELETE**
- Restricción: Una o ambas condiciones:
  - El usuario a actualizar es el mismo que hace la petición.
  - Petición hecha por un usuario con permisos de admin.
### Respuestas
- **204**: Usuario eliminado.
  - Body: *VACIO*
- **404**: Usuario no encontrado.
  - Body: ***User not found***