# Ejemplo de Proxy: plataforma de streaming

Este ejemplo esta pensado para mostrar codigo, no para levantar una app.

## Estructura

```txt
streamingProxy/
  reglas/
    planes.js
  servicioRemoto/
    CatalogoVideoRemoto.js
  codigoSinPatron/
    ReproductorConResponsabilidadesMezcladas.js
  codigoConProxy/
    ProxyDeStreaming.js
  ejecutarComparacion.js
```

## Que muestra

`codigoSinPatron/ReproductorConResponsabilidadesMezcladas.js` funciona, pero
mezcla responsabilidades: reproduce, valida el plan, maneja cache y llama al
servicio remoto.

`codigoConProxy/ProxyDeStreaming.js` separa esa responsabilidad. El cliente
sigue pidiendo una pelicula, pero la clase proxy controla el acceso antes de
delegar al servicio real.

## Idea principal

El Proxy actua como intermediario entre el cliente y el objeto real. En este
caso sirve para:

- controlar la calidad permitida por plan;
- cachear peliculas por calidad;
- evitar llamadas innecesarias al servicio remoto.
