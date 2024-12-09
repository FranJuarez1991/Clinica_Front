import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavbarC from "../components/NavbarC";
import "../css/Receta.css";
import axios from "axios";

const RecetaDigital = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const paciente = location.state?.paciente;

  const [descripcion, setDescripcion] = useState("");
  const [medicamentos, setMedicamentos] = useState([]);
  const [error, setError] = useState("");
  const [medicamentoSeleccionado, setMedicamentoSeleccionado] = useState(null);
  const [receta, setReceta] = useState([]);
  const [medico, setMedico] = useState(null);

  useEffect(() => {
    obtenerDatosMedico();
  }, []);

  // Función para obtener los datos del médico
  const obtenerDatosMedico = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        "http://localhost:3001/medico/mi-datos",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setMedico(response.data.data);
    } catch (error) {
      console.error("Error al obtener los datos del médico:", error);
      setError("Error al obtener los datos del médico");
    }
  };

  const buscarMedicamentos = async () => {
    try {
      if (descripcion.length < 3) {
        setError("La descripción debe tener al menos 3 caracteres");
        return;
      }
      setError("");
      const response = await axios.get(
        "http://localhost:3001/medicamentos/descripcion",
        {
          params: { descripcion, pagina: 1, limite: 10 },
        }
      );
      setMedicamentos(response.data.data);
    } catch (error) {
      console.error("Error al buscar medicamentos:", error);
      setError("Error al obtener los medicamentos");
    }
  };

  const seleccionarMedicamento = (medicamento) => {
    setMedicamentoSeleccionado(medicamento);
  };

  const agregarAMedicamento = () => {
    if (receta.length >= 2) {
      setError("Solo puedes agregar hasta 2 medicamentos a la receta.");
      return;
    }
    if (medicamentoSeleccionado) {
      setReceta((prevReceta) => [...prevReceta, medicamentoSeleccionado]);
      setMedicamentoSeleccionado(null);
      setError(""); // Limpiar el error si se agrega correctamente
    }
  };

  // Función para imprimir la receta
  const imprimirReceta = () => {
    window.print(); // Ejecuta la función de impresión
  };

  // Función para redirigir al hacer clic en el botón de cancelar
  const handleCancelar = () => {
    navigate(-1, {
      state: { paciente }, // Pasamos los datos del paciente al navegar
    });
  };

  return (
    <div className="container">
      <NavbarC />
      <h1>Receta Digital</h1>
      {paciente ? (
        <div className="patient-info">
          <h2>Información del Paciente</h2>
          <p>
            <strong>Nombre:</strong> {paciente.paciente.nombre}
          </p>
          <p>
            <strong>Apellido:</strong> {paciente.paciente.apellido}
          </p>
          <p>
            <strong>DNI:</strong> {paciente.paciente.dni}
          </p>
          <p>
            <strong>Fecha de Nacimiento:</strong>{" "}
            {paciente.paciente.fechaNacimiento}
          </p>
          <p>
            <strong>Edad:</strong> {paciente.paciente.edad} años
          </p>
          <p>
            <strong>Obra Social:</strong> {paciente.obraSocial}
          </p>
        </div>
      ) : (
        <p>No se encontraron datos del paciente.</p>
      )}

      {medico && (
        <div className="doctor-info">
          <h2>Información del Médico</h2>
          <p>
            <strong>Nombre:</strong> {medico.nombreUsuario}
          </p>
          <p>
            <strong>Especialidad:</strong>{" "}
            {medico.especialidad || "No especificada"}
          </p>
        </div>
      )}

      <div className="search-container">
        <h3>Buscar Medicamento</h3>
        <input
          type="text"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          placeholder="Buscar por descripción del medicamento"
        />
        <button onClick={buscarMedicamentos}>Buscar</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {medicamentos.length > 0 && (
          <ul>
            {medicamentos.map((medicamento) => (
              <li
                key={medicamento.codigo}
                onClick={() => seleccionarMedicamento(medicamento)}
                style={{
                  backgroundColor:
                    medicamentoSeleccionado?.codigo === medicamento.codigo
                      ? "#b2dfdb"
                      : "transparent",
                }}
              >
                <strong>{medicamento.descripcion}</strong> -{" "}
                {medicamento.codigo} - {medicamento.formato}
              </li>
            ))}
          </ul>
        )}
        {medicamentoSeleccionado && (
          <div className="selected-item">
            <p>
              <strong>{medicamentoSeleccionado.descripcion}</strong> -{" "}
              {medicamentoSeleccionado.codigo} -{" "}
              {medicamentoSeleccionado.formato}
            </p>
            <button onClick={agregarAMedicamento}>Agregar a la receta</button>
          </div>
        )}
      </div>

      {receta.length > 0 && (
        <div className="recipe-container">
          <h3>Receta Digital:</h3>
          <ul>
            {receta.map((medicamento, index) => (
              <li key={index}>
                <strong>{medicamento.descripcion}</strong> -{" "}
                {medicamento.codigo} - {medicamento.formato}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div>
        <button className="cancel-button" onClick={handleCancelar}>
          Cancelar
        </button>
        <button className="print-button" onClick={imprimirReceta}>
          Imprimir Receta
        </button>
      </div>
    </div>
  );
};

export default RecetaDigital;
