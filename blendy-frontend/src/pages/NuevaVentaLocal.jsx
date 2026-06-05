import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { listarProductos } from '../api/products.js'; 
import { verificarCajaActiva, abrirCaja } from '../api/caja.js'; 
import api from '../api/axios.js'; 
import '../styles/punto-venta.css';

const NuevaVentaLocal = () => {
  const navigate = useNavigate();
  const [inventario, setInventario] = useState([]);
  const [ticketItems, setTicketItems] = useState([]);
  const [busqueda, setBusqueda] = useState("");

  const [metodoPago, setMetodoPago] = useState("4");
  const [ventaFinalizada, setVentaFinalizada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [idCajaActual, setIdCajaActual] = useState(null);
  const [idCierreTurno, setIdCierreTurno] = useState(null);
  const [mostrarModalApertura, setMostrarModalApertura] = useState(false);
  const [montoInicial, setMontoInicial] = useState("");

  const userEmail = localStorage.getItem("userEmail") || "fatimabret@gmail.com";

  useEffect(() => {
    const inicializarPuntoVenta = async () => {
      try {
        const resTurno = await verificarCajaActiva(userEmail);
        
        // 🔥 CORRECCIÓN: Evaluamos que la respuesta sea un ID de caja válido (mayor a 0)
        if (resTurno.status === 200 && resTurno.data > 0) {
          const idReal = resTurno.data; // El dato ya es el ID numérico directo
          setIdCajaActual(idReal);
          setIdCierreTurno("Activo");
          localStorage.setItem("idCajaActual", String(idReal)); 
          setMostrarModalApertura(false);
        } else {
          setMostrarModalApertura(true);
        }

        const response = await listarProductos();
        const datosProductos = response?.data ? response.data : response;

        if (Array.isArray(datosProductos)) {
          const activos = datosProductos.filter(
            (prod) => String(prod.estado).toLowerCase() === "activo"
          );
          setInventario(activos);
        }
      } catch (error) {
        console.error("Error al inicializar el mostrador:", error);
        setMostrarModalApertura(true);
      } finally {
        loading && setLoading(false);
      }
    };
    
    inicializarPuntoVenta();
  }, [userEmail]);

  const manejarAperturaCaja = async (e) => {
    e.preventDefault();
    const montoAEnviar = parseFloat(montoInicial);

    if (isNaN(montoAEnviar) || montoAEnviar < 0) {
      return alert("Por favor, ingrese un monto inicial válido (mayor o igual a 0).");
    }

    try {
      // 1. Mandamos a crear el turno físico a la BD
      await abrirCaja(userEmail, montoAEnviar); 
      
      // 2. Traemos el registro fresco que se acaba de crear para conocer su ID autonumérico
      const resTurno = await verificarCajaActiva(userEmail);
      
      // 🔥 CORRECCIÓN: Capturamos el ID numérico directo que devuelve la API tras abrir la caja
      if (resTurno.status === 200 && resTurno.data > 0) {
        const idReal = resTurno.data;
        setIdCajaActual(idReal);
        setIdCierreTurno("Activo");
        localStorage.setItem("idCajaActual", String(idReal));
        setMostrarModalApertura(false);
        alert(`¡Turno de caja iniciado exitosamente con $${montoAEnviar}!`);
      } else {
        throw new Error("El servidor creó la caja pero no devolvió un ID activo válido.");
      }

      // 3. Traemos el catálogo de productos actualizado
      const response = await listarProductos();
      const datosProductos = response?.data ? response.data : response;
      if (Array.isArray(datosProductos)) {
        setInventario(datosProductos.filter(p => String(p.estado).toLowerCase() === "activo"));
      }
    } catch (error) {
      console.error("Error en apertura de caja:", error);
      const msgError = error.response?.data?.message || error.response?.data || error.message || "Error al procesar la apertura.";
      alert(`No se pudo abrir la caja: ${msgError}`);
    }
  };

  const productosFiltrados = inventario.filter(
    (prod) =>
      prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
      prod.idProducto.toString().includes(busqueda)
  );

  const totalVenta = ticketItems.reduce(
    (acc, item) => acc + item.precioUnitario * item.cantidad,
    0
  );

  const agregarAlTicket = (producto) => {
    setTicketItems((prev) => {
      const existe = prev.find((item) => item.idProducto === producto.idProducto);
      if (existe) {
        if (existe.cantidad >= producto.stock) {
          alert(`Stock máximo alcanzado. Solo quedan ${producto.stock} unidades.`);
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

  const registrarVenta = async () => { 
    if (ticketItems.length === 0) return alert("Agregue productos al ticket.");
    if (!idCierreTurno) return alert("Operación retenida: Falta vincular un turno de caja activo.");

    const idCajaParaMapear = parseInt(localStorage.getItem("idCajaActual")) || idCajaActual;

    if (!idCajaParaMapear) {
      return alert("Error local: No se pudo verificar el número de caja para asociar a la venta.");
    }

    const userId = parseInt(localStorage.getItem("idUsuario")) || 1;

    const ventaPresencialPayload = {
      fecha: new Date().toISOString().split("T")[0],
      usuario: {
        idUsuario: userId,              
        correoElectronico: userEmail    
      }, 
      envio: null, 
      productos: ticketItems.map((item) => ({
        idProducto: item.idProducto,
        stock: item.cantidad 
      })),
      pago: {
        montoPago: parseFloat(totalVenta),
        fechaPago: new Date().toISOString().split("T")[0],
        idMetodoPago: parseInt(metodoPago),
      },
      caja: {
        idCaja: parseInt(idCajaParaMapear)
      }
    };

    try {
      const response = await api.post("/ventas/crear", ventaPresencialPayload); 
      const ventaGuardada = response.data;

      const metodosNombres = { "1": "Tarjeta de Débito", "2": "Tarjeta de Crédito", "3": "Transferencia / QR", "4": "Efectivo" };

      setVentaFinalizada({
        idVentaCabecera: ventaGuardada.idVenta,
        fecha: new Date().toLocaleString("es-AR"),
        totalVenta: ventaGuardada.totalVenta,
        metodoPagoDesc: metodosNombres[metodoPago] || "Otro",
        details: ticketItems,
      });

      alert("¡Venta en mostrador registrada y stock actualizado!");
    } catch (error) {
      console.error("Error al registrar la venta presencial:", error);
      const msgError = error.response?.data?.message || error.response?.data || "No se pudo completar la operación.";
      alert(`Error al guardar: ${typeof msgError === "object" ? JSON.stringify(msgError) : msgError}`);
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
        setInventario(datosProductos.filter(p => String(p.estado).toLowerCase() === "activo"));
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (loading) return <div className="loading-pos">Sincronizando inventario con el servidor...</div>;

  return (
    <div className="pos-page">
      {mostrarModalApertura && (
        <div className="modal-overlay" style={{ zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div className="comprobante-ticket" style={{ maxWidth: "400px", textAlign: "center", padding: "30px" }}>
            <div className="ticket-header">
              <h2>Apertura de Caja Obligatoria</h2>
              <p className="ticket-info-p" style={{ margin: "15px 0", color: "#bbb" }}>
                No tenés un turno de caja activo registrado para operar en este mostrador.
              </p>
            </div>
            <form onSubmit={manejarAperturaCaja} style={{ marginTop: "20px" }}>
              <p style={{ fontSize: "13px", color: "#999", marginBottom: "15px" }}>
                Ingrese el dinero en efectivo disponible en el cajón físico para dar vuelto:
              </p>
              <div style={{ marginBottom: "20px" }}>
                <input
                  type="number"
                  className="pos-buscador"
                  style={{ textAlign: "center", fontSize: "18px", padding: "10px" }}
                  placeholder="$ Monto inicial de caja"
                  value={montoInicial}
                  onChange={(e) => setMontoInicial(e.target.value)}
                  required
                  min="0"
                />
              </div>
              <button type="submit" className="btn-blendy btn-enfasis w-100 btn-cobrar">
                HABILITAR MI CAJA AHORA
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="pos-inventario">
        <div className="pos-header">
          <h1>Venta Mostrador</h1>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            {idCierreTurno && <span className="badge-sucursal" style={{ backgroundColor: "#2e7d32" }}>Caja: Abierta</span>}
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

      <div className="pos-ticket">
        <h2>Resumen de Venta</h2>
        <div className="ticket-items">
          {ticketItems.length === 0 ? (
            <div className="ticket-vacio">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
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
                  <p>${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}</p>
                </div>
                <div className="ticket-controles">
                  <button onClick={() => modificarCantidad(item.idProducto, -1)}>-</button>
                  <span className="ticket-cant">{item.cantidad}</span>
                  <button onClick={() => modificarCantidad(item.idProducto, 1)}>+</button>
                  <button style={{ backgroundColor: "#ff6b6b", marginLeft: "10px" }} onClick={() => eliminarDelTicket(item.idProducto)}>x</button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="pos-totales">
          <label className="label-pos">Método de Pago</label>
          <select
            className="pos-metodo-pago"
            value={metodoPago}
            onChange={(e) => setMetodoPago(e.target.value)}
            disabled={mostrarModalApertura}
          >
            <option value="1">Efectivo</option>
            <option value="2">Tarjeta de Débito</option>
            <option value="3">Tarjeta de Crédito</option>
            <option value="4">Transferencia</option>
          </select>

          <div className="pos-total-final">
            <span>Total:</span>
            <span className="monto-total">${totalVenta.toLocaleString("es-AR")}</span>
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

      {ventaFinalizada && (
        <div className="modal-overlay">
          <div className="comprobante-ticket">
            <div className="ticket-header">
              <h2>BLENDLY</h2>
              <p className="ticket-info-p">Venta Presencial - Sucursal 01</p>
              <p className="ticket-info-p">Nro. Transacción: #{ventaFinalizada.idVentaCabecera}</p>
              <p className="ticket-info-p">Fecha/Hora: {ventaFinalizada.fecha}</p>
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
                {ventaFinalizada.details && ventaFinalizada.details.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.cantidad}</td>
                    <td>{item.descripcion.substring(0, 20)}</td>
                    <td style={{ textAlign: "right" }}>${(item.precioUnitario * item.cantidad).toLocaleString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ticket-divisor"></div>
            <div className="ticket-total-row">
              <span>TOTAL COBRADO</span>
              <span>${ventaFinalizada.totalVenta.toLocaleString("es-AR")}</span>
            </div>
            <p className="ticket-info-p" style={{ marginTop: "10px" }}>Forma de pago: {ventaFinalizada.metodoPagoDesc}</p>
            <div className="ticket-footer-btns">
              <button className="btn-ticket-accion btn-imprimir" onClick={() => window.print()}>Imprimir Comprobante</button>
              <button className="btn-ticket-accion btn-nueva-venta" onClick={nuevaOperacion}>Iniciar Nueva Venta</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NuevaVentaLocal;