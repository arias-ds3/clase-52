// src/components/Carrito.jsx
import { Button, Drawer, List, Image } from "antd";
import { FaShoppingCart } from "react-icons/fa";
import useCartStore from "../store/cartStore";

const Carrito = ({ visible, onClose }) => {
  const { carrito, eliminarDelCarrito, actualizarCantidad } = useCartStore();

  const precioTotal = carrito.reduce(
    (total, item) => total + item.price * item.cantidad,
    0
  );

  return (
    <Drawer
      title={`Carrito de Compras (${carrito.length} items)`}
      placement="right"
      onClose={onClose}
      open={visible}
      width={window.innerWidth < 768 ? "80vw" : 400}
      className="carrito-drawer"
    >
      <List
        dataSource={carrito}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button
                type="link"
                onClick={() => eliminarDelCarrito(item.id)}
                danger
              >
                Eliminar
              </Button>,
            ]}
          >
            <List.Item.Meta
              avatar={<Image src={item.image} width={50} preview={false} />}
              title={item.title}
              description={
                <div>
                  <p>Precio: ${item.price.toFixed(2)}</p>
                  <p>
                    Cantidad:
                    <input
                      type="number"
                      min="1"
                      value={item.cantidad}
                      onChange={(e) =>
                        actualizarCantidad(item.id, Number(e.target.value))
                      }
                      style={{ width: 60, marginLeft: 8 }}
                    />
                  </p>
                  <p>Subtotal: ${(item.price * item.cantidad).toFixed(2)}</p>
                </div>
              }
            />
          </List.Item>
        )}
      />
      <div style={{ marginTop: 20, textAlign: "right" }}>
        <h3>Total: ${precioTotal.toFixed(2)}</h3>
        <Button type="primary" disabled={carrito.length === 0}>
          Proceder al pago
        </Button>
      </div>
    </Drawer>
  );
};

export default Carrito;