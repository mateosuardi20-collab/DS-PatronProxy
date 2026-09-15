// Este archivo representa el servicio real o "sujeto real".
//
// Es el componente que realmente ejecuta la acción de descargar el video
// desde un CDN remoto. El problema no está en este servicio en sí,
// sino en cómo los clientes lo usan.
//
// En la versión sin proxy, cada cliente tiene que repetir reglas de
// negocio y caché. En la versión con proxy, el cliente usa una
// interfaz común y delega esa lógica al Proxy.
const Video = require("./Video");

class VideoService {
  obtenerVideo(videoId, calidad) {
    console.log(`  [CDN Remota] Descargando "${videoId}" en ${calidad}...`);
    return new Video(
      videoId,
      calidad,
      `Contenido_${videoId}_${calidad}.mp4`
    );
  }
}

module.exports = VideoService;
