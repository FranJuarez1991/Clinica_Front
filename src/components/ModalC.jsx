import React, { useState, useEffect } from "react";
import "../css/Modal.css";

const ModalC = ({
  isOpen,
  onClose,
  onSave,
  modalType,
  diagnosticos = [],
  diagnosticoSeleccionado,
  observacion,
  setObservacion,
}) => {
  useEffect(() => {
    if (!isOpen) {
      setObservacion(""); // Limpiar observación cuando el modal se cierre
    }
  }, [isOpen, setObservacion]);

  const handleGuardar = () => {
    if (modalType === "evolucion" && !observacion.trim()) {
      alert("Debe ingresar una observación.");
      return;
    }
    if (modalType === "pedido" && !observacion.trim()) {
      alert("Debe ingresar un pedido.");
      return;
    }
    onSave(); // Guardar la evolución o pedido
    onClose(); // Cerrar el modal
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {modalType === "pedido" ? "Pedido de Laboratorio" : "Nueva Evolución"}
        </h2>

        {modalType === "pedido" ? (
          <textarea
            placeholder="Ingresa el pedido (máx. 50 caracteres)"
            value={observacion}
            onChange={(e) => setObservacion(e.target.value)}
            maxLength={50}
            className="modal-textarea"
          />
        ) : (
          <>
            <label htmlFor="diagnostico">Seleccionar Diagnóstico:</label>
            <select
              id="diagnostico"
              value={diagnosticoSeleccionado}
              onChange={(e) => setObservacion(e.target.value)}
              className="modal-select"
            >
              <option value="">Seleccione un diagnóstico</option>
              {diagnosticos.map((diag) => (
                <option key={diag.codigo} value={diag.descripcion}>
                  {diag.descripcion}
                </option>
              ))}
            </select>

            <textarea
              placeholder="Ingrese la observación"
              value={observacion}
              onChange={(e) => setObservacion(e.target.value)}
              className="modal-textarea"
            />
          </>
        )}

        <button onClick={handleGuardar}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalC;
