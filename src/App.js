import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from "react-router-dom";
import Catalogo from "./Catalogo";
import './App.css';

function Login() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [mensaje, setMensaje] = useState("");
  const navigate = useNavigate();

  const BASE_URL = "https://tienda-acvfqmjuu-daniela-sarai-sanchez-sernas-projects.vercel.app/api/login";

  const handleLogin = () => {
    if (!email || !contrasena) {
      setMensaje("Por favor, completa todos los campos.");
      return;
    }
  
    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, contrasena }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.message === "Inicio de sesión exitoso") { // Aquí verificamos el mensaje
          setMensaje("Inicio de sesión exitoso");
          navigate("/catalogo"); // Redirige al catálogo
        } else {
          setMensaje(data.error || "Credenciales incorrectas");
        }
      })
      .catch((error) => {
        console.error("Error en el inicio de sesión:", error);
        setMensaje("Error al conectar con el servidor");
      });
    }

  return (
    <div className="login-container">
  <h1>Iniciar Sesión</h1>
  {mensaje && <p className="mensaje-error">{mensaje}</p>}
  <input className="login-input"
    type="email"
    placeholder="Email"
    value={email}
    onChange={(e) => setEmail(e.target.value)}
  />
  <input className="login-input"
    type="password"
    placeholder="Contraseña"
    value={contrasena}
    onChange={(e) => setContrasena(e.target.value)}
  />
  <button className="login-button" onClick={handleLogin}>Iniciar Sesión</button>
</div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </Router>
  );
}

export default App;
