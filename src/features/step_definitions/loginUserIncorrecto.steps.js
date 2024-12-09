const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");

let response; // Para almacenar la respuesta del servidor

console.log("**********Escenario Login usuario incorrecto**********");

// Implementamos el paso 'Given' que simula que el usuario no está registrado
Given("el usuario ingresado es {string}", function (nombreUsuario) {
  // Simulamos que el usuario no existe en la base de datos (no es necesario hacer nada adicional aquí)
  this.nombreUsuario = nombreUsuario; // Guardamos el nombre del usuario ingresado
  console.log(`El usuario ingresado es: ${this.nombreUsuario}`);
});

When(
  "ingresa una contraseña {string} y presiona el botón {string}",
  async function (contrasenia, boton) {
    // Simulamos el intento de login enviando datos al endpoint
    try {
      response = await axios.post(
        "http://localhost:3001/usuarios/iniciarSesion",
        {
          nombreUsuario: this.nombreUsuario, // Usuario proporcionado en el paso anterior
          contrasenia, // Contraseña ingresada
        }
      );
    } catch (error) {
      response = error.response; // Capturamos el error devuelto por el backend
    }
    console.log(
      `Intento de inicio de sesión con usuario: ${this.nombreUsuario}, contrasenia: ${contrasenia}`
    );
  }
);

Then(
  "el sistema muestra un mensaje de error {string}",
  function (mensajeEsperado) {
    // Verificamos que el mensaje del servidor sea el esperado
    assert.strictEqual(response.data.msg, mensajeEsperado);
    console.log("Mensaje recibido del sistema:", response.data.msg);
  }
);
