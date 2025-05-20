import React from "react";
import "../styles/card.css"

export default function Card({ children, orientacion, tamaño }) {
  const estilos = `card ${orientacion} ${tamaño || ""}`.trim();
  return <div className={estilos}>{children}</div>;
}