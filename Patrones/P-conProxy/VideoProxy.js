// Proxy: implementa el MISMO método que VideoHDService
// (obtenerVideo(videoId, calidad)), por eso cualquier cliente
// puede usarlo como si fuera el objeto real, sin cambiar ni
// una línea de su propio código.
//
// Encapsula dos responsabilidades que antes estaban duplicadas en
// cada punto de la app (Protection Proxy + Caching Proxy):
// 1. Limita la calidad máxima según el plan del usuario.
// 2. Cachea las versiones ya descargadas para no repetir el trabajo.

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
  // reciben el MISMO Map, se comportan como un caché de CDN real,
  // compartido entre usuarios distintos — solo cambia, por usuario,
  // el límite de calidad que cada uno puede pedir.
  constructor(servicioReal, usuario, cacheCompartida = new Map()) {
    this.servicioReal = servicioReal;
    this.usuario = usuario; // el proxy queda "atado" a un usuario
    this.cache = cacheCompartida;
  }

  // Misma firma que VideoHDService.obtenerVideo(videoId, calidad)
  obtenerVideo(videoId, calidadSolicitada) {
    const calidad = this._limitarSegunPlan(calidadSolicitada);
    const etiqueta = ETIQUETAS[calidad];

    console.log(`\n[PROXY] Solicitud de "${videoId}" por "${this.usuario.nombre}" (Plan: ${this.usuario.plan})`);

    const cacheKey = `${videoId}_${calidad}`; // clave estable, no depende del texto de exhibición

    if (this.cache.has(cacheKey)) {
      console.log(`  [PROXY] ⚡ CACHÉ HIT: se devuelve ${etiqueta} desde memoria local.`);
      return this.cache.get(cacheKey);
    }

    console.log(`  [PROXY] 🐢 CACHÉ MISS: pidiendo ${etiqueta} al CDN.`);
    const video = this.servicioReal.obtenerVideo(videoId, etiqueta);
    this.cache.set(cacheKey, video);
    return video;
  }

  _limitarSegunPlan(calidadSolicitada) {
    const maxPermitida = LIMITE_POR_PLAN[this.usuario.plan] ?? "720p";
    const idxSolicitada = ORDEN_CALIDADES.indexOf(calidadSolicitada);
    const idxMax = ORDEN_CALIDADES.indexOf(maxPermitida);
    return idxSolicitada > idxMax ? maxPermitida : calidadSolicitada;
  }
}

module.exports = VideoProxy;
