// src/store/cartStore.js
import { create } from 'zustand';

const useCartStore = create((set) => ({
  carrito: [],
  agregarAlCarrito: (producto) =>
    set((state) => ({
      carrito: [...state.carrito, { ...producto, cantidad: 1 }],
    })),
  eliminarDelCarrito: (productoId) =>
    set((state) => ({
      carrito: state.carrito.filter((item) => item.id !== productoId),
    })),
  actualizarCantidad: (productoId, cantidad) =>
    set((state) => ({
      carrito: state.carrito.map((item) =>
        item.id === productoId ? { ...item, cantidad } : item
      ),
    })),
  vaciarCarrito: () =>
    set(() => ({
      carrito: [],
    })),
  obtenerPrecioTotal: () =>
    set((state) =>
      state.carrito.reduce((total, item) => total + item.price * item.cantidad, 0)
    ),
}));

export default useCartStore;