# Norte Propiedades

Demo genérica de **sitio web + panel de gestión para una inmobiliaria**. Pensada para mostrar el producto a inmobiliarias chicas y, después, adaptarla a cada cliente cambiando marca, datos y contenido.

> **Norte Propiedades es una marca ficticia.** Las propiedades, precios, testimonios y consultas son datos de ejemplo. Las fotos son de [Unsplash](https://unsplash.com/license).

![Home](docs/home-desktop.webp)

## Qué incluye

- **Sitio público** mobile-first: home editorial, listado con filtros por operación, tipo, barrio y precio, y ficha de propiedad con galería, comodidades, mapa y formulario.
- **Panel de administración** con login, resumen, CRUD de propiedades, subida de imágenes, cambio de estado (disponible / reservada / vendida) y bandeja de consultas.
- **Backend real** con Fastify 5, PostgreSQL 18, validación con Zod, JWT en cookie httpOnly, rate limit y subida de imágenes procesadas con Sharp.
- **SEO**: metadata por página, JSON-LD, sitemap, robots y Open Graph.
- **Performance**: Server Components, imágenes optimizadas por Next, CSS y animaciones livianas, sin librerías de UI pesadas.
- **Deploy reproducible** con Docker Compose (web + API + Postgres) y volúmenes persistentes.

## Stack

| Capa | Tecnología |
|---|---|
| Frontend | Next.js 16.4 (App Router, RSC), React 19, TypeScript, Tailwind CSS 4 |
| Tipografía | Fraunces (display) + Manrope (texto), vía `next/font` |
| Backend | Fastify 5, Zod, `pg`, JWT + cookie, `@fastify/rate-limit`, `@fastify/multipart`, Sharp |
| Base de datos | PostgreSQL 18 |
| Infra | Docker Compose, volúmenes para Postgres y uploads |
| Tests | Smoke test HTTP (`npm run smoke`) |

## Estructura

```
.
├── api/                 # Fastify + Postgres
│   └── src/
│       ├── routes/      # properties, leads, auth, admin
│       ├── auth.ts
│       ├── db.ts
│       └── server.ts
├── web/                 # Next.js
│   └── src/
│       ├── app/(site)/  # home, listado, ficha
│       ├── app/admin/   # login + panel
│       ├── components/  # UI pública y de admin
│       └── lib/         # API client, tipos, formato, marca
├── db/init/             # esquema + seed
├── scripts/smoke.mjs
├── docs/                # capturas
├── docker-compose.yml
└── .env.example
```

## Levantarlo local

Requisitos: Docker Desktop (o Docker Engine + Compose).

```bash
cp .env.example .env
# editá .env: poné una POSTGRES_PASSWORD y un JWT_SECRET largos
docker compose up -d --build
```

- Sitio: `http://localhost:3105`
- API: `http://localhost:3106/api/health`
- Panel: `http://localhost:3105/admin/login`

Credenciales de demo (se cambian en `.env`):

```
Email: demo@nortepropiedades.com
Contraseña: norte2026
```

> La primera vez, Postgres ejecuta `db/init/001_schema.sql` y `002_seed.sql`. Si cambiás el seed y querés volver a cargarlo, borrá el volumen: `docker compose down -v`.

### Desarrollo sin Docker para la web

```bash
# API
cd api
npm install
DATABASE_URL=postgres://norte:norte@127.0.0.1:5435/norte_demo \
JWT_SECRET=un-secreto-largo \
npm run dev

# Web (otra terminal)
cd web
npm install
API_URL=http://127.0.0.1:3002 npm run dev
```

En Windows, `npm run dev` con `API_URL=http://127.0.0.1:3002` evita el problema de resolución de `localhost` a IPv6.

## Deploy en un servidor

```bash
git clone https://github.com/lucabaello1998/norte-propiedades.git /srv/apps/norte-propiedades
cd /srv/apps/norte-propiedades
cp .env.example .env
nano .env   # POSTGRES_PASSWORD, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, PUBLIC_SITE_URL, COOKIE_SECURE
docker compose up -d --build
```

El compose expone solo en loopback:

- Web: `127.0.0.1:3105`
- API: `127.0.0.1:3106`

Detrás de un reverse proxy con HTTPS (Caddy, Nginx o Tailscale Serve), apuntá al puerto `3105`. Si el sitio se sirve por HTTPS, poné `COOKIE_SECURE=true` en `.env`.

Ejemplo con Tailscale Serve:

```bash
tailscale serve --bg --https=8446 http://127.0.0.1:3105
```

## Personalizar para un cliente

1. **Marca y contacto:** `web/src/lib/site.ts` (nombre, teléfono, WhatsApp, email, dirección, horarios, Instagram).
2. **Colores y tipografía:** `web/src/app/globals.css` (bloque `@theme`).
3. **Logo:** `web/src/components/logo.tsx` y `web/public/favicon.svg`.
4. **Contenido:** `db/init/002_seed.sql` (propiedades y consultas de ejemplo) y los textos de `web/src/app/(site)/page.tsx`.
5. **Admin:** credenciales en `.env`; el panel no se indexa (`robots` + metadata).

## Seguridad incluida

- Login con comparación de credenciales en tiempo constante y JWT de 12 h en cookie `httpOnly` + `SameSite=Lax`.
- Rate limit en login (8/min) y consultas (5/min).
- Validación de todos los payloads con Zod.
- Uploads limitados a 6 MB, solo imágenes, reencodeadas a WebP con Sharp.
- Consultas SQL parametrizadas.
- `X-Frame-Options`/CSP no están en la app: si se despliega detrás de Caddy, conviene agregarlos en el reverse proxy.

## Checks

```bash
npm run smoke                       # contra http://localhost:3105
BASE_URL=https://tu-dominio npm run smoke
```

## Capturas

| Home | Listado |
|---|---|
| ![](docs/home-desktop.webp) | ![](docs/listing-desktop.webp) |

| Ficha | Panel |
|---|---|
| ![](docs/detail-desktop.webp) | ![](docs/admin-dashboard.webp) |

| Mobile home | Mobile ficha |
|---|---|
| ![](docs/mobile-home.webp) | ![](docs/mobile-detail.webp) |

## Licencia y datos

Código de demostración. Las fotos pertenecen a Unsplash y sus autores; las propiedades y personas son ficticias. Reemplazá ambos antes de usar el sitio con un cliente real.
