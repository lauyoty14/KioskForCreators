# Kiosk For Creators Frontend

Frontend en SvelteKit para el backend FastAPI de `gestion_contenido`.

## Variables de entorno

Usa `.env` con:

```bash
PUBLIC_API_BASE_URL=https://cooperative-surprise-production-64d7.up.railway.app
```

Para Vercel:

- usa la URL publica del backend desplegado en Railway
- ejemplo: `https://cooperative-surprise-production-64d7.up.railway.app`

## Scripts

```bash
npm install
npm run dev
npm run check
npm run build
```

## Deploy en Vercel

1. Crea el proyecto en Vercel usando `frontend` como Root Directory.
2. Configura `PUBLIC_API_BASE_URL` en Variables de Entorno.
3. Usa el comando de build por defecto: `npm run build`.
4. Deja el Output Directory vacio para que el adapter de SvelteKit lo maneje.

El proyecto ya esta preparado con `@sveltejs/adapter-vercel`, asi que no hace falta agregar configuracion extra de plataforma para el primer deploy.

Nota:
en este entorno Windows el adapter puede fallar al final del build local por permisos de symlink en `.vercel/output`. Eso no afecta el build remoto de Vercel.

