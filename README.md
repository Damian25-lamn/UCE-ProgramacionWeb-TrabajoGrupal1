# TRABAJO GRUPAL 1: API REST HELIDON SE 4.5 PROGRAMACIÓN WEB 

---

## 👥 Integrantes
*   **Mouaaz Alammarin** - Cédula: 1758008781
*   **Damian Minda** - Cédula: 1724637119
*   **Francis Pulles** - Cédula: 
*   **Santiago Villarreal** - Cédula: 1724486921

---

## Tabla de Mapeo de Arquitectura Backend
Mapeo de la migración tecnológica realizada para eliminar el stack anterior y adoptar componentes reactivos nativos:

| Framework Eliminado                               | Módulo/Componente Helidon SE 4.5 (Nuevo)                                     | Propósito de la Migración |
|:--------------------------------------------------|:-----------------------------------------------------------------------------| :--- |
| `Jakarta RESTful Web Services (JAX-RS)`           | `helidon-webserver` / `HttpRouting`                                          | Enrutamiento declarativo e imperativo puro sin anotaciones de reflexión. |
| `@Path`, `@GET`, `@POST`, `@PUT`, `@DELETE`       | `HttpRules` (`rules.get()`, `rules.post()`, `rules.put()`, `rules.delete()`) | Definición funcional y explícita de endpoints mediante lambdas y referencias a métodos. |
| `Jakarta Persistence API (JPA / Hibernate)`       | `helidon-dbclient` / `helidon-dbclient-jdbc`                                 | Consultas directas sin sobrecarga de ORM utilizando reactividad asíncrona sobre JDBC. |
| `Jakarta Contexts and Dependency Injection (CDI)` | Composición Manual en Clase `Main`                                           | Inyección de dependencias limpia y explícita por constructor, eliminando contenedores opacos. |
| Filtros JAX-RS / Interceptores                    | `routing.addFilter()` Manual                                                 | Implementación personalizada de filtros HTTP para procesamiento transversal de solicitudes y respuestas. |
| `@Provider` / `ExceptionMapper`                   | `routing.error(Throwable.class, ...)`                                        | Manejo centralizado global de excepciones mapeado directamente a respuestas JSON. |

---

## Tabla de Versiones del Frontend
Tecnologías implementadas en la SPA (Single Page Application) cliente para la gestión de la interfaz:

| Herramienta / Librería | Versión | Propósito en el Proyecto |
| :--- | :--- | :--- |
| **React** | v18.x / v19.x | Biblioteca base para la construcción de la interfaz por componentes. |
| **Vite** | v5.x / v6.x | Entorno de desarrollo rápido y empaquetador (Bundler) optimizado. |
| **React Router** | v6.x | Enrutamiento declarativo en el cliente para la navegación SPA. |
| **Redux Toolkit** | v2.x | Gestión del estado global y centralizado para las 6 entidades de la aplicación. |

---

---

## Diagrama de Estructura de Paquetes

### Backend (Helidon SE 4.5)
```text
src/
└── main/
    ├── java/
    │   └── com.programacion.web/
    │       ├── config/
    │       │   └── GlobalExceptionHandler.java
    │       │
    │       ├── mapper/  # Mappers funcionales para transformar DbRow de PostgreSQL a POJOs
    │       │   ├── AlbumMapper.java
    │       │   ├── CommentMapper.java
    │       │   ├── PhotoMapper.java
    │       │   ├── PostMapper.java
    │       │   ├── TodoMapper.java
    │       │   └── UserMapper.java
    │       │
    │       ├── modelo/   # Entidades de la aplicación
    │       │   ├── Address.java
    │       │   ├── Album.java
    │       │   ├── Comment.java
    │       │   ├── Company.java
    │       │   ├── Geo.java
    │       │   ├── Photo.java
    │       │   ├── Post.java
    │       │   ├── Todo.java
    │       │   └── User.java
    │       │
    │       ├── repository/  # Capa de persistencia nativa con DbClient
    │       │   ├── AlbumRepository.java
    │       │   ├── CommentRepository.java
    │       │   ├── PhotoRepository.java
    │       │   ├── PostRepository.java
    │       │   ├── TodoRepository.java
    │       │   └── UserRepository.java
    │       │
    │       ├── service/  # Capa de servicios y lógica de negocio (Handlers HTTP)
    │       │   ├── AlbumService.java
    │       │   ├── CommentService.java
    │       │   ├── PhotoService.java
    │       │   ├── ErrorResponse.java
    │       │   ├── PostService.java
    │       │   ├── TodoService.java
    │       │   └── UserService.java
    │       │
    │       └── Main.java  # Punto de entrada único, configuración de Routing y CORS
    │
    └── resources/
        ├── application.yaml
        ├── Creacion_tablas.sql
        └── Insercion_datos.sql
```
### Frontend (React + TypeScript)
```text


```

