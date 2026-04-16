import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { listarDomicilios, listarMetodosPagos } from "../api/auth";
import "../styles/checkout.css";

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems } = useCart();

  const [direccionesGuardadas, setDireccionesGuardadas] = useState([]);
  const [metodosPagoBD, setMetodosPagoBD] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carga

  const [direccionSeleccionada, setDireccionSeleccionada] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [nuevaDireccion, setNuevaDireccion] = useState({
    calle: "",
    ciudad: "",
    cp: "",
  });

  useEffect(() => {
    // Redirigir si el carrito está vacío
    if (cartItems.length === 0) {
      navigate("/tienda");
      return;
    }

    const cargarDatos = async () => {
      try {
        const usuario = JSON.parse(localStorage.getItem("user"));
        const email = usuario?.correoElectronico;

        // Usamos Promise.allSettled en lugar de Promise.all
        // Esto permite que si uno falla (ej. domicilios), el otro siga adelante
        const resultados = await Promise.allSettled([
          listarDomicilios(email),
          listarMetodosPagos(),
        ]);

        // Procesar Domicilios
        if (resultados[0].status === "fulfilled") {
          const resDom = resultados[0].value;
          setDireccionesGuardadas(resDom.data);
          if (resDom.data.length > 0) {
            setDireccionSeleccionada(String(resDom.data[0].idDomicilio));
          }
        } else {
          // Aquí cae si el backend tiró el error 404
          console.warn(
            "Aviso:",
            resultados[0].reason.response?.data || "Sin domicilios"
          );
          setDireccionesGuardadas([]);
          setDireccionSeleccionada("nueva"); // Marcamos nueva por defecto
        }

        // Procesar Métodos de Pago
        if (resultados[1].status === "fulfilled") {
          const resPagos = resultados[1].value;
          setMetodosPagoBD(resPagos.data);
          if (resPagos.data.length > 0) {
            setMetodoPago(String(resPagos.data[0].idMetodoPago));
          }
        }
      } catch (error) {
        console.error("Error crítico en checkout:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [cartItems.length, navigate]);

  // Totales
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  );
  const total = subtotal + 2500;

  if (loading)
    return <div className="loading">Cargando opciones de pago y envío...</div>;

  return (
    <div className="checkout-page">
      <h1>Finalizar Compra</h1>

      <form className="checkout-layout" onSubmit={(e) => e.preventDefault()}>
        <div className="checkout-formularios">
          {/* SECCIÓN 1: DOMICILIOS */}
          <div className="checkout-seccion">
            <h2>
              <span className="checkout-numero-paso">1</span> Entrega
            </h2>
            <div className="opcion-radio-group">
              {direccionesGuardadas.length > 0 ? (
                direccionesGuardadas.map((dir) => (
                  <label
                    key={dir.idDomicilio}
                    className={`opcion-radio ${
                      direccionSeleccionada === String(dir.idDomicilio)
                        ? "seleccionada"
                        : ""
                    }`}
                  >
                    <input
                      type="radio"
                      name="direccion"
                      value={dir.idDomicilio}
                      checked={
                        direccionSeleccionada === String(dir.idDomicilio)
                      }
                      onChange={(e) => setDireccionSeleccionada(e.target.value)}
                    />
                    <div className="opcion-info">
                      {/* Vinculado a los atributos de tu tabla SQL y entidad Java */}
                      <h4>{dir.calle} {dir.altura}</h4>
                      <p>
                        {dir.localidad ? dir.localidad.descripcion : "Dirección guardada"}
                      </p>
                    </div>
                  </label>
                ))
              ) : (
                <p
                  style={{ color: "gray", fontSize: "0.9rem", padding: "10px" }}
                >
                  No tienes domicilios guardados.
                </p>
              )}

              <label
                className={`opcion-radio ${
                  direccionSeleccionada === "nueva" ? "seleccionada" : ""
                }`}
              >
                <input
                  type="radio"
                  name="direccion"
                  value="nueva"
                  checked={direccionSeleccionada === "nueva"}
                  onChange={(e) => setDireccionSeleccionada(e.target.value)}
                />
                <div className="opcion-info">
                  <h4>Enviar a otra dirección</h4>
                  <p>Ingresar nuevos datos de entrega</p>
                </div>
              </label>
            </div>
          </div>
          {/* SECCIÓN 2: MÉTODOS DE PAGO */}
          <div className="checkout-seccion">
            <h2>
              <span className="checkout-numero-paso">2</span> Pago
            </h2>
            <div className="opcion-radio-group">
              {metodosPagoBD.map((pago) => (
                <label
                  key={pago.idMetodoPago}
                  className={`opcion-radio ${
                    metodoPago === String(pago.idMetodoPago)
                      ? "seleccionada"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="pago"
                    value={pago.idMetodoPago}
                    checked={metodoPago === String(pago.idMetodoPago)}
                    onChange={(e) => setMetodoPago(e.target.value)}
                  />
                  <div className="opcion-info">
                    <h4>{pago.descripcion}</h4>
                    <p>
                      {pago.idMetodoPago === 1
                        ? "5% OFF"
                        : "Cuotas disponibles"}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* RESUMEN */}
        <div className="carrito-resumen">
          <h3>Tu pedido</h3>
          <div className="resumen-total">
            <span>Total</span>
            <span>${total.toLocaleString("es-AR")}</span>
          </div>
          <button
            className="btn-blendy btn-enfasis btn-pill w-100"
            style={{ marginTop: "20px" }}
          >
            Confirmar y Pagar
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;