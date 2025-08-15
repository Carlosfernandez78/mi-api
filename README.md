# Mi API (Express + MySQL2)

## Requisitos
- Node.js 18+
- MySQL 8+

## Configuración
1. Crea `.env` en la raíz con:
```
PORT=3000
DB_HOST=localhost
DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_NAME=mi_api
JWT_SECRET=una_clave_secreta_segura
```
2. Instala dependencias:
```
npm install
```
3. Crea la base y tablas (si aún no existen):
```
# En MySQL
CREATE DATABASE mi_api CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE mi_api;
SOURCE config/mi_api.sql;
```
4. Si ya tenías tablas antiguas, normaliza columnas:
```
USE mi_api;
SOURCE migrations/001_normalize_columns.sql;
```

## Ejecutar
```
npm run dev
```
Servidor en `http://localhost:3000`.

## Endpoints de prueba
- GET `/api/test/db`
- GET `/api/test/tables`
- Auth: `POST /auth/register`, `POST /auth/login`, `GET /auth/perfil` (Bearer)
- Vehículos: `GET /vehiculos`, `GET /vehiculos/disponibles?fecha_inicio=YYYY-MM-DD&fecha_fin=YYYY-MM-DD`
- Reservas: `GET/POST/PUT/DELETE /reservas` (Bearer)

## Notas
- Campos normalizados: `contrasena` y `anio`.
- Rutas protegidas requieren header `Authorization: Bearer <token>`. 
