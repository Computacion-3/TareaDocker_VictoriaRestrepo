# API Contract - Plataforma de actividad fisica Icesi

Base host local: `http://localhost:8080`

Context path actual: `/TallerJPA-0.0.1-SNAPSHOT`

API base URL local: `http://localhost:8080/TallerJPA-0.0.1-SNAPSHOT/api/v1`

Todas las rutas REST documentadas abajo conservan el prefijo `/api/v1`. La URL completa se forma con: base host + context path + ruta REST. Por ejemplo, `POST /api/v1/auth/login` equivale a `POST http://localhost:8080/TallerJPA-0.0.1-SNAPSHOT/api/v1/auth/login`.

Nota: el context path actual existe porque el backend esta configurado/desplegado como WAR con `/TallerJPA-0.0.1-SNAPSHOT`. Si mas adelante se simplifica el context path, se debe actualizar este contrato y la configuracion del frontend.

Autorizacion: enviar JWT en `Authorization: Bearer <token>` despues de login.

Errores de seguridad REST:

- Sin token o con token invalido en rutas protegidas: `401 Unauthorized` con JSON.
- Token valido sin permisos suficientes: `403 Forbidden` con JSON.
- Las rutas REST bajo `/api/v1/**` no redirigen al login HTML.

Roles disponibles: `ADMIN`, `TRAINER`, `USER`.

CORS de desarrollo: `http://localhost:5173` y `http://127.0.0.1:5173`.

Errores REST: las respuestas de error usan JSON con `timestamp`, `status`, `error`, `message`, `path` y `validationErrors`.

## Auth

`POST /api/v1/auth/login`

URL completa local:

`POST http://localhost:8080/TallerJPA-0.0.1-SNAPSHOT/api/v1/auth/login`

Body:

```json
{
  "email": "user1@icesi.edu.co",
  "password": "user123"
}
```

Notas: el email debe terminar en `@icesi.edu.co`.

Response:

```json
{
  "token": "jwt",
  "type": "Bearer",
  "issuedAt": "2026-06-02T00:00:00Z",
  "expiresAt": "2026-06-03T00:00:00Z",
  "user": {
    "id": 1,
    "name": "Usuario Uno",
    "email": "user1@icesi.edu.co",
    "roleId": 3,
    "roleName": "USER"
  },
  "roles": ["USER"]
}
```

`GET /api/v1/auth/me`: JWT requerido. Devuelve `UserResponseDTO`.

## Users

`GET /api/v1/users`: ADMIN. Lista usuarios.

`GET /api/v1/users/{id}`: ADMIN o usuario propio.

`GET /api/v1/users/me`: usuario autenticado.

`POST /api/v1/users`: ADMIN. Crea usuario con email institucional.

`PUT /api/v1/users/{id}`: ADMIN. Actualiza usuario con email institucional.

`DELETE /api/v1/users/{id}`: ADMIN.

`GET /api/v1/users/trainers`: ADMIN.

`GET /api/v1/users/regular`: ADMIN.

## Roles

`GET /api/v1/roles`: ADMIN.

`GET /api/v1/roles/{id}`: ADMIN.

## Exercises

`GET /api/v1/exercises`: ADMIN ve todos; USER/TRAINER ven globales y personalizados propios.

`GET /api/v1/exercises/{id}`: JWT. Respeta visibilidad de personalizados.

`POST /api/v1/exercises`: ADMIN. Crea ejercicio global.

`PUT /api/v1/exercises/{id}`: ADMIN o creador de ejercicio personalizado.

`DELETE /api/v1/exercises/{id}`: ADMIN o creador de ejercicio personalizado.

`GET /api/v1/exercises/available`: ejercicios globales + personalizados propios.

`GET /api/v1/exercises/custom/me`: personalizados del usuario autenticado.

`POST /api/v1/exercises/custom`: crea personalizado con `custom=true` y `createdBy=currentUser`.

