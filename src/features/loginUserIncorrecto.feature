Feature: Login de usuario

  Scenario: Intento de inicio de sesión fallido por usuario incorrecto
    Given el usuario ingresado es "Franco"
    When ingresa una contraseña "Fran2024" y presiona el botón "Iniciar sesión"
    Then el sistema muestra un mensaje de error "Usuario y/o contaseña incorrecta"