##  Transcripción de Pruebas de los Endpoints del Backend 
A continuación se detallan las solicitudes HTTP mediante `curl` y los formatos de respuesta para cada operación CRUD del sistema:
### 1. Entidad: Usuarios (`/api/users`)
Esta sección documenta las 5 operaciones CRUD requeridas para la gestión de usuarios:

#### 1) Listar Todos los Usuarios
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/users
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    [
      {
        "address":{
          "city":"Quito",
          "geo":{
            "lat":"-0.1807",
            "lng":"-78.4678"
          },
          "street":"Calle Falsa 123",
          "suite":"Apt 1",
          "zipcode":"170101"
        },
        "company":{
          "bs":"Software Development",
          "catchPhrase":"Coding the future",
          "name":"Mi Empresa"
        },
        "email":"anthony@mail.com",
        "id":1,"name":"Anthony Minda",
        "phone":"0999999999",
        "username":"anthonyminda",
        "website":"github.com/anthony"
      }
    ]
    ```

#### 2) Buscar Usuario por ID 

*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/users/1
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    {
      "address":{
        "city":"Quito",
        "geo":{
          "lat":"-0.1807",
          "lng":"-78.4678"
        },
        "street":"Calle Falsa 123",
        "suite":"Apt 1",
        "zipcode":"170101"
      },
      "company":{
        "bs":"Software Development",
        "catchPhrase":"Coding the future",
        "name":"Mi Empresa"
      },
      "email":"anthony@mail.com",
      "id":1,
      "name":"Anthony Minda",
      "phone":"0999999999",
      "username":"anthonyminda",
      "website":"github.com/anthony"
    }
    ```

#### 3) Crear un Nuevo Usuario 
*   **Comando de ejecución:**
    ```bash
    curl -X POST http://localhost:8080/api/users \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Carlos Perez",
        "username": "carlitos",
        "email": "carlos@mail.com",
        "address": {
          "street": "Calle Secundaria",
          "suite": "Oficina 302",
          "city": "Guayaquil",
          "zipcode": "090150",
          "geo": {
            "lat": "-2.1700",
            "lng": "-79.9224"
          }
        },
        "phone": "0987654321",
        "website": "carlos.org",
        "company": {
          "name": "Perez Tech",
          "catchPhrase": "Innovacion digital",
          "bs": "consultoria"
        }
      }'
    ```
*   **Respuesta del Servidor (HTTP 201 Created):**
    ```json
    {
      "address":{
        "city":"Guayaquil",
        "geo":{
          "lat":"-2.1700",
          "lng":"-79.9224"
        },
        "street":"Calle Secundaria",
        "suite":"Oficina 302",
        "zipcode":"090150"
      },
      "company":{
        "bs":"consultoria",
        "catchPhrase":"Innovacion digital",
        "name":"Perez Tech"
      },
      "email":"carlos@mail.com",
      "id":2,
      "name":"Carlos Perez",
      "phone":"0987654321",
      "username":"carlitos",
      "website":"carlos.org"
    }
    ```

