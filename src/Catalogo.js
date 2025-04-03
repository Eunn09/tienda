import React, { useState, useEffect } from "react";

const Catalogo = () => {
const [productos, setProductos] = useState([]);

  useEffect(() => {
    // Simulación de productos (puedes cambiarlo por una petición a tu backend)
    const productosEjemplo = [
      { id: 1, nombre: "Camiseta", descripcion: "Camiseta de algodón", precio: 200, imagen: "https://via.placeholder.com/150" },
      { id: 2, nombre: "Pantalón", descripcion: "Pantalón de mezclilla", precio: 400, imagen: "https://via.placeholder.com/150" },
      { id: 3, nombre: "Zapatos", descripcion: "Zapatos deportivos", precio: 600, imagen: "https://via.placeholder.com/150" },
    ];
    setProductos(productosEjemplo);
  }, []);

  return (
    <div className="catalogo-container">
      <h1>Catálogo de Productos</h1>
      <div className="productos-grid">
        {productos.map((producto) => (
          <div key={producto.id} className="producto-card">
            <img src={producto.imagen} alt={producto.nombre} />
            <h3>{producto.nombre}</h3>
            <p>{producto.descripcion}</p>
            <p className="precio">${producto.precio}</p>
            <button className="btn-comprar">Comprar</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Catalogo;