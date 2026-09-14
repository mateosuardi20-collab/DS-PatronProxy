// El "objeto real" que descarga el video desde un CDN remoto.
// Es idéntico en ambas versiones: el problema NO está acá, sino
// en cómo el cliente lo usa.
class VideoHDService {
  descargarVideo(videoId, calidad) {
    console.log(`  [CDN Remota] Descargando "${videoId}" en ${calidad}...`);
    return `Contenido_${videoId}_${calidad}.mp4`;
  }
}

module.exports = VideoHDService;