#### 4) Actualizar Usuario Existente (Update)
*   **Comando de ejecución:**
    ```bash
    curl -X PUT http://localhost:8080/api/users/1 \
      -H "Content-Type: application/json" \
      -d '{
        "name": "Santiago V. Modificado",
        "username": "santi",
        "email": "santiago.new@mail.com",
        "address": {
          "street": "Av. Central Modificada",
          "suite": "Apt. 5",
          "city": "Quito",
          "zipcode": "170150",
          "geo": {
            "lat": "-0.1807",
            "lng": "-78.4678"
          }
        },
        "phone": "0999999999",
        "website": "santiago.dev",
        "company": {
          "name": "DevSolutions S.A.S.",
          "catchPhrase": "Procesos optimizados",
          "bs": "cloud-software"
        }
      }'
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

#### 5) Eliminar un Usuario (Delete)
*   **Comando de ejecución:**
    ```bash
    curl -X DELETE http://localhost:8080/api/users/2
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```
### 2. Entidad: Publicaciones (`/api/posts`)

Esta sección documenta las 5 operaciones CRUD requeridas para la gestión de posts:
#### 6) Listar Todos los Posts
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/posts
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    [
      {
        "body":"Analisis detallado sobre como desacoplar un monolito Jakarta EE utilizando enrutamiento puramente funcional.",
        "id":2,
        "title":"Migracion Exitosa a Microservicios",
        "userId":1
      },
      {
        "body":"Cuerpo actualizado: Helidon SE optimiza los tiempos de respuesta utilizando hilos virtuales de Java 21.",
        "id":1,
        "title":"Arquitecturas Reactivas con Helidon SE v4.5",
        "userId":1
      }
    ]
    ```

#### 7) Buscar Post por ID 
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/posts/1
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    {
      "body":"Este es el cuerpo del post para probar la persistencia con DbClient.",
      "id":1,
      "title":"Mi Primer Post en Helidon",
      "userId":1
    }
    ```

#### 8) Crear un Nuevo Post
*   **Comando de ejecución:**
    ```bash
    curl -X POST http://localhost:8080/api/posts \
      -H "Content-Type: application/json" \
      -d '{
        "userId": 1,
        "title": "Migracion Exitosa a Microservicios",
        "body": "Analisis detallado sobre como desacoplar un monolito Jakarta EE utilizando enrutamiento puramente funcional."
      }'
    ```
*   **Respuesta del Servidor (HTTP 201 Created):**
    ```json
    {
      "body":"Analisis detallado sobre como desacoplar un monolito Jakarta EE utilizando enrutamiento puramente funcional.",
      "id":2,
      "title":"Migracion Exitosa a Microservicios",
      "userId":1
    }
    ```

#### 9) Actualizar un Post Existente
*   **Comando de ejecución:**
    ```bash
    curl -X PUT http://localhost:8080/api/posts/1 \
      -H "Content-Type: application/json" \
      -d '{
        "userId": 1,
        "title": "Arquitecturas Reactivas con Helidon SE v4.5",
        "body": "Cuerpo actualizado: Helidon SE optimiza los tiempos de respuesta utilizando hilos virtuales de Java 21."
      }'
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

#### 10) Eliminar un Post
*   **Comando de ejecución:**
    ```bash
    curl -X DELETE http://localhost:8080/api/posts/2
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

### 3. Entidad: Comentarios (`/api/comments`)

Esta sección documenta las 5 operaciones CRUD requeridas para la gestión de comentarios:

#### 11) Listar Todos los Comentarios 
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/comments
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    [
      {
        "body":"Excelente inicio de proyecto",
        "email":"santiago@mail.com",
        "id":1,
        "name":"Santiago Villarreal",
        "postId":1
      }
    ]
    ```

#### 12) Buscar Comentario por ID 
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/comments/1
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    {
      "body":"Excelente inicio de proyecto",
      "email":"santiago@mail.com",
      "id":1,
      "name":"Santiago Villarreal",
      "postId":1
    }
    ```

#### 13) Crear un Nuevo Comentario 
*   **Comando de ejecución:**
    ```bash
    curl -X POST http://localhost:8080/api/comments \
      -H "Content-Type: application/json" \
      -d '{
        "postId": 1,
        "name": "Duda sobre el rendimiento",
        "email": "dev.test@mail.com",
        "body": "Una consulta, ¿cómo maneja Helidon SE la concurrencia bajo hilos virtuales en este endpoint?"
      }'
    ```
*   **Respuesta del Servidor (HTTP 201 Created):**
    ```json
    {
      "body":"Una consulta, ¿c�mo maneja Helidon SE la concurrencia bajo hilos virtuales en este endpoint?",
      "email":"dev.test@mail.com",
      "id":2,
      "name":"Duda sobre el rendimiento",
      "postId":1
    }
    ```

#### 14) Actualizar un Comentario Existente 
*   **Comando de ejecución:**
    ```bash
    curl -X PUT http://localhost:8080/api/comments/1 \
      -H "Content-Type: application/json" \
      -d '{
        "postId": 1,
        "name": "Excelente enfoque técnico - Modificado",
        "email": "estudiante.cs@mail.com",
        "body": "Texto actualizado: Un enfoque impecable sobre la inyección manual en la clase Main."
      }'
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

