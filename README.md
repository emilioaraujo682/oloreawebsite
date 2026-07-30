# Olorea — sitio web

Sitio de una sola página para Olorea (difusores de autor), listo para producción.

## Estructura del proyecto

```
olorea-production/
├── index.html              Página principal
├── robots.txt              Reglas de rastreo para buscadores
├── sitemap.xml             Mapa del sitio
├── favicon.ico             Ícono del sitio (multi-tamaño)
├── apple-touch-icon.png    Ícono para iOS
└── assets/
    ├── css/
    │   └── styles.css      Estilos del sitio
    ├── js/
    │   └── main.js         Interacciones (menú, scroll, video del hero, formulario)
    ├── img/                Fotos de producto, logo, íconos
    └── video/               Video del hero (.webm y .mp4)
```

No hay paso de build: es HTML/CSS/JS estático puro. Se puede desplegar tal cual.

## Publicar en GitHub

1. Crea un repositorio nuevo en GitHub (puede ser público o privado).
2. Desde esta carpeta, en tu terminal:
   ```bash
   git init
   git add .
   git commit -m "Sitio Olorea listo para producción"
   git branch -M main
   git remote add origin https://github.com/TU-USUARIO/TU-REPOSITORIO.git
   git push -u origin main
   ```

## Publicar en Vercel

1. Entra a [vercel.com](https://vercel.com) e inicia sesión (puedes usar tu cuenta de GitHub).
2. Haz clic en **Add New… → Project**.
3. Selecciona el repositorio que acabas de subir.
4. En la configuración del proyecto:
   - **Framework Preset:** Other (o "No Framework")
   - **Build Command:** (dejar vacío)
   - **Output Directory:** `./` (raíz del proyecto)
   - **Install Command:** (dejar vacío)
5. Haz clic en **Deploy**. Vercel publicará el sitio en una URL tipo `tu-proyecto.vercel.app` en menos de un minuto.

## Conectar el dominio soyolorea.com

1. En el panel del proyecto en Vercel, ve a **Settings → Domains**.
2. Agrega `soyolorea.com` (y `www.soyolorea.com` si lo usas).
3. Vercel te dará registros DNS (generalmente un registro `A` apuntando a `76.76.21.21` y/o un `CNAME` para `www`). Agrégalos en el proveedor donde compraste el dominio.
4. Espera a que el DNS se propague (puede tardar desde minutos hasta unas horas) — Vercel emitirá el certificado SSL automáticamente.

## Actualizar el sitio después de publicado

Cualquier cambio que subas a la rama `main` en GitHub se vuelve a publicar automáticamente en Vercel (despliegue continuo), sin pasos adicionales.

## Formulario de contacto

El formulario de contacto envía los mensajes mediante [Web3Forms](https://web3forms.com) directamente al correo `info@soyolorea.com`, sin necesidad de servidor backend. La clave de acceso ya está configurada en `assets/js/main.js`.

**Importante:** antes de anunciar el sitio, confirma que `info@soyolorea.com` es una bandeja de entrada verificada y funcionando — si es un correo recién creado, es posible que los primeros mensajes de Web3Forms lleguen a spam o reboten hasta que el dominio de correo esté completamente verificado. Se recomienda hacer una prueba real desde el formulario ya publicado en Vercel (no localmente) y confirmar que el mensaje llega.

## WhatsApp

Los botones de WhatsApp abren conversaciones al número `+502 5202 0252` con mensajes prellenados según el producto. Si el número cambia, se puede actualizar buscando `wa.me/50252020252` en `index.html` y reemplazando el número en cada enlace.
