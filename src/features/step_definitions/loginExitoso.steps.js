const { Given, When, Then } = require("@cucumber/cucumber");
const axios = require("axios");
const assert = require("assert");

// Variables para almacenar datos del usuario y la respuesta
let nombreUsuario;
let contrasenia;
let respuesta;

console.log("**********Escenario Login exitoso**********");

Given("el usuario está en la página de login", function () {
  console.log("Given: Usuario está en la página de login");
  // Aquí puedes inicializar variables o simular acceso a la página
});

When(
  "ingresa como usuario {string} y contraseña {string}",
  async function (nombre, password) {
    console.log(
      `When: Usuario "${nombre}" intenta iniciar sesión con contraseña "${password}"`
    );
    nombreUsuario = nombre;
    contrasenia = password;

    try {
      // Realizar la llamada al endpoint del backend
      respuesta = await axios.post(
        "http://localhost:3001/usuarios/iniciarSesion",
        {
          nombreUsuario,
          contrasenia,
        }
      );
    } catch (error) {
      respuesta = error.response; // Capturar el error en caso de fallo
    }
  }
);

Then("se muestra como mensaje {string}", function (mensajeEsperado) {
  console.log(mensajeEsperado);
  assert.strictEqual(
    respuesta.data.msg,
    mensajeEsperado,
    "El mensaje no coincide"
  );
});