#### 15) Eliminar un Comentario 
*   **Comando de ejecución:**
    ```bash
    curl -X DELETE http://localhost:8080/api/comments/2
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

### 4. Entidad: Álbumes (`/api/albums`)

Esta sección detalla las 5 operaciones CRUD para la gestión de álbumes:

#### 16) Listar Todos los Álbumes
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/albums
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    [
      {
        "id":1,
        "title":"Fotos del Proyecto",
        "userId":1
      }
    ]
    ```

#### 17) Buscar Álbum por ID 
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/albums/1
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    {
      "id":1,
      "title":"Fotos del Proyecto",
      "userId":1
    }
    ```

#### 18) Crear un Nuevo Álbum
*   **Comando de ejecución:**
    ```bash
    curl -X POST http://localhost:8080/api/albums \
      -H "Content-Type: application/json" \
      -d '{
        "userId": 1,
        "title": "Capturas de Evidencias Técnicas"
      }'
    ```
*   **Respuesta del Servidor (HTTP 201 Created):**
    ```json
    {
      "id":2,
      "title":"Capturas de Evidencias T�cnicas",
      "userId":1
    }
    ```

#### 19) Actualizar un Álbum Existente
*   **Comando de ejecución:**
    ```bash
    curl -X PUT http://localhost:8080/api/albums/1 \
      -H "Content-Type: application/json" \
      -d '{
        "userId": 1,
        "title": "Fotografías Proyecto de Integración - Versión Final"
      }'
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

#### 20) Eliminar un Álbum
*   **Comando de ejecución:**
    ```bash
    curl -X DELETE http://localhost:8080/api/albums/2
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

### 5. Entidad: Fotos (`/api/photos`)

Esta sección documenta las 5 operaciones CRUD  para la gestión de fotos:

#### 21) Listar Todas las Fotos
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/photos
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    [
      {
        "albumId":1,
        "id":1,
        "thumbnailUrl":"http://ejemplo.com/thumb.png",
        "title":"Arquitectura Helidon",
        "url":"http://ejemplo.com/foto.png"
      }
    ]
    ```

#### 22) Buscar Foto por ID
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/photos/1
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    {
      "albumId":1,
      "id":1,
      "thumbnailUrl":"http://ejemplo.com/thumb.png",
      "title":"Arquitectura Helidon",
      "url":"http://ejemplo.com/foto.png"
    }
    ```

#### 23) Crear una Nueva Foto
*   **Comando de ejecución:**
    ```bash
    curl -X POST http://localhost:8080/api/photos \
      -H "Content-Type: application/json" \
      -d '{
        "albumId": 1,
        "title": "Diagrama de Arquitectura Helidon SE",
        "url": "[https://via.placeholder.com/600/771796](https://via.placeholder.com/600/771796)",
        "thumbnailUrl": "[https://via.placeholder.com/150/771796](https://via.placeholder.com/150/771796)"
      }'
    ```
*   **Respuesta del Servidor (HTTP 201 Created):**
    ```json
    {
      "albumId":1,
      "id":2,
      "thumbnailUrl":"[https://via.placeholder.com/150/771796](https://via.placeholder.com/150/771796)",
      "title":"Diagrama de Arquitectura Helidon SE",
      "url":"[https://via.placeholder.com/600/771796](https://via.placeholder.com/600/771796)"
    }
    ```

#### 24) Actualizar una Foto Existente 
*   **Comando de ejecución:**
    ```bash
    curl -X PUT http://localhost:8080/api/photos/1 \
      -H "Content-Type: application/json" \
      -d '{
        "albumId": 1,
        "title": "Interfaz Login - Producción",
        "url": "[https://via.placeholder.com/600/24f355](https://via.placeholder.com/600/24f355)",
        "thumbnailUrl": "[https://via.placeholder.com/150/24f355](https://via.placeholder.com/150/24f355)"
      }'
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

