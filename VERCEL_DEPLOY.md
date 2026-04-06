# Deploy en Vercel

## Estado del proyecto

`frontend` ya queda listo para Vercel con `@sveltejs/adapter-vercel`.

## Variables de entorno

Configura en Vercel:

```bash
PUBLIC_API_BASE_URL=https://tu-backend-production.up.railway.app
```

La web y la app de pantallas deben apuntar a la misma URL publica de Railway para compartir contenido, vinculaciones y assets.

## Configuracion del proyecto

- Root Directory: `frontend`
- Framework Preset: `SvelteKit`
- Install Command: `npm install`
- Build Command: `npm run build`

## Importante

Para control remoto real desde otras computadoras, el backend tiene que vivir en una URL accesible por red. En este proyecto, esa URL debe ser la de Railway.

## Build local en Windows

En esta maquina, `npm run build` llega a compilar la app pero falla al final del adapter de Vercel por un `EPERM` al crear symlinks dentro de `.vercel/output`.

Eso no impide el deploy real en Vercel, porque el build de la plataforma corre en Linux y no depende de esa restriccion local de Windows.
