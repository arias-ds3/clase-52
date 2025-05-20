import { useState, useEffect } from "react";
import Producto from "./components/Producto";
import Card from "./components/Card";
import { FaSearch, FaDollarSign, FaList, FaSortAmountDown } from "react-icons/fa";
import "./styles/App.css";

function App() {
  const [productos, setProductos] = useState([]);
  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroPrecioMin, setFiltroPrecioMin] = useState("");
  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [ordenarPorPrecio, setOrdenarPorPrecio] = useState(false);
  const [categorias, setCategorias] = useState([]);

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

  return (
    <>
      <h1 className="titulo-tienda">Tienda de Productos</h1>

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
              <FaSortAmountDown className="icono-filtro" /> Ordenar por precio (menor a mayor):
              <input
                type="checkbox"
                checked={ordenarPorPrecio}
                onChange={(e) => setOrdenarPorPrecio(e.target.checked)}
              />
            </label>
          </div>
        </div>
        <button className="limpiar-filtros" onClick={limpiarFiltros}>
          Limpiar Filtros
        </button>
      </div>

      <div className="product-list">
        {productosFiltrados.length > 0 ? (
          productosFiltrados.map((producto) => (
            <Card key={producto.id} orientacion="vertical" className="card">
              <Producto
                src={producto.image}
                title={producto.title}
                price={producto.price}
                description={producto.description} // Usamos la descripción original en inglés
              />
            </Card>
          ))
        ) : productos.length === 0 ? (
          <p>Cargando productos...</p>
        ) : (
          <p>No se encontraron productos.</p>
        )}
      </div>
    </>
  );
}

export default App;