#### 25) Eliminar una Foto 
*   **Comando de ejecución:**
    ```bash
    curl -X DELETE http://localhost:8080/api/photos/2
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

### 6. Entidad: Tareas (`/api/todos`)

Esta sección documenta  5 operaciones CRUD gestionar Todos:

#### 26) Listar los Todos
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/todos
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    [
      {
        "completed":false,
        "id":1,
        "title":"Migrar capa de persistencia a DbClient",
        "userId":1
      }
    ]
    ```

#### 27) Buscar un Todo por ID 
*   **Comando de ejecución:**
    ```bash
    curl -X GET http://localhost:8080/api/todos/1
    ```
*   **Respuesta del Servidor (HTTP 200 OK):**
    ```json
    {
      "completed":false,
      "id":1,
      "title":"Migrar capa de persistencia a DbClient",
      "userId":1
    }
    ```

#### 28) Crear un Nuevo Todo
*   **Comando de ejecución:**
    ```bash
    curl -X POST http://localhost:8080/api/todos \
      -H "Content-Type: application/json" \
      -d '{
        "userId": 1,
        "title": "Estructurar mappers funcionales para DbClient",
        "completed": false
      }'
    ```
*   **Respuesta del Servidor (HTTP 201 Created):**
    ```json
    {
      "completed":false,
      "id":2,
      "title":"Estructurar mappers funcionales para DbClient",
      "userId":1
    }
    ```

#### 29) Actualizar un Todo Existente
*   **Comando de ejecución:**
    ```bash
    curl -X PUT http://localhost:8080/api/todos/2 \
      -H "Content-Type: application/json" \
      -d '{
        "userId": 1,
        "title": "Estructurar mappers funcionales para DbClient",
        "completed": true
      }'
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

#### 30) Eliminar un Todo
*   **Comando de ejecución:**
    ```bash
    curl -X DELETE http://localhost:8080/api/todos/2
    ```
*   **Respuesta del Servidor (HTTP 204 No Content):**
    ```text
    (El servidor responde con estado exitoso 204 sin cuerpo de texto)
    ```

## App Web ejecutando las operaciones CRUD 






## Instrucciones de Ejecución del Proyecto

Para ejecutar correctamente el ecosistema completo de la aplicación, siga el siguiente orden de inicio.  
Este flujo garantiza que la base de datos y el backend estén disponibles antes de que el frontend intente consumir los servicios de la API.

### 1. Levantar la Base de Datos (PostgreSQL)

Antes de iniciar la aplicación:

1. Antes de iniciar la aplicación, asegúrate de tener instalado PostgreSQL y ejecutándose el servicio de base de datos. Desde PgAdmin, crea una base de datos con la configuración requerida por el proyecto:

- Nombre de la base de datos: `DbClient`
- Usuario: `postgres`
- Contraseña: `postgres`
- Puerto: `5432`

2. Desde IntelliJ IDEA, abre la ventana de herramientas de base de datos y establece la conexión con PostgreSQL utilizando la base de datos `DbClient`.

3. Ejecuta dentro de IntelliJ los scripts SQL de creación de tablas incluidos en el proyecto.

---

### 2. Iniciar el Backend (Helidon SE)

Abre una nueva terminal en la carpeta raíz del backend y ejecuta el siguiente comando para compilar e iniciar el servidor API:

```bash
./gradlew run
```

El backend estará disponible en el puerto:

```
http://localhost:8080
```

Espera hasta que la consola indique que el servidor está listo para recibir solicitudes antes de iniciar el frontend.

---

### 3. Instalar Dependencias del Frontend (React)

Abre otra terminal ubicada en la carpeta raíz del frontend y descarga las dependencias definidas en el archivo `package.json`:

```bash
npm install
```

Este paso solo es necesario la primera vez o cuando se agreguen nuevas dependencias al proyecto.

---

### 4. Iniciar el Frontend (React + Vite)

Una vez instaladas las dependencias, inicia el servidor de desarrollo del cliente:

```bash
npm run dev
```

Por defecto, la aplicación estará disponible en:

```
http://localhost:5173
```

Abre esta dirección en el navegador para acceder a la interfaz web.

---

### Orden de ejecución resumido

1. PostgreSQL → `Crea la base DbClient`
2. Backend Helidon SE → `./gradlew run`
3. Dependencias React → `npm install`
4. Frontend Vite → `npm run dev`










