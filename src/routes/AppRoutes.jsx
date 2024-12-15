import React from "react";
import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import PanelDeControl from "../pages/PanelDeControl";
import RegistrarEvolucion from "../pages/RegistrarEvolucion";
import RecetaDigital from "../pages/RecetaDigital";
import PedidoLaboratorio from "../pages/PedidoLaboratorio";
import RecetaDigitalGenerada from "../pages/RecetaDigitalGenerada";

const AppRoutes = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/PanelDeControl" element={<PanelDeControl />} />
        <Route path="/registrar-evolucion" element={<RegistrarEvolucion />} />
        <Route path="/receta-digital" element={<RecetaDigital />} />
        <Route
          path="/receta-digital-generada"
          element={<RecetaDigitalGenerada />}
        />

        <Route path="/pedidosLaboratorio" element={<PedidoLaboratorio />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
