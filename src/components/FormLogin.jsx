import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";

const FormLogin = () => {
  const [credentials, setCredentials] = useState({
    nombreUsuario: "",
    contrasenia: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar carga
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Iniciar carga
    setError(""); // Limpiar el mensaje de error antes de hacer la solicitud

    try {
      const response = await axios.post(
        "http://localhost:3001/usuarios/iniciarSesion", // url backend
        credentials
      );
      const { token, msg } = response.data;

      // Guardar token en localStorage
      localStorage.setItem("token", token);

      // Redirigir al dashboard o la página de inicio
      alert(msg);
      navigate("/PanelDeControl"); // redireccionar al panel de control
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        "Error al iniciar sesión, inténtalo nuevamente";
      setError(errorMsg); // Mostrar el error si ocurre
    } finally {
      setLoading(false); // Finalizar carga
    }
  };

  return (
    <div className="card shadow-lg p-4 login-card animate__animated animate__fadeIn">
      <h2 className="text-center mb-4">Inicio de Sesión</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="nombreUsuario" className="form-label">
            Nombre de Usuario
          </label>
          <input
            type="text"
            id="nombreUsuario"
            name="nombreUsuario"
            className="form-control"
            value={credentials.nombreUsuario}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="contrasenia" className="form-label">
            Contraseña
          </label>
          <input
            type="password"
            id="contrasenia"
            name="contrasenia"
            className="form-control"
            value={credentials.contrasenia}
            onChange={handleInputChange}
            required
          />
        </div>
        <button
          type="submit"
          className="btn btn-success w-100 animate__animated animate__pulse animate__infinite"
          disabled={loading} // Deshabilitar mientras carga
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>
      </form>
      {error && <p style={{ color: "red", marginTop: "10px" }}>{error}</p>}
    </div>
  );
};

export default FormLogin;
