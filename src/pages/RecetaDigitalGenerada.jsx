import React from "react";
import "../css/RecetaDigitalGenerada.css";
import { QRCodeCanvas } from "qrcode.react";
import { useLocation, useNavigate } from "react-router-dom";

const RecetaDigitalGenerada = () => {
  const { state } = useLocation();
  const { paciente, receta, diagnostico } = state || {};

  const fechaActual = new Date().toLocaleDateString();
  const navigate = useNavigate();

  const imprimirReceta = () => {
    window.print();
  };

  return (
    <div className="receta-container">
      <div className="receta-header">
        <div className="logo">
          <img
            src="https://png.pngtree.com/png-clipart/20230816/original/pngtree-cross-medical-logo-template-vector-clinic-people-healthy-vector-picture-image_10858169.png"
            alt="Logo de ClinicApp"
            width="100"
          />
        </div>

        <div className="info">
          <p>
            <strong>ClinicAPP</strong>
          </p>
          <p>9 de julio 785, Tucumán, San Miguel de Tucumán</p>
          <p>Tel: 381-4587581</p>
        </div>
        <div className="fecha-receta">
          <p>
            <strong>Fecha Receta:</strong> {fechaActual}
          </p>
          <p>
            <strong>Recetario</strong>
          </p>
          <div className="barcode">|||||||||||||||||||||||||||||</div>
        </div>
      </div>

      <div className="receta-body">
        <p>
          <strong>Beneficiario:</strong>
          {paciente?.paciente?.apellido && paciente?.paciente?.nombre
            ? `${paciente.paciente.apellido} ${paciente.paciente.nombre}`
            : "N/A"}
        </p>
        <p>
          <strong>Obra Social:</strong> {paciente?.obraSocial || "N/A"}
        </p>
        <p>
          <strong>N° Afiliado:</strong> {paciente?.nroafiliado || "N/A"}
        </p>

        <p>
          <strong>Rp/</strong>
        </p>
        {Array.isArray(receta) && receta.length > 0 ? (
          <ul>
            {receta.map((medicamento, index) => (
              <li key={index}>
                {`${medicamento.descripcion} (${medicamento.formato})`}{" "}
              </li>
            ))}
          </ul>
        ) : (
          <p>No se agregaron medicamentos.</p>
        )}

        <p>
          <strong>Diagnóstico:</strong> {diagnostico.descripcion || "N/A"}{" "}
        </p>
      </div>

      <div className="receta-footer">
        <p>
          <strong>Firmado electrónicamente por:</strong>
        </p>
        <p>Dr/a: Juarez Francisco</p>
        <p>Matrícula: 8899</p>
        <p>Especialidad: Clínico</p>
        <div className="qr-code">
          <QRCodeCanvas
            value={`https://www.example.com/receta/${paciente?.nroafiliado}`}
            size={50}
          />
        </div>
      </div>

      <button onClick={imprimirReceta}>Imprimir Receta</button>

      <button
        onClick={() => navigate("/PanelDeControl")}
        className="volver-inicio-btn"
      >
        Volver a Inicio
      </button>
    </div>
  );
};

export default RecetaDigitalGenerada;
