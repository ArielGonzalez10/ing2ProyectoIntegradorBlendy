import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/auditoria.css';
import '../styles/cierre.css';

const AuditoriaCajas = () => {
    const navigate = useNavigate();
    const [cierresGlobales, setCierresGlobales] = useState([]);
    const [cierreActivo, setCierreActivo] = useState(null);
    const [efectivoFisico, setEfectivoFisico] = useState('');

    useEffect(() => {
        const userRole = localStorage.getItem('userRole');
        if (userRole !== "1") {
            navigate('/');
            return;
        }

        // Se incorpora el atributo "hora" en el modelo de datos que envía el backend
        const mockCierres = [
            {
                idCierre: 105,
                fecha: "22/05/2026",
                hora: "22:15", // <-- Hora de finalización del turno
                vendedor: "vendedor1@blendly.com",
                efectivoSistema: 21400,
                digitales: 60000,
                estado: "Pendiente",
                transacciones: [
                    { id: 2001, hora: "09:30", metodo: "Efectivo", total: 12500 },
                    { id: 2003, hora: "15:40", metodo: "Efectivo", total: 8900 },
                    { id: 2002, hora: "11:15", metodo: "Tarjeta Debito", total: 45000 },
                    { id: 2004, hora: "18:20", metodo: "Transferencia", total: 15000 }
                ]
            },
            {
                idCierre: 104,
                fecha: "21/05/2026",
                hora: "14:00", // <-- Hora de finalización del turno
                vendedor: "vendedor2@blendly.com",
                efectivoSistema: 15000,
                digitales: 32000,
                estado: "Auditado",
                transacciones: []
            }
        ];
        setCierresGlobales(mockCierres);
    }, [navigate]);

    const handleAbrirAuditoria = (cierre) => {
        setCierreActivo(cierre);
        setEfectivoFisico('');
    };

    const handleCerrarModal = () => {
        setCierreActivo(null);
    };

    const handleConfirmarAuditoria = () => {
        alert(`Auditoría guardada. Diferencia de caja registrada: $${diferenciaCaja}`);
        
        const cierresActualizados = cierresGlobales.map(c => 
            c.idCierre === cierreActivo.idCierre ? { ...c, estado: "Auditado" } : c
        );
        setCierresGlobales(cierresActualizados);
        setCierreActivo(null);
    };

    const fisicoNum = parseFloat(efectivoFisico) || 0;
    const diferenciaCaja = cierreActivo ? (fisicoNum - cierreActivo.efectivoSistema) : 0;

    return (
        <div className="cierre-page">
            <div className="cierre-container">
                <div className="cierre-header">
                    <h1>Auditoría Global de Cajas</h1>
                    <p>Control y conciliación de turnos</p>
                </div>

                <div className="cierre-seccion">
                    <table className="tabla-cierre">
                        <thead>
                            <tr>
                                <th>Nº Cierre</th>
                                <th>Fecha</th>
                                <th>Hora</th> {/* <-- Nueva cabecera de columna */}
                                <th>Vendedor</th>
                                <th className="cierre-text-right">Total Sistema</th>
                                <th>Estado</th>
                                <th>Acción</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cierresGlobales.map((c) => (
                                <tr key={c.idCierre}>
                                    <td>#{c.idCierre}</td>
                                    <td>{c.fecha}</td>
                                    <td>{c.hora} hs</td> {/* <-- Renderizado de la hora del turno */}
                                    <td>{c.vendedor}</td>
                                    <td className="cierre-text-right cierre-fw-bold">
                                        ${(c.efectivoSistema + c.digitales).toLocaleString('es-AR')}
                                    </td>
                                    <td>
                                        <span className={c.estado === 'Auditado' ? 'cierre-badge-ok' : 'cierre-badge-warn'}>
                                            {c.estado}
                                        </span>
                                    </td>
                                    <td>
                                        <button 
                                            className="cierre-btn-outline" 
                                            style={{ padding: '6px 12px', fontSize: '0.8rem' }}
                                            onClick={() => handleAbrirAuditoria(c)}
                                        >
                                            Ver Detalle
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal de Auditoría */}
            {cierreActivo && (
                <div className="cierre-modal-overlay">
                    <div className="cierre-modal-content">
                        <h2>Auditando Turno #{cierreActivo.idCierre}</h2>
                        {/* Se agrega la visualización de la hora dentro de los metadatos del modal */}
                        <p>
                            Vendedor: <strong>{cierreActivo.vendedor}</strong> | 
                            Fecha: {cierreActivo.fecha} | 
                            Hora Cierre: <strong>{cierreActivo.hora} hs</strong>
                        </p>
                        
                        <div className="cierre-grid-auditoria">
                            <div className="cierre-auditoria-sis">
                                <h3>Reporte del Sistema</h3>
                                <p>Efectivo Fijo: <strong>${cierreActivo.efectivoSistema.toLocaleString('es-AR')}</strong></p>
                                <p>Pagos Digitales: <strong>${cierreActivo.digitales.toLocaleString('es-AR')}</strong></p>
                                
                                <div style={{ marginTop: '20px', maxHeight: '200px', overflowY: 'auto' }}>
                                    <table className="tabla-cierre" style={{ fontSize: '0.8rem' }}>
                                        <thead>
                                            <tr>
                                                <th>Ticket</th>
                                                <th>Método</th>
                                                <th className="cierre-text-right">Monto</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cierreActivo.transacciones.map(t => (
                                                <tr key={t.id}>
                                                    <td>#{t.id}</td>
                                                    <td>{t.metodo}</td>
                                                    <td className="cierre-text-right">${t.total.toLocaleString('es-AR')}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="cierre-auditoria-fisico">
                                <h3>Control Físico</h3>
                                <div className="cierre-form-group">
                                    <label>Dinero Físico Entregado ($):</label>
                                    <input 
                                        type="number" 
                                        className="cierre-input-auditoria"
                                        value={efectivoFisico}
                                        onChange={(e) => setEfectivoFisico(e.target.value)}
                                        placeholder="Ej: 21400"
                                    />
                                </div>
                                
                                <div className="cierre-resultado-diferencia">
                                    <span>Diferencia detectada:</span>
                                    <h2 style={{ color: diferenciaCaja < 0 ? '#cc0000' : diferenciaCaja > 0 ? '#006600' : '#000000' }}>
                                        ${diferenciaCaja.toLocaleString('es-AR')}
                                    </h2>
                                    {diferenciaCaja < 0 && <small>Faltante de caja.</small>}
                                    {diferenciaCaja > 0 && <small>Sobrante de caja.</small>}
                                    {diferenciaCaja === 0 && efectivoFisico !== '' && <small>Caja cuadrada perfectamente.</small>}
                                </div>
                            </div>
                        </div>

                        <div className="cierre-footer" style={{ marginTop: '30px' }}>
                            <button className="cierre-btn-outline" onClick={handleCerrarModal}>Cancelar</button>
                            <button 
                                className="cierre-btn-solid" 
                                onClick={handleConfirmarAuditoria}
                                disabled={cierreActivo.estado === 'Auditado'}
                            >
                                Confirmar Auditoría
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditoriaCajas;