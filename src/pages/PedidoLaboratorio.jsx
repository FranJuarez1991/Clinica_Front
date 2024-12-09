import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import NavbarC from "../components/NavbarC";

const PedidoLaboratorio = () => {
  const [pedido, setPedido] = useState({
    historiaClinicaId: "",
    tipoEstudio: "",
    observaciones: "",
    fecha: new Date().toISOString().split("T")[0],
  });

  const navigate = useNavigate();
  const location = useLocation(); // Obtener el estado de la navegación
  const paciente = location.state?.paciente; // Acceder al paciente pasado por el estado

  useEffect(() => {
    if (paciente) {
      setPedido((prevPedido) => ({
        ...prevPedido,
        historiaClinicaId: paciente.historiaClinicaId, // Asignar historiaClinicaId automáticamente
      }));
    } else {
      toast.error("No se encontraron los datos del paciente.");
    }
  }, [paciente]); // Solo se ejecuta cuando `paciente` cambia

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPedido({ ...pedido, [name]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3001/historiasClinicas/pedidosLaboratorio",
        pedido
      );
      toast.success(response.data.msg);

      // Regresar a la página principal (Registrar Evolución) después de guardar el pedido
      navigate("/registrar-evolucion", {
        state: {
          paciente: paciente, // Pasamos el paciente nuevamente con el pedido agregado
        },
      });
    } catch (err) {
      const errorMsg =
        err.response?.data?.msg ||
        "Error al enviar el pedido. Por favor, inténtalo nuevamente.";
      toast.error(errorMsg);
    }
  };

  return (
    <>
      <NavbarC />
      <div style={{ maxWidth: "600px", margin: "auto" }}>
        <h2>Pedido de Laboratorio Médico</h2>
        <form onSubmit={handleSubmit}>
          {/* Mostrar los datos del paciente */}
          <div>
            <label>Nombre:</label>
            <input
              type="text"
              value={paciente?.paciente?.nombre || ""}
              disabled
            />
          </div>

          <div>
            <label>Apellido:</label>
            <input
              type="text"
              value={paciente?.paciente?.apellido || ""}
              disabled
            />
          </div>

          <div>
            <label>DNI:</label>
            <input type="text" value={paciente?.paciente?.dni || ""} disabled />
          </div>

          <div>
            <label>Obra Social:</label>
            <input type="text" value={paciente?.obraSocial || ""} disabled />
          </div>

          {/* El campo historiaClinicaId ya se asigna automáticamente */}
          {/*<div>
          <label>Historia Clínica ID:</label>
          <input
            type="text"
            name="historiaClinicaId"
            value={pedido.historiaClinicaId}
            disabled // Deshabilitar este campo ya que se llena automáticamente
          />
        </div>*/}

          <div>
            <label>Tipo de Estudio:</label>
            <select
              name="tipoEstudio"
              value={pedido.tipoEstudio}
              onChange={handleChange}
              required
            >
              <option value="">Seleccionar</option>
              <option value="Hemograma">Hemograma</option>
              <option value="Glucosa">Glucosa</option>
              <option value="Colesterol">Colesterol</option>
              <option value="Electrolitos">Electrolitos</option>
            </select>
          </div>

          <div>
            <label>Observaciones:</label>
            <textarea
              name="observaciones"
              value={pedido.observaciones}
              onChange={handleChange}
              rows="4"
            ></textarea>
          </div>

          <div>
            <label>Fecha del Pedido:</label>
            <input
              type="date"
              name="fecha"
              value={pedido.fecha}
              onChange={handleChange}
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              marginTop: "20px",
            }}
          >
            <button
              type="submit"
              style={{
                backgroundColor: "green",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Enviar Pedido
            </button>

            <button
              type="button"
              onClick={() => navigate("/registrar-evolucion")}
              style={{
                backgroundColor: "red",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancelar
            </button>
          </div>
        </form>

        <ToastContainer />
      </div>
    </>
  );
};

export default PedidoLaboratorio;
