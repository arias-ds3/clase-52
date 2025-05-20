// src/App.js
import { useState, useEffect } from "react";
import { Button, Image, Card as AntCard } from "antd";
import {
  FaSearch,
  FaDollarSign,
  FaList,
  FaSortAmountDown,
  FaShoppingCart,
} from "react-icons/fa";
import useCartStore from "./store/cartStore";
import Carrito from "./components/Carrito";
import "./styles/App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [ordenarPorPrecio, setOrdenarPorPrecio] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [visible, setVisible] = useState(false);

  const { carrito, agregarAlCarrito } = useCartStore();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setProductos(data);
        const categoriasUnicas = [...new Set(data.map((prod) => prod.category))];
        setCategorias(categoriasUnicas);
      })
      .catch((error) => console.error("Error al cargar productos:", error));
  }, []);

  const productosFiltrados = productos
    .filter((producto) => {
      const coincideNombre = producto.title
        .toLowerCase()
        .includes(filtroNombre.toLowerCase());
      const coincidePrecio =
        filtroPrecioMin === "" || producto.price >= Number(filtroPrecioMin);
      const coincideCategoria =
        filtroCategoria === "" || producto.category === filtroCategoria;
      return coincideNombre && coincidePrecio && coincideCategoria;
    })
    .sort((a, b) => {
      if (ordenarPorPrecio) {
        return a.price - b.price;
      }
      return 0;
    });

  const limpiarFiltros = () => {
    setFiltroNombre("");
    setFiltroPrecioMin("");
    setFiltroCategoria("");
    setOrdenarPorPrecio(false);
  };

  const mostrarCarrito = () => {
    setVisible(true);
  };

  const cerrarCarrito = () => {
    setVisible(false);
  };

  return (
    <>
      <h1 className="titulo-tienda">Tienda de Productos</h1>

      <Button
        type="primary"
        icon={<FaShoppingCart />}
        onClick={mostrarCarrito}
        className="carrito-btn"
      >
        Carrito ({carrito.length})
      </Button>

      <div className="filtros-container">
        <h3>Filtrar Productos</h3>
        <div className="filtros-grid">
          <div className="filtro-item">
            <label htmlFor="filtro-nombre">
              <FaSearch className="icono-filtro" /> Nombre:
            </label>
            <input
              id="filtro-nombre"
              type="text"
              value={filtroNombre}
              onChange={(e) => setFiltroNombre(e.target.value)}
              placeholder="Buscar por nombre..."
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="filtro-precio">
              <FaDollarSign className="icono-filtro" /> Precio Mínimo:
            </label>
            <input
              id="filtro-precio"
              type="number"
              value={filtroPrecioMin}
              onChange={(e) => setFiltroPrecioMin(e.target.value)}
              placeholder="0"
            />
          </div>
          <div className="filtro-item">
            <label htmlFor="filtro-categoria">
              <FaList className="icono-filtro" /> Categoría:
            </label>
            <select
              id="filtro-categoria"
              value={filtroCategoria}
              onChange={(e) => setFiltroCategoria(e.target.value)}
            >
              <option value="">Todas las categorías</option>
              {categorias.map((categoria, index) => (
                <option key={index} value={categoria}>
                  {categoria}
                </option>
              ))}
            </select>
          </div>
          <div className="filtro-item filtro-ordenar">
            <label>
              <FaSortAmountDown className="icono-filtro" /> Ordenar por precio:
              <input
                type="checkbox"
                checked={ordenarPorPrecio}
                onChange={(e) => setOrdenarPorPrecio(e.target.checked)}
              />
            </label>
          </div>
        </div>
        <Button className="limpiar-filtros" onClick={limpiarFiltros}>
          Limpiar Filtros
        </Button>
      </div>

      <div className="product-list">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <AntCard
              key={producto.id}
              hoverable
              className="product-card"
              cover={<Image alt={producto.title} src={producto.image} />}
              actions={[
                <Button
                  type="primary"
                  onClick={() => agregarAlCarrito(producto)}
                  disabled={carrito.some((item) => item.id === producto.id)}
                >
                  Añadir al carrito
                </Button>,
              ]}
            >
              <AntCard.Meta
                title={producto.title}
                description={`$${producto.price.toFixed(2)}`}
              />
            </AntCard>
          ))
        ) : productos.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>

      <Carrito visible={visible} onClose={cerrarCarrito} />
    </>
  );
}

export default App;