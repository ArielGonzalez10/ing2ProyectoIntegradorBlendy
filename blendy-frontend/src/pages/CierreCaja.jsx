import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cerrarCaja } from "../api/caja"; 
import { listarVentas } from "../api/ventas"; 
import "../styles/cierre.css";

const CierreCaja = () => {
  const navigate = useNavigate();
  const [ventasSucursal, setVentasSucursal] = useState([]);
  const [montoDeclarado, setMontoDeclarado] = useState("");
  const [cargando, setCargando] = useState(true);

  const userEmail = localStorage.getItem("userEmail");

  // 1. SOLUCIÓN: Recuperamos el ID que NuevaVentaLocal guardó en el navegador
  const idCajaActual = localStorage.getItem("idCajaActual");

  useEffect(() => {
    const fetchCierreCaja = async () => {
      try {
        const userRole = localStorage.getItem("userRole");

        if (!userRole || !userEmail) {
          navigate("/login");
          return;
        }
        
        const soloFecha = new Date().toLocaleDateString("en-CA"); // YYYY-MM-DD

        const response = await listarVentas(userEmail, soloFecha);
        console.log("Ventas recibidas del Backend:", response.data);
        if (response.data) {
          setVentasSucursal(response.data.ventas || response.data);
        }
      } catch (error) {
        console.error("Error al obtener datos de caja:", error);
        alert("No se pudieron recuperar las ventas del turno.");
      } finally {
        setCargando(false);
      }
    };

    fetchCierreCaja();
  }, [navigate, userEmail]);

  
  const totalesPorMetodo = ventasSucursal.reduce((acc, curr) => {
    const idMetodo = curr.pago?.idMetodoPago || curr.pago?.fk_id_metodo_pago || curr.pago?.idPago;
    const metodoDesc = parseInt(idMetodo) === 1 ? "Efectivo" : "Digital";
    acc[metodoDesc] = (acc[metodoDesc] || 0) + curr.totalVenta;
    return acc;
  }, {});

  const totalEfectivo = totalesPorMetodo["Efectivo"] || 0;

  const totalDigitales = ventasSucursal
    .filter((v) => {
      const idMetodo = v.pago?.idMetodoPago || v.pago?.fk_id_metodo_pago || v.pago?.idPago;
      return parseInt(idMetodo) !== 1; // Todo lo que no sea 1 sumará como digital
    })
    .reduce((acc, curr) => acc + curr.totalVenta, 0);

  const totalGeneral = totalEfectivo + totalDigitales;

  const handleImprimirTicket = () => {
    window.print();
  };

  // 2. MODIFICADO: Ahora el handler valida y envía el idCajaActual correspondiente
  const handleConfirmarCierre = async () => {
    const declaradoNum = parseFloat(montoDeclarado);

    if (isNaN(declaradoNum) || declaradoNum < 0) {
      return alert("Por favor, ingrese el monto de dinero físico total que contó en la caja.");
    }

    // Validación de seguridad por si no hay ninguna caja abierta registrada
    if (!idCajaActual) {
      return alert("Error: No se detectó un ID de caja activa en el sistema. Asegúrese de haberla abierto en el mostrador.");
    }

    if (window.confirm(`¿Estás seguro de cerrar la caja N° ${idCajaActual}? Esta acción registrará el balance final y cerrará tu turno.`)) {
      try {
        // 3. SOLUCIÓN: Pasamos el idCajaActual como tercer parámetro a tu API de axios
        await cerrarCaja(userEmail, declaradoNum, idCajaActual);

        alert("¡Turno cerrado y asentado en la base de datos con éxito!");
        
        // 4. LIMPIEZA: Removemos el ID del localStorage para que no quede obsoleto para el próximo turno
        localStorage.removeItem("idCajaActual");

        handleImprimirTicket();
        navigate("/"); 
      } catch (error) {
        console.error("Error al impactar el cierre en el Backend:", error);
        alert("Hubo un error al procesar el cierre de caja: " + (error.response?.data?.message || error.response?.data || error.message));
      }
    }
  };

  if (cargando) return <div className="cierre-page">Cargando datos del turno...</div>;

  return (
    <div className="cierre-page">
      <div className="cierre-container" id="ticket-cierre">
        <div className="cierre-header">
          {/* Mostramos el N° de caja dinámicamente en el encabezado si existe */}
          <h1>Cierre de Caja Diario {idCajaActual ? `#${idCajaActual}` : ""}</h1>
          <p>Usuario: <strong>{userEmail}</strong></p>
          <p>Fecha: {new Date().toLocaleDateString("es-AR")}</p>
        </div>

        <div className="resumen-grid">
          <div className="kpi-card">
            <h4>Efectivo Sistema (Esperado)</h4>
            <span className="monto">${totalEfectivo.toLocaleString("es-AR")}</span>
          </div>
          <div className="kpi-card">
            <h4>Pagos Digitales</h4>
            <span className="monto">${totalDigitales.toLocaleString("es-AR")}</span>
          </div>
          <div className="kpi-card kpi-total">
            <h4>Total Facturado</h4>
            <span className="monto">${totalGeneral.toLocaleString("es-AR")}</span>
          </div>
        </div>

        <div className="cierre-seccion no-print" style={{ backgroundColor: "#f9f9f9", padding: "20px", borderRadius: "8px", margin: "20px 0", border: "1px solid #eee" }}>
          <h3>Arqueo Físico de Caja</h3>
          <label style={{ fontSize: "14px", color: "#555" }}>
            Contá la plata total del cajón (Fondo inicial + ventas en efectivo) e ingresala acá:
          </label>
          <div style={{ marginTop: "10px" }}>
            <span style={{ fontSize: "20px", marginRight: "5px", fontWeight: "bold" }}>$</span>
            <input
              type="number"
              style={{ padding: "8px", fontSize: "16px", width: "200px", borderRadius: "4px", border: "1px solid #ccc" }}
              placeholder="Ej: 15200"
              value={montoDeclarado}
              onChange={(e) => setMontoDeclarado(e.target.value)}
            />
          </div>
        </div>

        <div className="cierre-seccion">
          <h2>Detalle de Operaciones</h2>
          <table className="tabla-cierre">
            <thead>
              <tr>
                <th>Nº Comprobante</th>
                <th>Método de Pago</th>
                <th className="cierre-text-right">Monto</th>
              </tr>
            </thead>
            <tbody>
              {ventasSucursal.map((v) => {
                const idMetodo = v.pago?.idMetodoPago || v.pago?.fk_id_metodo_pago || v.pago?.idPago;
                return (
                  <tr key={v.idVenta}>
                    <td>#{v.idVenta}</td>
                    <td>
                      <span className="cierre-metodo-tag">
                        {parseInt(idMetodo) === 1 ? "Efectivo" : "Digital"}
                      </span>
                    </td>
                    <td className="cierre-text-right cierre-fw-bold">${v.totalVenta.toLocaleString("es-AR")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="cierre-footer no-print">
          <button className="cierre-btn-outline" onClick={handleImprimirTicket}>Imprimir Reporte</button>
          <button className="cierre-btn-solid" onClick={handleConfirmarCierre}>Finalizar Turno</button>
        </div>
      </div>
    </div>
  );
};

export default CierreCaja;