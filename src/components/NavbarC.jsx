import React, { useState } from "react";
import { Link } from "react-router-dom"; // Para navegación entre rutas
import "../css/Navbar.css"; // Importamos los estilos

const NavbarC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Estado para el menú móvil

  const toggleMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen); // Alternamos el estado del menú
  };

  return (
    <>
      <nav className={`navbar ${isMobileMenuOpen ? "open" : ""}`}>
        <div className="logo-container">
          <img
            src="https://png.pngtree.com/png-clipart/20230816/original/pngtree-cross-medical-logo-template-vector-clinic-people-healthy-vector-picture-image_10858169.png"
            width="100"
            height="100"
            style={{ marginRight: "5px" }}
            alt="Logo"
          />
          <span className="logo-text">CLINICAPP</span>
        </div>

        <ul className={isMobileMenuOpen ? "navLinksMobile" : "navLinks"}>
          <li className="navItem">
            <Link
              to="/registrar-evolucion"
              className="d-flex align-items-center"
            >
              Registrar Evolución
            </Link>
          </li>
          <li className="navItem ms-auto">
            <Link to="/">Cerrar Sesión</Link>
          </li>
        </ul>
      </nav>

      {/* Contenido principal */}
      <main className="page-content"></main>
    </>
  );
};

export default NavbarC;
