import React from "react";

const Producto = ({ src, title, price, description }) => {
  return (
    <div className="producto">
      <img src={src} alt={title} />
      <h3>{title}</h3>
      <p>${price}</p>
      <p className="descripcion">{description}</p>
      <button>Agregar al carrito</button>
    </div>
  );
};

export default Producto;