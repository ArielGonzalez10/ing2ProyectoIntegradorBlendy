import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/cierre.css';

const CierreCaja = () => {
    const navigate = useNavigate();
    const [ventasSucursal, setVentasSucursal] = useState([]);
    const [cargando, setCargando] = useState(true);

    // sistema captura el usuario activo y filtra las ventas del día
    useEffect(() => {
        const fetchCierreCaja = async () => {
            try {
                // sesión activa id_usuario
                const userRole = localStorage.getItem('userRole');
                const userEmail = localStorage.getItem('userEmail');

                if (!userRole) {
                    navigate('/login');
                    return;
                }

                // await getCierreDiario(userEmail)
                const mockDataBackend = [
                    { idVentaCabecera: 2001, hora: "09:30", total: 12500, metodo: "Efectivo" },
                    { idVentaCabecera: 2002, hora: "11:15", total: 45000, metodo: "Tarjeta Debito" },
                    { idVentaCabecera: 2003, hora: "15:40", total: 8900, metodo: "Efectivo" },
                    { idVentaCabecera: 2004, hora: "18:20", total: 15000, metodo: "Transferencia" },
                ];

                setVentasSucursal(mockDataBackend);
            } catch (error) {
                console.error("Error al obtener datos de caja:", error);
            } finally {
                setCargando(false);
            }
        };

        fetchCierreCaja();
    }, [navigate]);

    // separa el dinero en grupos (Efectivo vs Digitales)
    const totalesPorMetodo = ventasSucursal.reduce((acc, curr) => {
        acc[curr.metodo] = (acc[curr.metodo] || 0) + curr.total;
        return acc;
    }, {});

    const totalEfectivo = totalesPorMetodo["Efectivo"] || 0;
    const totalDigitales = ventasSucursal
        .filter(v => v.metodo !== "Efectivo")
        .reduce((acc, curr) => acc + curr.total, 0);

    const totalGeneral = totalEfectivo + totalDigitales;

    // impresión como respaldo físico
    const handleImprimirTicket = () => {
        window.print();
    };

    const handleConfirmarCierre = () => {
        if(window.confirm("¿Estás seguro de cerrar la caja? Esta acción notificará al Administrador y cerrará el turno actual.")) {
            // llamada POST para asentar el cierre en la BD
            handleImprimirTicket(); 
        }
    };

    if (cargando) return <div className="cierre-page">Cargando datos del turno...</div>;

    return (
        <div className="cierre-page">
            <div className="cierre-container" id="ticket-cierre">
                <div className="cierre-header"> 
                    <h1>Cierre de Caja Diario</h1>
                    <p>Usuario: <strong>{localStorage.getItem('userEmail')}</strong></p>
                    <p>Fecha: {new Date().toLocaleDateString('es-AR')}</p>
                </div>

                {/* resumen */}
                <div className="resumen-grid">
                    <div className="kpi-card">
                        <h4>Efectivo a Rendir</h4>
                        <span className="monto">${totalEfectivo.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="kpi-card">
                        <h4>Pagos Digitales</h4>
                        <span className="monto">${totalDigitales.toLocaleString('es-AR')}</span>
                        <div className="kpi-subdetalle">
                            {Object.entries(totalesPorMetodo).map(([metodo, monto]) => (
                                metodo !== "Efectivo" && <small key={metodo}>{metodo}: ${monto.toLocaleString('es-AR')}</small>
                            ))}
                        </div>
                    </div>
                    <div className="kpi-card kpi-total">
                        <h4>Total General</h4>
                        <span className="monto">${totalGeneral.toLocaleString('es-AR')}</span>
                    </div>
                </div>

                {/* transacciones */}
                <div className="cierre-seccion">
                    <h2>Detalle de Operaciones</h2>
                    <table className="tabla-cierre">
                        <thead>
                            <tr>
                                <th>Nº Comprobante</th>
                                <th>Hora</th>
                                <th>Método de Pago</th>
                                <th className="cierre-text-right">Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasSucursal.map((v) => (
                                <tr key={v.idVentaCabecera}>
                                    <td>#{v.idVentaCabecera}</td>
                                    <td>{v.hora}</td>
                                    <td><span className="cierre-metodo-tag">{v.metodo}</span></td>
                                    <td className="cierre-text-right cierre-fw-bold">${v.total.toLocaleString('es-AR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Botonera */}
                <div className="cierre-footer no-print">
                    <button 
                        className="cierre-btn-outline"
                        onClick={handleImprimirTicket}
                    >
                        Imprimir Reporte
                    </button>
                    <button 
                        className="cierre-btn-solid"
                        onClick={handleConfirmarCierre}
                    >
                        Finalizar Turno
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CierreCaja;