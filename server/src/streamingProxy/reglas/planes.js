const ETIQUETA_CALIDAD = {
  baja: "720p",
  media: "1080p",
  ultra: "4K",
};

const CALIDAD_MAXIMA_POR_PLAN = {
  basico: "baja",
  familiar: "media",
  premium: "ultra",
};

const ORDEN = ["baja", "media", "ultra"];

function obtenerCalidadHabilitada(plan, calidadSolicitada) {
  const calidadMaxima = CALIDAD_MAXIMA_POR_PLAN[plan] || "baja";

  if (ORDEN.indexOf(calidadSolicitada) > ORDEN.indexOf(calidadMaxima)) {
    return calidadMaxima;
  }

  return calidadSolicitada;
}

module.exports = {
  ETIQUETA_CALIDAD,
  obtenerCalidadHabilitada,
};