Rutas legacy: `/api/v1/excercises`.

Exercise response incluye `custom`, `createdById`, `createdByName`.

## Routines

`GET /api/v1/routines`: ADMIN.

`GET /api/v1/routines/{id}`: owner, ADMIN o TRAINER asignado.

`POST /api/v1/routines`: usuario autenticado crea rutina propia. El backend fuerza `owner`, `createdBy` y `predefined=false`.

`PUT /api/v1/routines/{id}`: owner, ADMIN o trainer creador de template.

`DELETE /api/v1/routines/{id}`: owner, ADMIN o trainer creador de template.

`GET /api/v1/routines/me`: rutinas propias.

`GET /api/v1/routines/templates`: templates disponibles.

`POST /api/v1/routines/templates`: TRAINER o ADMIN.

`POST /api/v1/routines/templates/{id}/adopt`: USER adopta template.

Routine request recomendado:

```json
{
  "name": "Mi rutina",
  "description": "Plan semanal",
  "exerciseDetails": [
    {
      "exerciseId": 1,
      "sets": 3,
      "repetitions": 12,
      "duration": 15,
      "orderIndex": 1,
      "notes": "Tecnica controlada"
    }
  ]
}
```

## RoutineExercise

`GET /api/v1/routine-exercises`: ADMIN.

`GET /api/v1/routine-exercises/{id}`: owner, ADMIN o TRAINER asignado.

`POST /api/v1/routine-exercises/routine/{routineId}`: owner o ADMIN.

`PUT /api/v1/routine-exercises/{id}`: owner o ADMIN.

`DELETE /api/v1/routine-exercises/{id}`: owner o ADMIN.

## Progress

`GET /api/v1/progress`: ADMIN.

`GET /api/v1/progress/{id}`: owner, ADMIN o TRAINER asignado.

`POST /api/v1/progress`: usuario autenticado crea progreso propio.

`PUT /api/v1/progress/{id}`: USER propio o ADMIN.

`DELETE /api/v1/progress/{id}`: USER propio o ADMIN.

`GET /api/v1/progress/me`: progreso propio.

`GET /api/v1/progress/me/history`: lista historica simple.

`GET /api/v1/progress/user/{userId}`: ADMIN, TRAINER asignado o mismo usuario.

`GET /api/v1/progress/me/routine/{routineId}`: progreso propio por rutina.

`GET /api/v1/progress/me/exercise/{exerciseId}`: progreso propio por ejercicio.

Ownership: no se permite progreso con rutina ajena ni ejercicio personalizado ajeno.

## History

`GET /api/v1/history/me`: historial enriquecido propio.

`GET /api/v1/history/users/{userId}`: ADMIN o TRAINER asignado.

Response incluye `userId`, `userName`, `email`, `summary` y `entries`.

## Stats

`GET /api/v1/stats/me/weekly`

`GET /api/v1/stats/me/monthly`

`GET /api/v1/stats/users/{userId}/weekly`: ADMIN o TRAINER asignado.

`GET /api/v1/stats/users/{userId}/monthly`: ADMIN o TRAINER asignado.

Response para graficos:

```json
{
  "userId": 4,
  "userName": "Usuario Uno",
  "period": "weekly",
  "startDate": "2026-05-27",
  "endDate": "2026-06-02",
  "totalProgressEntries": 3,
  "totalMinutes": 90,
  "totalRepetitions": 80,
  "averageEffortLevel": 2.5,
  "totalWeightVolume": 360,
  "points": [
    {
      "label": "2026-06-02",
      "date": "2026-06-02",
      "totalMinutes": 30,
      "totalRepetitions": 20,
      "averageEffortLevel": 3,
      "entriesCount": 1
    }
  ]
}
```

## Reports

`GET /api/v1/reports/progress/me/pdf`: JWT. Descarga PDF propio.

`GET /api/v1/reports/users/{userId}/progress/pdf`: ADMIN o TRAINER asignado; mismo usuario tambien permitido.

