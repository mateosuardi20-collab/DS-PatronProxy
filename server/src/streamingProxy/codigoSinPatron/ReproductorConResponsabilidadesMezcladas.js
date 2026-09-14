const {
  ETIQUETA_CALIDAD,
  obtenerCalidadHabilitada,
} = require("../reglas/planes");
const CatalogoVideoRemoto = require("../servicioRemoto/CatalogoVideoRemoto");

class ReproductorConResponsabilidadesMezcladas {
  constructor() {
    this.catalogoRemoto = new CatalogoVideoRemoto();
    this.cacheLocal = new Map();
  }

  reproducir(usuario, codigoPelicula, calidadSolicitada, historial) {
    historial.push(
      `Reproductor: ${usuario.nombre} pide ${codigoPelicula} en ${ETIQUETA_CALIDAD[calidadSolicitada]}.`,
    );

    const calidadPermitida = obtenerCalidadHabilitada(
      usuario.plan,
      calidadSolicitada,
    );
    const calidadFinal = ETIQUETA_CALIDAD[calidadPermitida];
    const claveCache = `${usuario.nombre}-${codigoPelicula}-${calidadPermitida}`;

    if (calidadPermitida !== calidadSolicitada) {
      historial.push(
        `Reproductor: baja la calidad porque el plan ${usuario.plan} no alcanza.`,
      );
    }

    if (this.cacheLocal.has(claveCache)) {
      historial.push("Reproductor: encontro el video en su cache interna.");
      return this.cacheLocal.get(claveCache);
    }

    historial.push(
      "Reproductor: mezcla validacion del plan, cache y comunicacion remota.",
    );

    const pelicula = this.catalogoRemoto.obtenerPelicula(
      codigoPelicula,
      calidadFinal,
      historial,
    );

    this.cacheLocal.set(claveCache, pelicula);
    return pelicula;
  }
}

module.exports = ReproductorConResponsabilidadesMezcladas;
