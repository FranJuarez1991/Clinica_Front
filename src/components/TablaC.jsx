import React from "react";
import "../css/TablaC.css";

const TablaC = ({ evoluciones, paciente, diagnostico, onEdit }) => {
  if (!evoluciones || evoluciones.length === 0) {
    return <p>No hay evoluciones para mostrar.</p>;
  }

  console.log("Evoluciones:", evoluciones);

  return (
    <table>
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Tipo de Estudio</th>
          <th>Diagnóstico</th>
          <th>Descripción</th>
          <th>Acción</th>
        </tr>
      </thead>
      <tbody>
        {evoluciones.map((evolucion) => (
          <tr key={evolucion._id}>
            <td>
              {evolucion.fecha
                ? new Date(evolucion.fecha).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Fecha no disponible"}
            </td>
            <td>{evolucion.tipoEstudio || "Tipo de estudio no disponible"}</td>
            <td>
              {evolucion.diagnostico?.descripcion ||
                "Diagnóstico no disponible"}
            </td>
            <td>{evolucion.texto || "Texto no disponible"}</td>
            <td>
              <button className="edit-button" onClick={() => onEdit(evolucion)}>
                Editar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TablaC;
