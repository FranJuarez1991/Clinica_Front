import React, { useState, useEffect } from "react";
import axios from "axios";

const HistorialClinico = ({ historiaClinicaId }) => {
  const [historial, setHistorial] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/historiasClinicas/${historiaClinicaId}`
        );
        setHistorial(response.data);
      } catch (error) {
        console.error("Error al cargar el historial clínico:", error);
        setError("Error al cargar el historial clínico.");
      }
    };

    if (historiaClinicaId) {
      cargarHistorial();
    }
  }, [historiaClinicaId]);

  if (error) {
    return <p style={{ color: "red" }}>{error}</p>;
  }

  return (
    <div>
      <h3>Historial Clínico</h3>
      {historial.length > 0 ? (
        historial.map((item, index) => (
          <div key={index}>
            <p>
              <strong>Fecha:</strong> {item.fecha}
            </p>
            <p>
              <strong>Diagnóstico:</strong> {item.diagnostico}
            </p>
            <p>
              <strong>Observaciones:</strong> {item.observaciones}
            </p>
          </div>
        ))
      ) : (
        <p>No hay historial clínico disponible.</p>
      )}
    </div>
  );
};

export default HistorialClinico;
