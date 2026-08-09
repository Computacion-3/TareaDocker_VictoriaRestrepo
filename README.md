# Proyecto final - Docker y Docker Compose

Este repositorio contiene el proyecto del curso separado en:

- `backend/`: API Spring Boot
- `front/bienestar-app/`: frontend React
- `docker-compose.yml`: orquestacion de PostgreSQL, backend y frontend

La configuracion actual usa:

- PostgreSQL como base de datos
- Spring Boot para el backend
- React + Vite para el frontend

## Estructura

```text
.
|-- backend/
|   |-- Dockerfile
|   |-- src/
|-- front/bienestar-app/
|   |-- Dockerfile
|   |-- src/
|-- docker-compose.yml
|-- .env.example
```

## Requisitos

- Docker Desktop instalado
- Docker Compose disponible
- Opcional para pruebas locales del frontend: Node.js 22+

## Configuracion del entorno

1. Copia `.env.example` a `.env`.
2. Revisa los valores antes de levantar la aplicacion.

Variables principales:

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `POSTGRES_HOST`
- `POSTGRES_PORT`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `VITE_API_BASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRATION`

## Construir las imagenes

Desde la raiz del repositorio:

```bash
docker compose build
```

## Levantar la aplicacion

```bash
docker compose up --build
```

Para ejecutarla en segundo plano:

```bash
docker compose up -d --build
```

## Acceso a los servicios

- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api/v1`
- Swagger UI: `http://localhost:8080/swagger-ui/index.html`


## Acceso a la base de datos

PostgreSQL corre dentro de Docker Compose. Si necesitas una consola dentro del contenedor:

```bash
docker compose exec postgres psql -U tallerjpa -d tallerjpa
```

Si se cambian las credenciales en `.env`, ajustar el comando con esos valores.

## Usuarios de prueba

El backend carga datos de ejemplo al iniciar. Credenciales utiles:

- `admin@icesi.edu.co` / `admin123`
- `trainer1@icesi.edu.co` / `trainer123`
- `user1@icesi.edu.co` / `user123`

## Detener el stack

```bash
docker compose down
```

Para eliminar tambien el volumen de PostgreSQL:

```bash
docker compose down -v
```

## Notas

- El backend lee los valores de la base de datos desde variables de entorno.
- El bundle del frontend recibe `VITE_API_BASE_URL` durante la construccion por medio de Docker Compose.
- Si cambias la URL o el puerto del backend, vuelve a construir la imagen del frontend para que el bundle use la nueva direccion de la API.