Response:

- `Content-Type: application/pdf`
- `Content-Disposition: attachment; filename="progress-report-{userId}.pdf"`
- Body: bytes del PDF.

React debe usar `fetch`/`axios` con `responseType: "blob"` y abrir o descargar el blob.

## Trainers

`GET /api/v1/trainers`: ADMIN.

`GET /api/v1/trainers/me/users`: TRAINER.

`GET /api/v1/trainers/{trainerId}/users`: ADMIN o trainer propio.

`POST /api/v1/trainers/{trainerId}/assign/{userId}`: ADMIN.

`DELETE /api/v1/trainers/{trainerId}/unassign/{userId}`: ADMIN.

`GET /api/v1/trainers/me/users/{userId}/routines`: TRAINER asignado.

`GET /api/v1/trainers/me/users/{userId}/progress`: TRAINER asignado.

`GET /api/v1/trainers/me/users/{userId}/recommendations`: TRAINER asignado.

## Recommendations

`GET /api/v1/recommendations`: ADMIN.

`GET /api/v1/recommendations/{id}`: owner, ADMIN o TRAINER asignado.

`GET /api/v1/recommendations/me`: recomendaciones propias.

`GET /api/v1/recommendations/user/{userId}`: ADMIN o TRAINER asignado.

`POST /api/v1/recommendations/users/{userId}`: TRAINER asignado.

`PUT /api/v1/recommendations/{id}`: ADMIN o trainer creador.

`PUT /api/v1/recommendations/{id}/read`: USER target o ADMIN.

`DELETE /api/v1/recommendations/{id}`: ADMIN o trainer creador.

## Events

`GET /api/v1/events`: JWT.

`GET /api/v1/events/{id}`: JWT.

`POST /api/v1/events`: ADMIN.

`PUT /api/v1/events/{id}`: ADMIN.

`DELETE /api/v1/events/{id}`: ADMIN.

`GET /api/v1/events/upcoming`: JWT.

`GET /api/v1/events/space/{spaceId}`: JWT.

## Spaces

`GET /api/v1/spaces`: JWT.

`GET /api/v1/spaces/{id}`: JWT.

`POST /api/v1/spaces`: ADMIN.

`PUT /api/v1/spaces/{id}`: ADMIN.

`DELETE /api/v1/spaces/{id}`: ADMIN.

Ruta legacy: `/api/v1/espacios`.

## Notifications

`GET /api/v1/notifications`: ADMIN.

`GET /api/v1/notifications/{id}`: owner o ADMIN.

`GET /api/v1/notifications/me`: propias.

`POST /api/v1/notifications`: ADMIN.

`PUT /api/v1/notifications/{id}/read`: owner o ADMIN.

`DELETE /api/v1/notifications/{id}`: owner o ADMIN.

## Usuarios demo

| Rol | Email | Password |
| --- | --- | --- |
| ADMIN | `admin@icesi.edu.co` | `admin123` |
| TRAINER | `trainer1@icesi.edu.co` | `trainer123` |
| TRAINER | `trainer2@icesi.edu.co` | `trainer123` |
| USER | `user1@icesi.edu.co` | `user123` |
| USER | `user2@icesi.edu.co` | `user123` |
| USER | `user3@icesi.edu.co` | `user123` |
| USER | `user4@icesi.edu.co` | `user123` |
| USER | `user5@icesi.edu.co` | `user123` |
| USER | `user6@icesi.edu.co` | `user123` |

## Orden recomendado para probar

1. Login admin y revisar usuarios, roles, exercises, events, spaces.
2. Login trainer1 y revisar `/trainers/me/users`.
3. Login user1 y revisar exercises available, routines, progress, history, stats.
4. Descargar `/api/v1/reports/progress/me/pdf`.
5. Como trainer1, descargar PDF de user1.
6. Verificar que trainer1 no acceda a usuarios de trainer2.
