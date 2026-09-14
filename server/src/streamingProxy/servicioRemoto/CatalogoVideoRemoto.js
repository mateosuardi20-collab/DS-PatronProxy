class CatalogoVideoRemoto {
  obtenerPelicula(codigoPelicula, calidad, historial) {
    historial.push(
      `Servicio remoto: descarga ${codigoPelicula} en calidad ${calidad}.`,
    );

    return {
      codigoPelicula,
      calidad,
      archivo: `${codigoPelicula}-${calidad}.mp4`,
      origen: "catalogo-video-remoto",
    };
  }
}

module.exports = CatalogoVideoRemoto;
