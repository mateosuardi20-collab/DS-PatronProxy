const ReproductorConResponsabilidadesMezcladas = require("./codigoSinPatron/ReproductorConResponsabilidadesMezcladas");
const ProxyDeStreaming = require("./codigoConProxy/ProxyDeStreaming");
const CatalogoVideoRemoto = require("./servicioRemoto/CatalogoVideoRemoto");

function ejecutarVersionSinPatron() {
  const historial = [];
  const reproductor = new ReproductorConResponsabilidadesMezcladas();

  reproductor.reproducir(
    { nombre: "Carlos", plan: "familiar" },
    "pelicula-99",
    "ultra",
    historial,
  );
  reproductor.reproducir(
    { nombre: "Lucia", plan: "premium" },
    "pelicula-99",
    "ultra",
    historial,
  );
  reproductor.reproducir(
    { nombre: "Mateo", plan: "familiar" },
    "pelicula-99",
    "media",
    historial,
  );

  return historial;
}

function ejecutarVersionConProxy() {
  const historial = [];
  const catalogoRemoto = new CatalogoVideoRemoto();
  const cacheCompartida = new Map();

  const accesoCarlos = new ProxyDeStreaming(
    catalogoRemoto,
    { nombre: "Carlos", plan: "familiar" },
    cacheCompartida,
  );
  const accesoLucia = new ProxyDeStreaming(
    catalogoRemoto,
    { nombre: "Lucia", plan: "premium" },
    cacheCompartida,
  );
  const accesoMateo = new ProxyDeStreaming(
    catalogoRemoto,
    { nombre: "Mateo", plan: "familiar" },
    cacheCompartida,
  );

  accesoCarlos.obtenerPelicula("pelicula-99", "ultra", historial);
  accesoLucia.obtenerPelicula("pelicula-99", "ultra", historial);
  accesoMateo.obtenerPelicula("pelicula-99", "media", historial);

  return historial;
}

module.exports = {
  ejecutarVersionSinPatron,
  ejecutarVersionConProxy,
};
