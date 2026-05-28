import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { listarDomicilios} from "../api/domicilios";
import {crearPagos, listarMetodosPagos} from "../api/pagos";
import {crearEnvios} from "../api/envios";
import {crearVentaCabecera,crearVentaDetalle} from "../api/ventas"; 
import {modificarProducto} from "../api/products"
import "../styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();

  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);
  const [metodosPagoBD, setMetodosPagoBD] = useState([]);
  const [loading, setLoading] = useState(true);

  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [metodoPago, setMetodoPago] = useState("");

  const subtotal = cartItems.reduce((acc, item) => acc + item.precioUnitario * item.cantidad, 0);
  const costoEnvio = 2500;
  const total = subtotal + costoEnvio;

  const handleConfirmarPago = async (e) => {
    e.preventDefault();
    
    if (!direccionSeleccionada) {
      alert("Por favor, selecciona una dirección de envío.");
      return;
    }
    if (!metodoPago) {
      alert("Por favor, selecciona un método de pago.");
      return;
    }

    try {
      const idUsuarioActual = direccionesGuardadas.length > 0 ? direccionesGuardadas[0]?.usuario?.idUsuario : null;
      if (!idUsuarioActual) throw new Error("No se pudo identificar al usuario.");

      // Calculamos las fechas para el envío antes de armar el payload
      const hoy = new Date();
      const fechaDespacho = hoy.toISOString().split("T")[0];
      const fechaRec = new Date();
      fechaRec.setDate(hoy.getDate() + 3);
      const fechaRecepcion = fechaRec.toISOString().split("T")[0];

      // --- UNIFICAMOS TODO EN UN SOLO JSON ---
      const ventaPayload = {
        usuario: { idUsuario: idUsuarioActual },
        listaVentaDetalle: cartItems.map(item => ({
          cantidad: item.cantidad,
          producto: { idProducto: item.idProducto }
        })),
        // Agregamos el pago (Con el monto y método seleccionados)
        pago: {
          montoPago: total,
          fechaPago: fechaDespacho,
          metodoPago: { idMetodoPago: parseInt(metodoPago) }
        },
        // Agregamos el envío (Con el estado inicial, las fechas y el domicilio)
        envio: {
          estado: "Pendiente",
          fechaDespacho: fechaDespacho,
          fechaRecepcion: fechaRecepcion,
          usuario: { idUsuario: idUsuarioActual },
          domicilio: { idDomicilio: parseInt(direccionSeleccionada) }
        }
      };

      // Enviamos TODO en una sola transacción a tu VentaController
      const response = await fetch("http://localhost:8080/ventas/crear", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(ventaPayload)
      });

      if (!response.ok) {
        const msgError = await response.text();
        throw new Error(msgError || "Error en el servidor al procesar la venta.");
      }

      alert("¡Compra realizada con éxito con Pago y Envío vinculados!");
      if (clearCart) clearCart();
      navigate("/MisPedidos");

    } catch (error) {
      console.error("Error en la secuencia de transacciones:", error);
      alert(error.message || "No se pudo procesar la compra.");
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/tienda");

    }

    const cargarDatos = async () => {
      try {
        const email = localStorage.getItem("userEmail");
        const [resDom, resPagos] = await Promise.all([
          listarDomicilios(email),
          listarMetodosPagos(),
        ]);

        setDireccionesGuardadas(resDom.data);
        setMetodosPagoBD(resPagos.data);

        if (resDom.data.length > 0) {
          setDireccionSeleccionada(String(resDom.data[0].idDomicilio));
        }
        if (resPagos.data.length > 0) {
          setMetodoPago(String(resPagos.data[0].idMetodoPago));
        }
      } catch (error) {
        console.error("Error cargando datos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [cartItems.length, navigate]);

  if (loading) return <div className="loading">Cargando...</div>;

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>

      <form className="checkout-layout" onSubmit={handleConfirmarPago}>
        <div className="checkout-formularios">
          <div className="checkout-seccion">
            <h2><span className="checkout-numero-paso">1</span> Entrega</h2>
            <div className="opcion-radio-group">
              {direccionesGuardadas.map((dir) => (
                <label key={dir.idDomicilio} className={`opcion-radio ${direccionSeleccionada === String(dir.idDomicilio) ? "seleccionada" : ""}`}>
                  <input
                    type="radio"
                    name="direccion"
                    value={dir.idDomicilio}
                    checked={direccionSeleccionada === String(dir.idDomicilio)}
                    onChange={(e) => setDireccionSeleccionada(e.target.value)}
                  />
                  <div className="opcion-info">
                    <h4>{dir.calle} {dir.altura}</h4>
                    <p>{dir.localidad?.nombre || "Dirección guardada"}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="checkout-seccion">
            <h2><span className="checkout-numero-paso">2</span> Pago</h2>
            <div className="opcion-radio-group">
              {metodosPagoBD.map((pago) => (
                <label key={pago.idMetodoPago} className={`opcion-radio ${metodoPago === String(pago.idMetodoPago) ? "seleccionada" : ""}`}>
                  <input
                    type="radio"
                    name="pago"
                    value={pago.idMetodoPago}
                    checked={metodoPago === String(pago.idMetodoPago)}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <div className="opcion-info">
                    <h4>{pago.descripcion}</h4>
                    <p>{pago.idMetodoPago === 1 ? "5% OFF" : "Cuotas disponibles"}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="carrito-resumen">
          <h3>Tu pedido</h3>
          <div className="resumen-items-container">
            {cartItems.map((item) => (
              <div key={item.idProducto} className="resumen-item-flex">
                <span>{item.cantidad}x {item.descripcion}</span>
                <span>${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}</span>
              </div>
            ))}
          </div>
          <div className="resumen-linea">
            <span>Subtotal</span>
            <span>${subtotal.toLocaleString("es-AR")}</span>
          </div>
          <div className="resumen-linea">
            <span>Envío</span>
            <span>${costoEnvio.toLocaleString("es-AR")}</span>
          </div>
          <div className="resumen-total">
            <span>Total a pagar</span>
            <span className="total-highlight">${total.toLocaleString("es-AR")}</span>
          </div>
          <button type="submit" className="btn-blendy btn-enfasis btn-pill w-100" disabled={direccionesGuardadas.length === 0}>
            Confirmar y Pagar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;