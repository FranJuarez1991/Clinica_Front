import React, { useEffect } from "react";
import "../css/Modal.css";

const ModalC = ({
  isOpen,
  onClose,
  onSave,
  modalType,
  diagnosticos,
  diagnosticoSeleccionado,
  setDiagnosticoSeleccionado,
  observacion,
  setObservacion,
}) => {
  useEffect(() => {
    if (!isOpen) {
      setObservacion("");
    }
  }, [isOpen, setObservacion]);

  const handleGuardar = () => {
    if (!diagnosticoSeleccionado.codigo) {
      alert("Debe seleccionar un diagnóstico.");
      return;
    }
    if (!observacion.trim()) {
      alert("Debe ingresar una observación.");
      return;
    }
    onSave(diagnosticoSeleccionado, observacion);

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>
          {modalType === "pedido" ? "Pedido de Laboratorio" : "Nueva Evolución"}
        </h2>
        <label htmlFor="diagnostico">Seleccionar Diagnóstico:</label>
        <select
          id="diagnostico"
          value={diagnosticoSeleccionado?.codigo || ""}
          onChange={(e) =>
            setDiagnosticoSeleccionado(
              diagnosticos.find((diag) => diag.codigo === e.target.value) || {}
            )
          }
          className="modal-select"
        >
          <option value="">Seleccione un diagnóstico</option>
          {diagnosticos.map((diag) => (
            <option key={diag.codigo} value={diag.codigo}>
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

        <button onClick={handleGuardar}>Guardar</button>
        <button onClick={onClose}>Cancelar</button>
      </div>
    </div>
  );
};

export default ModalC;
