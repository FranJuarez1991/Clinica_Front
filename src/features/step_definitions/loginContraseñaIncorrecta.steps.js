const { Given, When, Then } = require("@cucumber/cucumber");
const assert = require("assert");
const axios = require("axios");

let response; // Para almacenar la respuesta del servidor
console.log("**********Escenario Login contraseña incorrecta**********");
// Paso Given: Simulamos que el usuario 'Francisco' está registrado
Given("el usuario registrado como {string}", function (nombreUsuario) {
  // Simulamos que el usuario no existe en la base de datos (no es necesario hacer nada adicional aquí)
  this.nombreUsuario = nombreUsuario; // Guardamos el nombre del usuario ingresado
  console.log(`El usuario ingresado es: ${this.nombreUsuario}`);
});

// Paso When: El usuario intenta iniciar sesión con una contraseña incorrecta
When("el usuario ingresa su contraseña {string}", async function (contrasenia) {
  try {
    // Simulamos el intento de login enviando datos al endpoint
    response = await axios.post(
      "http://localhost:3001/usuarios/iniciarSesion",
      {
        nombreUsuario: this.nombreUsuario, // Usuario proporcionado en el paso anterior
        contrasenia: contrasenia, // Contraseña incorrecta proporcionada
      }
    );
  } catch (error) {
    response = error.response; // Capturamos el error devuelto por el backend
  }
  console.log(`Intento de login con contraseña: ${contrasenia}`);
});

// Paso Then: Verificamos que el sistema devuelve el mensaje esperado
Then(
  "el sistema debe mostrar un mensaje de {string}",
  function (mensajeEsperado) {
    // Verificamos que el mensaje del servidor sea el esperado
    assert.strictEqual(response.data.msg, mensajeEsperado);
    console.log("Mensaje recibido:", response.data.msg);
  }
);
