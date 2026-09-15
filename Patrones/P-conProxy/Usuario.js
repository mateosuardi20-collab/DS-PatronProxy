// Este archivo representa el modelo de datos del usuario.
//
// Cada usuario tiene:
// - un nombre
// - un plan (Básico, Estándar o Premium)
//
// El Proxy usa esta información para decidir qué calidad máxima puede
// entregar a cada usuario.
class Usuario {
  constructor(nombre, plan) {
    this.nombre = nombre;
    this.plan = plan; 
  }
}

module.exports = Usuario;
