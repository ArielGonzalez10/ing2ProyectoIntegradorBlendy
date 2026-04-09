import { useState } from 'react';
import '../styles/cierre.css';

const CierreCaja = () => {
    const [ventasSucursal] = useState([
        { id: 2001, hora: "09:30", total: 12500, metodo: "Efectivo" },
        { id: 2002, hora: "11:15", total: 45000, metodo: "Tarjeta Debito" },
        { id: 2003, hora: "15:40", total: 8900, metodo: "Efectivo" },
        { id: 2004, hora: "18:20", total: 15000, metodo: "Transferencia" },
    ]);

    // CÁLCULO DE TOTALES
    const totalEfectivo = ventasSucursal
        .filter(v => v.metodo === "Efectivo")
        .reduce((acc, curr) => acc + curr.total, 0);

    const totalOtros = ventasSucursal
        .filter(v => v.metodo !== "Efectivo")
        .reduce((acc, curr) => acc + curr.total, 0);

    const totalGeneral = totalEfectivo + totalOtros;

    const handleConfirmarCierre = () => {
        if(window.confirm("¿Estás seguro de cerrar la caja? No podrás registrar más ventas hasta el próximo turno.")) {
            alert("Cierre de caja procesado con éxito.");
        }
    };

    return (
        <div className="cierre-page">
            <div className="cierre-container">
                <div className="perfil-header">
                    <h1>Cierre de Caja</h1>
                    <p>Resumen detallado de ventas realizadas exclusivamente en sucursal.</p>
                </div>

                {/* Dashboard de Totales */}
                <div className="resumen-grid">
                    <div className="kpi-card">
                        <h4>Efectivo en Caja</h4>
                        <span className="monto">${totalEfectivo.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="kpi-card">
                        <h4>Medios Digitales</h4>
                        <span className="monto">${totalOtros.toLocaleString('es-AR')}</span>
                    </div>
                    <div className="kpi-card" style={{ borderLeft: '4px solid var(--color-celeste)' }}>
                        <h4>Total General</h4>
                        <span className="monto">${totalGeneral.toLocaleString('es-AR')}</span>
                    </div>
                </div>

                {/* Detalle de Transacciones */}
                <div className="cierre-seccion">
                    <h2>Detalle del Turno</h2>
                    <table className="tabla-cierre">
                        <thead>
                            <tr>
                                <th>Ticket</th>
                                <th>Hora</th>
                                <th>Método de Pago</th>
                                <th>Monto</th>
                            </tr>
                        </thead>
                        <tbody>
                            {ventasSucursal.map((v) => (
                                <tr key={v.id}>
                                    <td>#{v.id}</td>
                                    <td>{v.hora}</td>
                                    <td><span className="metodo-pago-tag">{v.metodo}</span></td>
                                    <td style={{ fontWeight: 'bold' }}>${v.total.toLocaleString('es-AR')}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="cierre-footer">
                    <button 
                        className="btn-blendy btn-enfasis btn-pill"
                        onClick={handleConfirmarCierre}
                    >
                        Finalizar Turno y Cerrar Caja
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CierreCaja;