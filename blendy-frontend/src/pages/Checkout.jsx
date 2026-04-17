import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { listarDomicilios, listarMetodosPagos } from "../api/auth";
import { crearVentaCabecera, crearVentaDetalle, crearPagos, crearEnvios } from "../api/pagos"; 
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

    try {
      const email = localStorage.getItem("userEmail");
      const idUsuarioActual = direccionesGuardadas.length > 0 ? direccionesGuardadas[0]?.usuario?.idUsuario : null;

      // 1. Crear Venta Cabecera
      const datosCabecera = {
        fecha: new Date().toISOString().split('T')[0],
        totalVenta: total,
        usuario: idUsuarioActual ? { idUsuario: idUsuarioActual } : { correoElectronico: email }
      };

      const resCabecera = await crearVentaCabecera(datosCabecera);
      const idCabeceraGenerada = resCabecera.data.idVentaCabecera;

      if (!idCabeceraGenerada) throw new Error("Error al obtener ID de cabecera");

      // 2. Crear Venta Detalle
      for (const item of cartItems) {
        await crearVentaDetalle({
          cantidad: item.cantidad,
          total: item.precioUnitario * item.cantidad,
          producto: { idProducto: item.idProducto },
          ventaCabecera: { idVentaCabecera: idCabeceraGenerada }
        });
      }

      // 3. Crear Pago
      await crearPagos({
        montoPago: total,
        ventaCabecera: { idVentaCabecera: idCabeceraGenerada },
        metodoPago: { idMetodoPago: parseInt(metodoPago) }
      });

      // 4. Crear Envío
      await crearEnvios({
        fechaDespacho: null,
        fechaRecepcion: null,
        usuario: idUsuarioActual ? { idUsuario: idUsuarioActual } : { correoElectronico: email },
        domicilio: { idDomicilio: parseInt(direccionSeleccionada) }
      });

      alert("¡Compra realizada con éxito!");
      if (clearCart) clearCart();
      navigate("/MisPedidos");

    } catch (error) {
      console.error("Error en la transacción:", error);
      alert("No se pudo procesar la compra.");
    }
  };

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/tienda");
      return;
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
              {direccionesGuardadas.length > 0 ? (
                direccionesGuardadas.map((dir) => (
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
                ))
              ) : (
                <div className="perfil-form-group">
                  <p>No tienes direcciones guardadas.</p>
                  <button type="button" className="btn-blendy btn-pill" onClick={() => navigate("/perfil")}>
                    Agregar dirección en mi perfil
                  </button>
                </div>
              )}
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