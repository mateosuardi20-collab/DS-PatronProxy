# TP diseño

App chica para mostrar el uso de un proxy entre React, Express y SQL Server.

## Idea del proyecto

El cliente React no se conecta directo a la base de datos. React llama a rutas
`/api`, Vite redirige esas llamadas al backend, y el backend queda encargado de
consultar SQL Server usando `mssql`.

Flujo:

```txt
React -> proxy de Vite -> Express -> SQL Server
```

## Requisitos previos

- Node.js 18 o superior
- SQL Server, cuando se quiera conectar la base real

## Instalacion

Instalar dependencias del cliente:

```bash
cd client
npm install
```

Instalar dependencias del servidor:

```bash
cd ../server
npm install
```

## Ejecutar la demo

En una terminal, iniciar el backend:

```bash
cd server
npm run dev
```

En otra terminal, iniciar React:

```bash
cd client
npm run dev
```

Abrir la URL que muestre Vite, normalmente:

```txt
http://localhost:5173
```

## Configurar SQL Server mas adelante

Cuando la base exista, crear un archivo `server/.env` usando como guia
`server/.env.example`:

```env
PORT=3001

DB_USER=tu_usuario
DB_PASSWORD=tu_password
DB_SERVER=localhost
DB_DATABASE=nombre_de_tu_base
DB_PORT=1433
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
```

El endpoint preparado para la exposicion es:

```txt
GET /api/alumnos
```

La consulta de ejemplo espera una tabla `Alumnos` con las columnas:

```sql
id, nombre, curso
```
