import React, { useState, useEffect } from 'react';
import { listarProductos } from '../api/products.js'; 
import { verificarCajaActiva, abrirCaja } from '../api/caja.js'; 

import api from '../api/axios.js'; 
import '../styles/punto-venta.css';

const NuevaVentaLocal = () => {
  // ESTADOS DE LA VISTA ORIGINALES
  const [inventario, setInventario] = useState([]);
  const [ticketItems, setTicketItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  // 🛠️ AJUSTE: El estado inicial arranca en "1" que equivale a Tarjeta de Débito en tu BD
  const [metodoPago, setMetodoPago] = useState("1");
  const [ventaFinalizada, setVentaFinalizada] = useState(null);
  const [loading, setLoading] = useState(true);

  // ESTADOS ADAPTADOS PARA TU FLUJO DE CAJA
  const [idCierreTurno, setIdCierreTurno] = useState(null);
  const [mostrarModalApertura, setMostrarModalApertura] = useState(false);
  const [montoInicial, setMontoInicial] = useState("");

  // 1. CARGAR PRODUCTOS Y VERIFICAR TURNO ACTIVO AL MONTAR EL COMPONENTE
  useEffect(() => {
    const inicializarPuntoVenta = async () => {
      const correoUsuario =
        localStorage.getItem("userEmail") || "fatimabret@gmail.com";

      try {
        // A) Verificamos si ya hay una caja activa usando Axios
        const resTurno = await verificarCajaActiva(correoUsuario);
        const cantidadActivas = resTurno.data;

        if (cantidadActivas > 0) {
          setIdCierreTurno("Activo");
          setMostrarModalApertura(false);
        } else {
          setMostrarModalApertura(true);
        }

        // B) Cargamos tus productos con Axios normalmente
        const response = await listarProductos();

        // Manejamos si viene la response completa o simplificada de Axios
        const datosProductos = response?.data ? response.data : response;

        if (Array.isArray(datosProductos)) {
          const activos = datosProductos.filter(
            (prod) =>
              prod.estado === "Activo" ||
              String(prod.estado).toLowerCase() === "activo"
          );
          setInventario(activos);
        }
      } catch (error) {
        console.error("Error al inicializar el mostrador con Axios:", error);
        setMostrarModalApertura(true);

        try {
          const response = await listarProductos();
          const datosProductos = response?.data ? response.data : response;

          if (Array.isArray(datosProductos)) {
            const activos = datosProductos.filter(
              (prod) =>
                prod.estado === "Activo" ||
                String(prod.estado).toLowerCase() === "activo"
            );
            setInventario(activos);
          }
        } catch (e) {
          console.error("Fallo definitivo de inventario:", e);
        }
      } finally {
        setLoading(false);
      }
    };
    inicializarPuntoVenta();
  }, []);

  const manejarAperturaCaja = async (e) => {
    e.preventDefault();

    // 1. Forzamos la lectura del estado actual del componente
    const montoAEnviar = parseFloat(montoInicial);

    // Validamos que sea un número válido y no un NaN u otra cosa
    if (isNaN(montoAEnviar) || montoAEnviar < 0) {
      return alert(
        "Por favor, ingrese un monto inicial válido (mayor o igual a 0)."
      );
    }

    const correoUsuario =
      localStorage.getItem("userEmail") || "fatimabret@gmail.com";

    try {
      // 2. Le pasamos el monto numérico limpio a la función del API
      await abrirCaja(correoUsuario, montoAEnviar);

      setMostrarModalApertura(false);
      setIdCierreTurno("Activo");
      alert(`¡Turno de caja iniciado exitosamente con $${montoAEnviar}!`);

      const response = await listarProductos();
      const datosProductos = response?.data ? response.data : response;

      if (Array.isArray(datosProductos)) {
        const activos = datosProductos.filter(
          (prod) =>
            prod.estado === "Activo" ||
            String(prod.estado).toLowerCase() === "activo"
        );
        setInventario(activos);
      }
    } catch (error) {
      console.error("Error en apertura de caja con Axios:", error);
      // Desestructuramos el error para no mostrar el horrible [object Object]
      const msgError =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        "Error al procesar la apertura.";
      alert(`No se pudo abrir la caja: ${msgError}`);
    }
  };

  // FILTRADO Y CÁLCULOS
  const productosFiltrados = inventario.filter(
    (prod) =>
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.idProducto.toString().includes(busqueda)
  );

  const totalVenta = ticketItems.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  );

  // FUNCIONES DE ACCIÓN
  const agregarAlTicket = (producto) => {
    setTicketItems((prev) => {
      const existe = prev.find(
        (item) => item.idProducto === producto.idProducto
      );
      if (existe) {
        if (existe.cantidad >= producto.stock) {
          alert(
            `Stock máximo alcanzado. Solo quedan ${producto.stock} unidades.`
          );
          return prev;
        }
        return prev.map((item) =>
          item.idProducto === producto.idProducto
            ? { ...item, cantidad: item.cantidad + 1 }
            : item
        );
      }
      return [...prev, { ...producto, cantidad: 1 }];
    });
  };

  const modificarCantidad = (id, delta) => {
    setTicketItems((prev) =>
      prev.map((item) => {
        if (item.idProducto === id) {
          const nueva = item.cantidad + delta;
          const prodInventario = inventario.find((p) => p.idProducto === id);
          if (delta > 0 && prodInventario && nueva > prodInventario.stock) {
            alert(`Stock físico máximo de ${prodInventario.stock} u.`);
            return item;
          }
          return nueva > 0 ? { ...item, cantidad: nueva } : item;
        }
        return item;
      })
    );
  };

  const eliminarDelTicket = (id) => {
    setTicketItems((prev) => prev.filter((item) => item.idProducto !== id));
  };

  // REGISTRAR VENTA REAL EN EL BACKEND CON AXIOS (REPARADO)
  const registrarVenta = async () => {
    if (ticketItems.length === 0) return alert("Agregue productos al ticket.");
    if (!idCierreTurno)
      return alert(
        "Operación retenida: Falta vincular un turno de caja activo."
      );

    const idUsuarioActual = localStorage.getItem("idUsuario");

    // 🛠️ REESTRUCTURACIÓN DE PAYLOAD EN NUEVAVENTALOCAL.JSX
    const ventaPresencialPayload = {
      usuario: { idUsuario: parseInt(idUsuarioActual) },
      envio: null, // Indicamos explícitamente que es mostrador (evita null pointers)

      // Cambiamos 'listaVentaDetalle' por 'productos' para que Spring Boot lo lea en p_venta.getProductos()
      productos: ticketItems.map((item) => ({
        idProducto: item.idProducto,
        stock: item.cantidad, // Mapeamos a 'stock' porque en tu java hacés: int cantidadPedida = producto.getStock();
      })),

      pago: {
        montoPago: parseFloat(totalVenta),
        fechaPago: new Date().toISOString().split("T")[0],
        idMetodoPago: parseInt(metodoPago),
      },
    };

    try {
      const response = await api.post("/ventas/crear", ventaPresencialPayload);
      const ventaGuardada = response.data;

      setVentaFinalizada({
        idVentaCabecera: ventaGuardada.idVenta,
        fecha: new Date(ventaGuardada.fecha).toLocaleString("es-AR"),
        totalVenta: ventaGuardada.totalVenta,
        // 🛠️ Mapeo correcto para las descripciones en el Ticket según tu base de datos
        metodoPagoDesc:
          metodoPago === "1"
            ? "Tarjeta de Débito"
            : metodoPago === "2"
            ? "Tarjeta de Crédito"
            : metodoPago === "3"
            ? "Transferencia"
            : metodoPago === "4"
            ? "Efectivo"
            :"otro",
        detalles: ticketItems,
      });

      alert("¡Venta en mostrador registrada y stock actualizado!");
    } catch (error) {
      console.error("Error al registrar la venta presencial con Axios:", error);
      // Captura de errores avanzada para evitar que se visualice [object Object] en los alerts
      const msgError =
        error.response?.data?.message ||
        error.response?.data ||
        "No se pudo completar la operación.";

      if (typeof msgError === "object") {
        alert(`Error en el Servidor: ${JSON.stringify(msgError)}`);
      } else {
        alert(`Error al guardar: ${msgError}`);
      }
    }
  };

  const nuevaOperacion = async () => {
    setTicketItems([]);
    setVentaFinalizada(null);
    setBusqueda("");
    try {
      const response = await listarProductos();
      const datosProductos = response?.data ? response.data : response;

      if (Array.isArray(datosProductos)) {
        const activos = datosProductos.filter(
          (prod) =>
            prod.estado === "Activo" ||
            String(prod.estado).toLowerCase() === "activo"
        );
        setInventario(activos);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading)
    return (
      <div className="loading-pos">
        Sincronizando inventario con el servidor...
      </div>
    );

  return (
    <div className="pos-page">
      {/* MODAL SIMPLIFICADO: APERTURA OBLIGATORIA SI EL CONTEO ES 0 */}
      {mostrarModalApertura && (
        <div
          className="modal-overlay"
          style={{
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="comprobante-ticket"
            style={{
              maxWidth: "400px",
              textAlign: "center",
              padding: "30px",
            }}
          >
            <div className="ticket-header">
              <h2>Apertura de Caja Obligatoria</h2>
              <p
                className="ticket-info-p"
                style={{ margin: "15px 0", color: "#bbb" }}
              >
                No tenés un turno de caja activo registrado para operar en este
                mostrador.
              </p>
            </div>

            <form onSubmit={manejarAperturaCaja} style={{ marginTop: "20px" }}>
              <p
                style={{
                  fontSize: "13px",
                  color: "#999",
                  marginBottom: "15px",
                }}
              >
                Ingrese el dinero en efectivo disponible en el cajón físico para
                dar vuelto:
              </p>

              {/* 👈 NUEVO: Input para el monto inicial */}
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="number"
                  className="pos-buscador" // Reutilizamos tu estilo de input para mantener estética
                  style={{
                    textAlign: "center",
                    fontSize: "18px",
                    padding: "10px",
                  }}
                  placeholder="$ Monto inicial de caja"
                  value={montoInicial}
                  onChange={(e) => setMontoInicial(e.target.value)}
                  required
                  min="0"
                />
              </div>

              <button
                type="submit"
                className="btn-blendy btn-enfasis w-100 btn-cobrar"
              >
                HABILITAR MI CAJA AHORA
              </button>
            </form>
          </div>
        </div>
      )}

      {/* BUSCADOR E INVENTARIO */}
      <div className="pos-inventario">
        <div className="pos-header">
          <h1>Venta Mostrador</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {idCierreTurno && (
              <span
                className="badge-sucursal"
                style={{ backgroundColor: "#2e7d32" }}
              >
                Caja: Abierta
              </span>
            )}
            <span className="badge-sucursal">Sucursal Capital</span>
          </div>
        </div>

        <input
          type="text"
          className="pos-buscador"
          placeholder="Escriba nombre o ID del producto..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          disabled={mostrarModalApertura}
        />

        <div className="pos-tabla-container">
          <table className="pos-tabla">
            <thead>
              <tr>
                <th>ID</th>
                <th>Descripción</th>
                <th>Stock</th>
                <th>Precio</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {productosFiltrados.map((prod) => (
                <tr key={prod.idProducto}>
                  <td>#{prod.idProducto}</td>
                  <td>{prod.descripcion}</td>
                  <td className={prod.stock <= 0 ? "sin-stock" : ""}>
                    {prod.stock <= 0 ? "Sin stock" : `${prod.stock} un.`}
                  </td>
                  <td>${prod.precioUnitario.toLocaleString("es-AR")}</td>
                  <td>
                    <button
                      className="btn-add-pos"
                      onClick={() => agregarAlTicket(prod)}
                      disabled={prod.stock <= 0 || mostrarModalApertura}
                    >
                      + Añadir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* TICKET DE COBRO */}
      <div className="pos-ticket">
        <h2>Resumen de Venta</h2>

        <div className="ticket-items">
          {ticketItems.length === 0 ? (
            <div className="ticket-vacio">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1"
              >
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <p>Esperando productos...</p>
            </div>
          ) : (
            ticketItems.map((item) => (
              <div key={item.idProducto} className="ticket-item">
                <div className="ticket-item-info">
                  <h4>{item.descripcion}</h4>
                  <p>
                    $
                    {(item.precioUnitario * item.cantidad).toLocaleString(
                      "es-AR"
                    )}
                  </p>
                </div>
                <div className="ticket-controles">
                  <button
                    onClick={() => modificarCantidad(item.idProducto, -1)}
                  >
                    -
                  </button>
                  <span className="ticket-cant">{item.cantidad}</span>
                  <button onClick={() => modificarCantidad(item.idProducto, 1)}>
                    +
                  </button>
                  <button
                    style={{ backgroundColor: "#ff6b6b", marginLeft: "10px" }}
                    onClick={() => eliminarDelTicket(item.idProducto)}
                  >
                    x
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pos-totales">
          <label className="label-pos">Método de Pago</label>
          {/* 🛠️ MODIFICACIÓN: IDs sincronizados fielmente con las claves primarias de tu base de datos */}
          <select
            className="pos-metodo-pago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            disabled={mostrarModalApertura}
          >
            <option value="1">Tarjeta de Débito</option>
            <option value="2">Tarjeta de Crédito</option>
            <option value="3">Transferencia / QR</option>
            <option value="4">Efectivo</option>
          </select>

          <div className="pos-total-final">
            <span>Total:</span>
            <span className="monto-total">
              ${totalVenta.toLocaleString("es-AR")}
            </span>
          </div>

          <button
            className="btn-blendy btn-enfasis w-100 btn-cobrar"
            disabled={ticketItems.length === 0 || mostrarModalApertura}
            onClick={registrarVenta}
          >
            REGISTRAR Y COBRAR
          </button>
        </div>
      </div>

      {/* MODAL DEL COMPROBANTE */}
      {ventaFinalizada && (
        <div className="modal-overlay">
          <div className="comprobante-ticket">
            <div className="ticket-header">
              <h2>BLENDLY</h2>
              <p className="ticket-info-p">Venta Presencial - Sucursal 01</p>
              <p className="ticket-info-p">
                Nro. Transacción: #{ventaFinalizada.idVentaCabecera}
              </p>
              <p className="ticket-info-p">
                Fecha/Hora: {ventaFinalizada.fecha}
              </p>
            </div>

            <table className="ticket-tabla">
              <thead>
                <tr>
                  <th>CANT</th>
                  <th>DETALLE</th>
                  <th style={{ textAlign: "right" }}>SUBT</th>
                </tr>
              </thead>
              <tbody>
                {ventaFinalizada.detalles.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.cantidad}</td>
                    <td>{item.descripcion.substring(0, 20)}</td>
                    <td style={{ textAlign: "right" }}>
                      $
                      {(item.precioUnitario * item.cantidad).toLocaleString(
                        "es-AR"
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="ticket-divisor"></div>

            <div className="ticket-total-row">
              <span>TOTAL COBRADO</span>
              <span>${ventaFinalizada.totalVenta.toLocaleString("es-AR")}</span>
            </div>

            <p className="ticket-info-p" style={{ marginTop: "10px" }}>
              Forma de pago: {ventaFinalizada.metodoPagoDesc}
            </p>

            <div className="ticket-footer-btns">
              <button
                className="btn-ticket-accion btn-imprimir"
                onClick={() => window.print()}
              >
                Imprimir Comprobante
              </button>
              <button
                className="btn-ticket-accion btn-nueva-venta"
                onClick={nuevaOperacion}
              >
                Iniciar Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevaVentaLocal;