# Patrón Proxy — con y sin el patrón aplicado

```bash
node patrones/proxy/sin-patron/MainSinPatron.js
node patrones/proxy/con-patron/MainConPatron.js
```

## Estructura

```
Patrones/
    ├── P-sinPatron/
    │   ├── Usuario.js
    │   ├── VideoService.js
    │   └── MainSinPatron.js     <- ejecutable
    └── P-conPatron/
        ├── Usuario.js
        ├── VideoService.js     (Sujeto Real)
        ├── VideoProxy.js         (Proxy)
        └── MainConPatron.js      <- ejecutable
```

## ¿Qué muestra cada versión?

`Sin patrón`: cada punto de la app que necesita un video (acá
simulado con "Reproductor Móvil" y "Reproductor Web") tiene que
reimplementar la lógica de límite de calidad y de caché por su cuenta.
Esto expone tres problemas reales:
- Código duplicado en cada lugar que use el servicio.
- Los cachés no se comparten entre sí (el Reproductor Web vuelve a
  descargar algo que el Móvil ya había descargado).
- Es fácil que un desarrollador nuevo se olvide de aplicar la regla de
  negocio — el último bloque del Main lo demuestra explícitamente.

`Con patrón `: VideoProxy implementa el mismo método
(`obtenerVideo(videoId, calidad)`) que `VideoService`, así que
cualquier cliente puede usar uno u otro sin cambiar su código — esa es
la transparencia que exige el patrón. El proxy centraliza el control de
plan y el caché en un solo lugar, y el Main final demuestra la
sustituibilidad pasando tanto el proxy como el servicio real a la misma
función `reproducirVideo()`.
