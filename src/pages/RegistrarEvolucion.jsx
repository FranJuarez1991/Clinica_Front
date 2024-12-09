import React, { useState, useEffect } from "react";
import "../css/evolucion.css";
import axios from "axios";
import NavbarC from "../components/NavbarC";
import ModalC from "../components/ModalC";
import { useNavigate } from "react-router-dom";

const RegistrarEvolucion = () => {
  const [dni, setDni] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState("");
  const [evoluciones, setEvoluciones] = useState([]);
  const [observacion, setObservacion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const cargarDiagnosticos = async () => {
      try {
        const response = await axios.get("http://localhost:3001/diagnosticos");
        setDiagnosticos(response.data);
      } catch (error) {
        console.error("Error al cargar los diagnósticos:", error);
        setError("Error al cargar los diagnósticos");
      }
    };

    cargarDiagnosticos();
  }, []);

  const buscarPaciente = async () => {
    setError(""); // Restablecer el mensaje de error antes de hacer la búsqueda
    try {
      const response = await axios.get(
        `http://localhost:3001/pacientes/buscar-paciente/${dni}`
      );
      setPaciente(response.data.data);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Error al buscar el paciente");
        setPaciente(null);
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };

  const guardarEvolucion = async () => {
    if (!diagnosticoSeleccionado) {
      alert("Debe seleccionar un diagnóstico antes de continuar.");
      return;
    }

    if (!observacion.trim()) {
      alert("La observación no puede estar vacía.");
      return;
    }

    try {
      const nuevaEvolucion = {
        dni: paciente.paciente.dni,
        diagnostico: diagnosticoSeleccionado,
        descripcion: observacion,
        fecha: new Date().toLocaleDateString(),
        historiaClinicaId: paciente.historiaClinicaId,
      };

      await axios.post(`http://localhost:3001/evoluciones`, nuevaEvolucion);
      setEvoluciones([...evoluciones, nuevaEvolucion]);
      alert("Evolución clínica guardada exitosamente.");
      setObservacion(""); // Limpiar el campo de observación
      setIsModalOpen(false); // Cierra el modal
    } catch (error) {
      console.error("Error al guardar evolución:", error);
      alert("Error al guardar la evolución.");
    }
  };

  const irARecetaDigital = () => {
    navigate("/receta-digital", { state: { paciente } });
  };
  const irANuevoPedidoLaboratorio = () => {
    if (!diagnosticoSeleccionado) {
      alert("Debe seleccionar un diagnóstico antes de continuar.");
      return;
    }
    if (!paciente?.historiaClinicaId?._id) {
      alert("No se ha encontrado el ID de la historia clínica del paciente.");
      return;
    }
    navigate("/pedidosLaboratorio", {
      state: {
        paciente: paciente,
        historiaClinicaId: paciente.historiaClinicaId._id, // Acceso correcto al _id
      },
    });
  };

  return (
    <>
      <NavbarC />
      <div className="container">
        <div className="sidebar">
          <h2>Diagnósticos</h2>
          <div className="diagnosticos-list">
            {diagnosticos.length > 0 ? (
              diagnosticos.map((diag) => (
                <div
                  key={diag.codigo}
                  className={`diagnostico-item ${
                    diagnosticoSeleccionado === diag.descripcion
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => setDiagnosticoSeleccionado(diag.descripcion)}
                >
                  {diag.descripcion}
                </div>
              ))
            ) : (
              <p>No hay diagnósticos disponibles.</p>
            )}
          </div>
        </div>

        <div className="main-content">
          <h1>Registrar Evolución</h1>
          <div>
            <label htmlFor="dni">Buscar por DNI:</label>
            <input
              type="text"
              id="dni"
              value={dni}
              onChange={(e) => setDni(e.target.value)}
              placeholder="Ingrese el DNI"
            />
            <button onClick={buscarPaciente}>Buscar</button>
          </div>

          {error && <p style={{ color: "red" }}>{error}</p>}

          {paciente && (
            <>
              <div>
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

              <div className="lab-request">
                <button
                  onClick={() => {
                    if (!diagnosticoSeleccionado) {
                      alert(
                        "Debe seleccionar un diagnóstico antes de continuar."
                      );
                    } else {
                      setModalType("evolucion");
                      setIsModalOpen(true);
                    }
                  }}
                >
                  Nueva Evolución
                </button>
              </div>
              <div className="lab-request">
                <h2>Pedidos de Laboratorio</h2>
                <button onClick={irANuevoPedidoLaboratorio}>
                  Nuevo Pedido
                </button>
              </div>
              <div className="digital-prescription">
                <h2>Receta Digital</h2>
                <button
                  onClick={() => {
                    if (!diagnosticoSeleccionado) {
                      alert(
                        "Debe seleccionar un diagnóstico antes de continuar."
                      );
                    } else {
                      irARecetaDigital(); // Llamar a la función correctamente
                    }
                  }}
                >
                  Nueva Receta
                </button>
              </div>

              <div className="evoluciones">
                <h2>Evoluciones</h2>
                {evoluciones.length > 0 ? (
                  evoluciones.map((evolucion, index) => (
                    <div key={index}>
                      <p>
                        <strong>Diagnóstico:</strong> {evolucion.diagnostico}
                      </p>
                      <p>
                        <strong>Comentario:</strong> {evolucion.descripcion}
                      </p>
                      <p>
                        <strong>Fecha:</strong> {evolucion.fecha}
                      </p>
                    </div>
                  ))
                ) : (
                  <p>No hay evoluciones registradas.</p>
                )}
              </div>

              <ModalC
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={guardarEvolucion}
                modalType={modalType}
                diagnosticos={diagnosticos}
                diagnosticoSeleccionado={diagnosticoSeleccionado}
                observacion={observacion}
                setObservacion={setObservacion}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default RegistrarEvolucion;
