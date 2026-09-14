const {
  ETIQUETA_CALIDAD,
  obtenerCalidadHabilitada,
} = require("../reglas/planes");

class ProxyDeStreaming {
  constructor(catalogoRemoto, usuario, cacheCompartida) {
    this.catalogoRemoto = catalogoRemoto;
    this.usuario = usuario;
    this.cacheCompartida = cacheCompartida;
  }

  obtenerPelicula(codigoPelicula, calidadSolicitada, historial) {
    historial.push(
      `Proxy: ${this.usuario.nombre} pide ${codigoPelicula} en ${ETIQUETA_CALIDAD[calidadSolicitada]}.`,
    );

    const calidadPermitida = obtenerCalidadHabilitada(
      this.usuario.plan,
      calidadSolicitada,
    );
    const calidadFinal = ETIQUETA_CALIDAD[calidadPermitida];
    const claveCache = `${codigoPelicula}-${calidadPermitida}`;

    if (calidadPermitida !== calidadSolicitada) {
      historial.push(
        `Proxy: el plan ${this.usuario.plan} no permite esa calidad. Entrega ${calidadFinal}.`,
      );
    }

    if (this.cacheCompartida.has(claveCache)) {
      historial.push(`Proxy: cache hit para ${codigoPelicula} en ${calidadFinal}.`);
      return this.cacheCompartida.get(claveCache);
    }

    historial.push("Proxy: cache miss. Recien ahora delega al servicio remoto.");

    const pelicula = this.catalogoRemoto.obtenerPelicula(
      codigoPelicula,
      calidadFinal,
      historial,
    );

    this.cacheCompartida.set(claveCache, pelicula);
    return pelicula;
  }
}

module.exports = ProxyDeStreaming;
