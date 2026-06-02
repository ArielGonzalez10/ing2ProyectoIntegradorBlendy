import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { listarDomicilios } from "../api/domicilios";
import { listarMetodosPagos } from "../api/pagos";
import { crearVenta } from "../api/ventas"; // 👈 Único servicio unificado de ventas
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

      const hoy = new Date();
      const fechaDespacho = hoy.toISOString().split("T")[0];
      const fechaRec = new Date();
      fechaRec.setDate(hoy.getDate() + 3);
      const fechaRecepcion = fechaRec.toISOString().split("T")[0];

      // Mapeamos los items del carrito convirtiendo la cantidad elegida al campo 'stock' que espera Java
      const productosTransient = cartItems.map((item) => ({
        idProducto: item.idProducto,
        stock: item.cantidad // Tu método modificarStock() lo leerá como cantidad pedida
      }));

      // Estructuramos el Payload idéntico al objeto Venta de tu Backend
      const ventaPayload = {
        fecha: hoy.toISOString(), // LocalDateTime espera formato ISO
        usuario: { 
          idUsuario: idUsuarioActual 
        },
        envio: {
          estado: "Pendiente",
          fechaDespacho: fechaDespacho,
          fechaRecepcion: fechaRecepcion
        },
        pago: {
          idMetodoPago: parseInt(metodoPago)
          // El monto total y la fecha del pago los calcula automáticamente registrarTotalVenta por seguridad
        },
        productos: productosTransient // Lista @Transient que recibe tu método procesarDetalleVenta()
      };

      // Enviamos toda la transacción unificada en un solo viaje HTTP
      await crearVenta(ventaPayload);

      alert("¡Compra realizada con éxito! El pedido, pago y envío fueron procesados.");
      if (clearCart) clearCart();
      navigate("/MisPedidos");

    } catch (error) {
      console.error("Error al procesar la venta unificada:", error);
      // Captura excepciones de negocio del backend (ej: "Stock insuficiente para...")
      alert(error.response?.data || error.message || "No se pudo procesar la compra.");
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

        const promesas = await Promise.allSettled([
          listarDomicilios(email),
          listarMetodosPagos(),
        ]);

        let dominiosObtenidos = [];
        if (promesas[0].status === "fulfilled") {
          dominiosObtenidos = promesas[0].value.data || [];
        } else {
          if (promesas[0].reason.response?.status !== 404) {
            console.error("Error crítico de domicilios:", promesas[0].reason);
          }
        }

        let pagosObtenidos = [];
        if (promesas[1].status === "fulfilled") {
          pagosObtenidos = promesas[1].value.data || [];
        } else {
          console.error("Error cargando métodos de pago:", promesas[1].reason);
        }

        setDireccionesGuardadas(dominiosObtenidos);
        setMetodosPagoBD(pagosObtenidos);

        if (dominiosObtenidos.length > 0) {
          setDireccionSeleccionada(String(dominiosObtenidos[0].idDomicilio));
        }
        if (pagosObtenidos.length > 0) {
          setMetodoPago(String(pagosObtenidos[0].idMetodoPago));
        }

      } catch (error) {
        console.error("Error general en el checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [cartItems.length, navigate]);

  if (loading) return <div className="loading">Cargando datos del checkout...</div>;

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>

      <form className="checkout-layout" onSubmit={handleConfirmarPago}>
        <div className="checkout-formularios">
          {/* 1. SECCIÓN DE ENTREGA */}
          <div className="checkout-seccion">
            <h2>
              <span className="checkout-numero-paso">1</span> Entrega
            </h2>
            <div className="opcion-radio-group">
              {direccionesGuardadas.length === 0 ? (
                <div className="no-data-alert">
                  <p>No tienes direcciones guardadas en tu perfil.</p>
                  <button
                    type="button"
                    className="btn-blendy btn-secundario btn-pill"
                    onClick={() => navigate("/perfil")}
                  >
                    Agregar Dirección
                  </button>
                </div>
              ) : (
                direccionesGuardadas.map((dir) => (
                  <label
                    key={dir.idDomicilio}
                    className={`opcion-radio ${
                      direccionSeleccionada === String(dir.idDomicilio) ? "seleccionada" : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="direccion"
                      value={dir.idDomicilio}
                      checked={direccionSeleccionada === String(dir.idDomicilio)}
                      onChange={(e) => setDireccionSeleccionada(e.target.value)}
                    />
                    <div className="opcion-info">
                      <h4>
                        {dir.calle} {dir.altura}
                        {dir.piso ? `, Piso ${dir.piso}` : ""}
                        {dir.departamento ? `, Depto ${dir.departamento}` : ""}
                      </h4>
                      <p>
                        {dir.localidad || "Localidad"}, CP {dir.codigoPostal || "CP"}
                      </p>
                    </div>
                  </label>
                ))
              )}
            </div>
          </div>
          
          {/* 2. SECCIÓN DE PAGO */}
          <div className="checkout-seccion">
            <h2>
              <span className="checkout-numero-paso">2</span> Pago
            </h2>
            <div className="opcion-radio-group">
              {metodosPagoBD.length === 0 ? (
                <p className="no-data-text">
                  No se encontraron métodos de pago activos.
                </p>
              ) : (
                metodosPagoBD.map((descripcionPago, index) => {
                  const idSimulado = String(index + 1);

                  return (
                    <label
                      key={index}
                      className={`opcion-radio ${
                        metodoPago === idSimulado ? "seleccionada" : ""
                      }`}
                    >
                      <input
                        type="radio"
                        name="pago"
                        value={idSimulado}
                        checked={metodoPago === idSimulado}
                        onChange={(e) => setMetodoPago(e.target.value)}
                      />
                      <div className="opcion-info">
                        <h4>{descripcionPago}</h4>
                        <p>
                          {idSimulado === "1" ? "5% OFF" : "Cuotas disponibles"}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* RESUMEN DE COMPRA */}
        <div className="carrito-resumen">
          <h3>Tu pedido</h3>
          <div className="resumen-items-container">
            {cartItems.map((item) => (
              <div key={item.idProducto} className="resumen-item-flex">
                <span>
                  {item.cantidad}x {item.descripcion}
                </span>
                <span>
                  $
                  {(item.precioUnitario * item.cantidad).toLocaleString(
                    "es-AR"
                  )}
                </span>
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
          <div className="resumen-linea">
            <span>Total a pagar</span>
            <span className="total-highlight">
              ${total.toLocaleString("es-AR")}
            </span>
          </div>
          <button
            type="submit"
            className="btn-blendy btn-enfasis btn-pill w-100"
            disabled={direccionesGuardadas.length === 0}
          >
            Confirmar y Pagar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;