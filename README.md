# Patrón Proxy — con y sin el patrón aplicado

Proyecto de consola en JavaScript (Node.js), sin servidor ni endpoints.
Pensado para copiarse dentro de tu repo, al lado de `client/` y `server/`,
sin tocarlas.

## Cómo integrarlo a tu repo

1. Copiá esta carpeta completa (`patrones/`) a la raíz de tu repositorio,
   junto a `client/` y `server/`.
2. Desde la raíz del repo (o desde `patrones/proxy/`), corré cada ejemplo
   con Node — no hace falta instalar nada, son archivos `.js` planos:

```bash
node patrones/proxy/sin-patron/MainSinPatron.js
node patrones/proxy/con-patron/MainConPatron.js
```

3. Con `git add`, `git commit` y `git push` lo subís a GitHub como
   cualquier otro cambio.

## Estructura

```
patrones/
└── proxy/
    ├── sin-patron/
    │   ├── Usuario.js
    │   ├── VideoHDService.js
    │   └── MainSinPatron.js     <- ejecutable
    └── con-patron/
        ├── Usuario.js
        ├── VideoHDService.js     (Sujeto Real)
        ├── VideoProxy.js         (Proxy)
        └── MainConPatron.js      <- ejecutable
```

## Qué muestra cada versión

**`sin-patron/`**: cada punto de la app que necesita un video (acá
simulado con "Reproductor Móvil" y "Reproductor Web") tiene que
reimplementar la lógica de límite de calidad y de caché por su cuenta.
Esto expone tres problemas reales:
- Código duplicado en cada lugar que use el servicio.
- Los cachés no se comparten entre sí (el Reproductor Web vuelve a
  descargar algo que el Móvil ya había descargado).
- Es fácil que un desarrollador nuevo se olvide de aplicar la regla de
  negocio — el último bloque del Main lo demuestra explícitamente.

**`con-patron/`**: `VideoProxy` implementa el mismo método
(`obtenerVideo(videoId, calidad)`) que `VideoHDService`, así que
cualquier cliente puede usar uno u otro sin cambiar su código — esa es
la transparencia que exige el patrón. El proxy centraliza el control de
plan y el caché en un solo lugar, y el Main final demuestra la
sustituibilidad pasando tanto el proxy como el servicio real a la misma
función `reproducirVideo()`.
