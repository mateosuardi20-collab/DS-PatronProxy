// ============================================================
// VERSIÓN SIN EL PATRÓN PROXY
// ============================================================
// Este archivo muestra el problema de no usar un Proxy.
//
// Acá el cliente (cada parte de la app que necesita un video)
// tiene que encargarse ÉL MISMO de dos cosas que no son su
// responsabilidad:
//   1. limitar la calidad según el plan del usuario
//   2. manejar el caché para no descargar de nuevo algo ya pedido
//
// El objetivo de esta versión es evidenciar el dolor de NO tener
// un intermediario: la lógica se duplica, el caché no se comparte
// entre distintos puntos de la app, y es fácil que alguien se
// olvide de aplicar la regla de negocio en algún lugar nuevo.

const VideoService = require("./VideoService");
const Usuario = require("./Usuario");

// Esta función se tiene que copiar y pegar en cada lugar de la
// app que necesite pedir un video — no hay ningún punto central.
//
// Es la demostración de cómo la lógica de negocio y la lógica de caché
// quedan dispersas en varios puntos del sistema.
function pedirVideoDuplicandoLogica(servicioReal, cache, videoId, usuario) {
  console.log(`\nSolicitando "${videoId}" para "${usuario.nombre}" (plan ${usuario.plan})`);

  let calidadPermitida = "720p (HD)";
  if (usuario.plan === "Estándar") calidadPermitida = "1080p (FHD)";
  if (usuario.plan === "Premium") calidadPermitida = "4K (UHD)";

  const cacheKey = `${videoId}_${calidadPermitida}`;

  if (cache.has(cacheKey)) {
    console.log(` Ya tenía ${calidadPermitida} en caché, así que lo reutilizo.`);
    return cache.get(cacheKey);
  }

  console.log(`  No estaba en caché. Descargando ${calidadPermitida} desde el CDN...`);
  const video = servicioReal.obtenerVideo(videoId, calidadPermitida);
  cache.set(cacheKey, video);
  return video;
}

function main() {
  const servicioReal = new VideoService();

  const carlos = new Usuario("Carlos", "Estándar");
  const lucia = new Usuario("Lucía", "Premium");
  const mateo = new Usuario("Mateo", "Estándar");

  console.log("=== Reproductor Móvil ===");
  // Cada "cliente" tiene su propio caché local -> no se comparte con nadie
  const cacheMovil = new Map();
  pedirVideoDuplicandoLogica(servicioReal, cacheMovil, "pelicula-99", carlos);
  pedirVideoDuplicandoLogica(servicioReal, cacheMovil, "pelicula-99", lucia);

  console.log("\nReproductor Web");
  // Este es OTRO punto de la app: tiene que reescribir la MISMA lógica,
  // y encima su caché arranca vacío, aunque el móvil ya haya descargado el video.
  const cacheWeb = new Map();
  pedirVideoDuplicandoLogica(servicioReal, cacheWeb, "pelicula-99", mateo);

  console.log("\n Un desarrollador nuevo agrega otra pantalla");
  // Y acá está el riesgo real: si alguien agrega un tercer punto de acceso
  // y se olvida de aplicar el límite de calidad, el usuario Estándar
  // termina accediendo a 4K sin que nadie lo controle.
  console.log("  [Pantalla nueva] Pide el video directo, sin revisar el plan:");
  servicioReal.obtenerVideo("pelicula-99", "4K (UHD)");
  console.log(
    `${carlos.nombre} (plan ${carlos.plan}) accedió a 4K aunque su plan no lo permite. Nadie se lo impidió.`
  );
}

main();
