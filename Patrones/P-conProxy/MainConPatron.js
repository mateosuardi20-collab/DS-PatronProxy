// ============================================================
// VERSIÓN CON EL PATRÓN PROXY
// ============================================================
// Este archivo es el punto de entrada de la versión con proxy.
//
// En esta versión, el cliente NO tiene que hacer la lógica de:
//   - limitar la calidad según el plan del usuario
//   - manejar caché
//   - decidir si el video ya fue descargado antes
//
// En cambio, el cliente usa un Proxy que se encarga de esas tareas
// y expone la misma interfaz que el servicio real:
//   obtenerVideo(videoId, calidad)
//
// Esto permite que el "Reproductor Móvil" y el "Reproductor Web"
// usen el mismo método sin saber si están hablando con el Proxy o
// con el servicio real.

const VideoService = require("./VideoService");
const VideoProxy = require("./VideoProxy");
const Usuario = require("./Usuario");

// Este método no sabe (ni le importa) si recibe el Proxy o el objeto
// real: a ambos les puede llamar .obtenerVideo(videoId, calidad).
function reproducirVideo(servicio, videoId, calidad) {
  const archivo = servicio.obtenerVideo(videoId, calidad);
  console.log(`  -> Reproduciendo archivo: ${archivo}`);
}

function main() {
  const servicioReal = new VideoService();

  const carlos = new Usuario("Carlos", "Estándar");
  const lucia = new Usuario("Lucía", "Premium");
  const mateo = new Usuario("Mateo", "Estándar");

  // Cada usuario tiene su propio proxy (para que el límite de calidad
  // sea individual), pero los tres comparten el MISMO Map de caché,
  // como pasaría con el caché de un CDN real: no le pertenece a un
  // usuario en particular, le pertenece al contenido ya descargado.
  const cacheCompartida = new Map();
  const proxyDeCarlos = new VideoProxy(servicioReal, carlos, cacheCompartida);
  const proxyDeLucia = new VideoProxy(servicioReal, lucia, cacheCompartida);
  const proxyDeMateo = new VideoProxy(servicioReal, mateo, cacheCompartida);

  console.log("Reproductor móvil");
  // Carlos (Estándar) pide 4K, pero su plan lo limita a 1080p.
  proxyDeCarlos.obtenerVideo("pelicula-99", "4K");
  // Lucía (Premium) pide 4K. Su plan sí lo permite y no está en caché: se descarga.
  proxyDeLucia.obtenerVideo("pelicula-99", "4K");

  console.log("\nReproductor web");
  // Mateo (Estándar) pide 1080p directamente. Fijate que reutiliza EXACTAMENTE
  // el mismo método que usó el reproductor móvil: obtenerVideo(videoId, calidad).
  // No tuvo que reimplementar ninguna regla de negocio.
  proxyDeMateo.obtenerVideo("pelicula-99", "1080p");

  console.log("\n=== Mostrando que el proxy es transparente ===");
  console.log("Probando con el proxy de Carlos:");
  reproducirVideo(proxyDeCarlos, "pelicula-99", "4K");
  console.log("\n Probando con el servicio real directo, sin protección:");
  reproducirVideo(servicioReal, "pelicula-99", "4K");
}

main();
