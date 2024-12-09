
Feature: Login de usuario

  Scenario: Login exitoso con correo y contraseña válidos
    Given el usuario está en la página de login
    When ingresa como usuario "Francisco" y contraseña "Fran2024"
    Then se muestra como mensaje "usuario logueado con Éxito"