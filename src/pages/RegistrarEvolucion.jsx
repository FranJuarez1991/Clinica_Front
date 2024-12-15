import React, { useState, useEffect } from "react";
import "../css/evolucion.css";
import axios from "axios";
import NavbarC from "../components/NavbarC";
import ModalC from "../components/ModalC";
import { useNavigate } from "react-router-dom";
import TablaC from "../components/TablaC";

const RegistrarEvolucion = () => {
  const [dni, setDni] = useState("");
  const [paciente, setPaciente] = useState(null);
  const [error, setError] = useState("");
  const [diagnosticos, setDiagnosticos] = useState([]);
  const [diagnosticoSeleccionado, setDiagnosticoSeleccionado] = useState({});
  const [evoluciones, setEvoluciones] = useState([]);
  const [observacion, setObservacion] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("");
  const navigate = useNavigate();

  // Cargar los diagnósticos al inicio
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

  // Buscar paciente por DNI
  const buscarPaciente = async () => {
    setError("");
    try {
      const response = await axios.get(
        `http://localhost:3001/pacientes/buscar-paciente/${dni}`
      );

      const pacienteEncontrado = response.data.data;
      setPaciente(pacienteEncontrado);

      const evolucionesPaciente =
        pacienteEncontrado.historiaClinicaId.evoluciones || [];
      setEvoluciones(evolucionesPaciente); // Guardar solo los IDs de las evoluciones al principio
      console.log("Paciente encontrado:", pacienteEncontrado);
    } catch (error) {
      if (error.response) {
        setError(error.response.data.message || "Error al buscar el paciente");
        setPaciente(null);
      } else {
        setError("Error al conectar con el servidor");
      }
    }
  };
  // Cargar evoluciones completas usando los IDs
  useEffect(() => {
    const cargarEvoluciones = async () => {
      if (paciente && paciente.historiaClinicaId) {
        try {
          const response = await axios.get(
            `http://localhost:3001/evoluciones/${paciente.historiaClinicaId._id}`, // Asegúrate que esta URL es la correcta
            {
              params: {
                ids: paciente.historiaClinicaId.evoluciones.join(","), // Pasamos los IDs de las evoluciones como parámetros
              },
            }
          );
          // Almacenar las evoluciones completas en el estado
          setEvoluciones(response.data);
          console.log("Evoluciones completas:", response.data); // Verificar que las evoluciones completas son cargadas correctamente
        } catch (error) {
          console.error("Error al cargar las evoluciones:", error);
          setError("No hay Evoluciones para mostrar");
        }
      }
    };

    cargarEvoluciones();
  }, [paciente]); // Este useEffect se ejecuta cuando cambia el paciente
  // Guardar nueva evolución
  const guardarEvolucion = async () => {
    if (!diagnosticoSeleccionado.codigo || !observacion.trim()) {
      alert("Debe completar todos los campos antes de continuar.");
      return;
    }

    const token = localStorage.getItem("authToken");

    if (!token) {
      alert("No estás autenticado. Inicia sesión nuevamente.");
      navigate("/login");
      return;
    }

    const evolucionData = {
      diagnosticoCodigo: diagnosticoSeleccionado.codigo,
      textoLibre: observacion,
      historiaClinicaId: paciente.historiaClinicaId._id,
      tipoEstudio: "Consulta",
    };

    try {
      let response;

      if (modalType === "editarEvolucion") {
        // Si estamos editando una evolución existente
        const evolucionId = diagnosticoSeleccionado._id; // Obtener el ID de la evolución que estamos editando
        response = await axios.put(
          `http://localhost:3001/evoluciones/${evolucionId}`,
          evolucionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        // Actualizar el estado de las evoluciones en el frontend
        setEvoluciones((prevEvoluciones) =>
          prevEvoluciones.map((evolucion) =>
            evolucion._id === response.data._id ? response.data : evolucion
          )
        );
        alert("Evolución actualizada exitosamente.");
      } else {
        response = await axios.post(
          "http://localhost:3001/evoluciones",
          evolucionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setEvoluciones((prevEvoluciones) => [
          ...prevEvoluciones,
          response.data,
        ]);
        alert("Evolución registrada exitosamente.");
      }

      // Limpiar campos después de guardar
      setDiagnosticoSeleccionado({});
      setObservacion("");
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error al guardar la evolución:", error);
      alert("Hubo un error al guardar la evolución.");
    }
  };

  useEffect(() => {
    // Este código se ejecuta cuando se actualiza 'evoluciones'
    console.log("Evoluciones actualizadas:", evoluciones);
  }, [evoluciones]);

  // Manejar la edición de una evolución
  const handleEdit = (evolucion) => {
    setDiagnosticoSeleccionado(evolucion.diagnostico || {});
    setObservacion(evolucion.texto);
    setIsModalOpen(true);
    setModalType("editarEvolucion");
  };

  // Navegar a Receta Digital
  const irARecetaDigital = () => {
    if (!diagnosticoSeleccionado.codigo) {
      alert("Debe seleccionar un diagnóstico antes de continuar.");
      return;
    }
    navigate("/receta-digital", {
      state: {
        paciente,
        diagnostico: diagnosticoSeleccionado,
      },
    });
  };

  // Navegar a Nuevo Pedido de Laboratorio
  const irANuevoPedidoLaboratorio = () => {
    if (!diagnosticoSeleccionado.codigo) {
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
        historiaClinicaId: paciente.historiaClinicaId._id,
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
                    diagnosticoSeleccionado.codigo === diag.codigo
                      ? "selected"
                      : ""
                  }`}
                  onClick={() => {
                    console.log("Diagnóstico seleccionado:", diag);
                    setDiagnosticoSeleccionado(diag);
                  }}
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
                <p>
                  <strong>Número de Afiliado:</strong> {paciente.nroafiliado}
                </p>
              </div>

              <div className="lab-request">
                <button
                  onClick={() => {
                    if (!diagnosticoSeleccionado.codigo) {
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
                    if (!diagnosticoSeleccionado.codigo) {
                      alert(
                        "Debe seleccionar un diagnóstico antes de continuar."
                      );
                    } else {
                      irARecetaDigital();
                    }
                  }}
                >
                  Nueva Receta
                </button>
              </div>

              <div className="evoluciones">
                <h2>Evoluciones</h2>
                {evoluciones.length > 0 ? (
                  <>
                    <p>Datos de evoluciones:</p>
                    <TablaC
                      key={evoluciones.length}
                      evoluciones={evoluciones}
                      onEdit={handleEdit}
                    />
                  </>
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
