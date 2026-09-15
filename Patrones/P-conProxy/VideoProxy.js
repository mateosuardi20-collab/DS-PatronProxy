// Proxy: implementa el MISMO método que VideoService
// (obtenerVideo(videoId, calidad)), por eso cualquier cliente
// puede usarlo como si fuera el objeto real, sin cambiar ni
// una línea de su propio código.
//
// Este archivo es el punto clave del patrón Proxy.
//
// El Proxy cumple dos roles importantes:
// 1. Protection Proxy: limita la calidad máxima según el plan
//    del usuario (por ejemplo, un usuario Estándar no puede pedir 4K).
// 2. Caching Proxy: guarda en caché las versiones ya descargadas
//    para no repetir trabajo y reutilizar contenido entre distintos
//    clientes.
//
// En otras palabras, el cliente solo pide un video; el Proxy decide
// cómo resolver esa solicitud con la lógica correcta.

const ETIQUETAS = {
  "720p": "720p (HD)",
  "1080p": "1080p (FHD)",
  "4K": "4K (UHD)",
};

const LIMITE_POR_PLAN = {
  Básico: "720p",
  Estándar: "1080p",
  Premium: "4K",
};

const ORDEN_CALIDADES = ["720p", "1080p", "4K"];

class VideoProxy {
  // cacheCompartida es opcional: si varios proxies (uno por usuario)
  // reciben el MISMO Map, se comportan como un caché compartido,
  // como un CDN real. Eso significa que los distintos usuarios pueden
  // reutilizar contenido ya descargado, aunque cada uno tenga un plan
  // distinto y un límite diferente de calidad.
  constructor(servicioReal, usuario, cacheCompartida = new Map()) {
    this.servicioReal = servicioReal;
    this.usuario = usuario; // el proxy queda "atado" a un usuario
    this.cache = cacheCompartida;
  }

  // Misma firma que VideoService.obtenerVideo(videoId, calidad).
  // Este método es el punto de entrada del Proxy para cualquier cliente.
  obtenerVideo(videoId, calidadSolicitada) {
    const calidad = this.limitarSegunPlan(calidadSolicitada);
    const etiqueta = ETIQUETAS[calidad];

    console.log(`\n[Proxy] ${this.usuario.nombre} pidió "${videoId}" (${this.usuario.plan}).`);

    const cacheKey = `${videoId}_${calidad}`; // clave estable, no depende del texto de exhibición

    if (this.cache.has(cacheKey)) {
      console.log(`  [Proxy] Ya estaba en caché: devuelvo ${etiqueta}.`);
      return this.cache.get(cacheKey);
    }

    console.log(`  [Proxy] No estaba en caché. Descargando ${etiqueta} desde el CDN...`);
    const video = this.servicioReal.obtenerVideo(videoId, etiqueta);
    this.cache.set(cacheKey, video);
    return video;
  }

  limitarSegunPlan(calidadSolicitada) {
    const maxPermitida = LIMITE_POR_PLAN[this.usuario.plan] ?? "720p";
    const idxSolicitada = ORDEN_CALIDADES.indexOf(calidadSolicitada);
    const idxMax = ORDEN_CALIDADES.indexOf(maxPermitida);
    return idxSolicitada > idxMax ? maxPermitida : calidadSolicitada;
  }
}

module.exports = VideoProxy;
