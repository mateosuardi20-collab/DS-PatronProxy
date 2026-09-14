// ============================================================
// VERSIÓN SIN EL PATRÓN PROXY
// ============================================================
// Acá el cliente (cada parte de la app que necesita un video)
// tiene que encargarse ÉL MISMO de dos cosas que no son su
// responsabilidad: limitar la calidad según el plan del usuario,
// y manejar el caché para no descargar de nuevo algo ya pedido.
//
// El objetivo de este archivo es mostrar el dolor de NO tener un
// intermediario: la lógica se duplica, el caché no se comparte
// entre distintos puntos de la app, y es fácil que alguien se
// olvide de aplicar la regla de negocio en algún lugar nuevo.

const VideoHDService = require("./VideoHDService");
const Usuario = require("./Usuario");

// Esta función se tiene que copiar y pegar en cada lugar de la
// app que necesite pedir un video — no hay ningún punto central.
function pedirVideoDuplicandoLogica(servicioReal, cache, videoId, usuario) {
  console.log(`\nSolicitud de "${videoId}" por "${usuario.nombre}" (Plan: ${usuario.plan})`);

  let calidadPermitida = "720p (HD)";
  if (usuario.plan === "Estándar") calidadPermitida = "1080p (FHD)";
  if (usuario.plan === "Premium") calidadPermitida = "4K (UHD)";

  const cacheKey = `${videoId}_${calidadPermitida}`;

  if (cache.has(cacheKey)) {
    console.log(`  CACHÉ HIT: se devuelve ${calidadPermitida} desde memoria local.`);
    return cache.get(cacheKey);
  }

  console.log(`  CACHÉ MISS: pidiendo ${calidadPermitida} al CDN.`);
  const video = servicioReal.descargarVideo(videoId, calidadPermitida);
  cache.set(cacheKey, video);
  return video;
}

function main() {
  const servicioReal = new VideoHDService();

  const carlos = new Usuario("Carlos", "Estándar");
  const lucia = new Usuario("Lucía", "Premium");
  const mateo = new Usuario("Mateo", "Estándar");

  console.log("=== Reproductor Móvil ===");
  // Cada "cliente" tiene su propio caché local -> no se comparte con nadie
  const cacheMovil = new Map();
  pedirVideoDuplicandoLogica(servicioReal, cacheMovil, "pelicula-99", carlos);
  pedirVideoDuplicandoLogica(servicioReal, cacheMovil, "pelicula-99", lucia);

  console.log("\n=== Reproductor Web ===");
  // Este es OTRO punto de la app: tiene que reescribir la MISMA lógica,
  // y encima su caché arranca vacío, aunque el móvil ya haya descargado el video.
  const cacheWeb = new Map();
  pedirVideoDuplicandoLogica(servicioReal, cacheWeb, "pelicula-99", mateo);

  console.log("\n=== Un desarrollador nuevo agrega otra pantalla ===");
  // Y ACÁ está el riesgo real: si alguien agrega un tercer punto de acceso
  // y se olvida de aplicar el límite de calidad, el usuario Estándar
  // termina accediendo a 4K sin que nadie lo controle.
  console.log("  [Pantalla nueva] Pide video directo, sin control de plan:");
  servicioReal.descargarVideo("pelicula-99", "4K (UHD)");
  console.log(
    `  -> ${carlos.nombre} (plan ${carlos.plan}) accedió a 4K aunque su plan no lo permite. Nadie se lo impidió.`
  );
}

main();
