// Este archivo representa al usuario del sistema.
//
// Cada usuario tiene un nombre y un plan, y esa información se usa
// para decidir la calidad máxima permitida.
class Usuario {
  constructor(nombre, plan) {
    this.nombre = nombre;
    this.plan = plan; // ejemplos: "Estándar" o "Premium"
  }
}

module.exports = Usuario;
