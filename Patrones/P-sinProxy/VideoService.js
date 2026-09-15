// Este archivo representa el servicio real o "sujeto real".
//
// Es el componente que realmente ejecuta la descarga del video desde
// un CDN remoto. El problema no está en este servicio en sí, sino
// en cómo el cliente lo usa en la versión sin proxy.
const Video = require("./Video");

class VideoService {
  obtenerVideo(videoId, calidad) {
    console.log(` [CDN Remota] Descargando "${videoId}" en ${calidad}...`);
    return new Video(
      videoId,
      calidad,
      `Contenido_${videoId}_${calidad}.mp4`
    );
  }
}

module.exports = VideoService;
