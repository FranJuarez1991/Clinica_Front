Feature: Login

  Scenario: Login fallido contraseña incorrecta
    Given el usuario registrado como "Francisco"
    When el usuario ingresa su contraseña "123456"
    Then el sistema debe mostrar un mensaje de "Usuario y/o contraseña incorrecta"
