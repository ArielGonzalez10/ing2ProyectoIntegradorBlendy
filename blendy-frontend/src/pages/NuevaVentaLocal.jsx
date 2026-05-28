import { useState, useEffect } from 'react';
import { listarProductos } from '../api/products.js'; // Importamos tu función de Axios
import '../styles/punto-venta.css';

const NuevaVentaLocal = () => {
    // ESTADOS DE LA VISTA ORIGINALES
    const [inventario, setInventario] = useState([]); 
    const [ticketItems, setTicketItems] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [metodoPago, setMetodoPago] = useState("1");
    const [ventaFinalizada, setVentaFinalizada] = useState(null);
    const [loading, setLoading] = useState(true);

    // 💡 NUEVOS ESTADOS PARA MANEJAR EL TURNO INTEGRADO
    const [idCierreTurno, setIdCierreTurno] = useState(null);
    const [mostrarModalApertura, setMostrarModalApertura] = useState(false);
    const [montoInicialInput, setMontoInicialInput] = useState("");

    // 1. CARGAR PRODUCTOS Y VERIFICAR TURNO ACTIVO AL MONTAR EL COMPONENTE
    useEffect(() => {
        const inicializarPuntoVenta = async () => {
            try {
                // A) Verificamos si ya hay un turno abierto global en el sistema
                const resTurno = await fetch("http://localhost:8080/cierre-turno/activo");
                if (resTurno.ok) {
                    const turnoActivo = await resTurno.json();
                    if (turnoActivo) {
                        // Si existe, nos anclamos a su id_cierre
                        setIdCierreTurno(turnoActivo.idCierre);
                    } else {
                        // Si viene null o vacío, abrimos el modal de forma obligatoria
                        setMostrarModalApertura(true);
                    }
                }

                // B) Cargamos tus productos con Axios normalmente
                const response = await listarProductos();
                if (response && response.data) {
                    setInventario(response.data.filter(prod => prod.estado === 1));
                }
            } catch (error) {
                console.error("Error al inicializar el mostrador:", error);
                alert("No se pudo sincronizar el punto de venta con el servidor.");
            } finally {
                setLoading(false);
            }
        };
        inicializarPuntoVenta();
    }, []);

    // 💡 ACCIÓN PARA REGISTRAR LA APERTURA DE CAJA
    const manejarAperturaCaja = async (e) => {
        e.preventDefault();
        const monto = parseFloat(montoInicialInput);
        if (isNaN(monto) || monto < 0) return alert("Por favor, ingrese un monto inicial válido.");

        try {
            const nuevoTurnoPayload = {
                montoInicial: monto,
                estado: 1 // 1 = Abierto
            };

            const response = await fetch("http://localhost:8080/cierre-turno/abrir", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoTurnoPayload)
            });

            if (!response.ok) throw new Error("No se pudo inicializar el turno en el servidor.");

            const turnoCreado = await response.json();
            setIdCierreTurno(turnoCreado.idCierre);
            setMostrarModalApertura(false); // Liberamos la pantalla
            alert(`¡Turno de caja iniciado exitosamente! ID Turno: #${turnoCreado.idCierre}`);

        } catch (error) {
            console.error("Error en apertura de caja:", error);
            alert(error.message);
        }
    };

    // FILTRADO Y CÁLCULOS
    const productosFiltrados = inventario.filter(prod => 
        prod.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        prod.idProducto.toString().includes(busqueda)
    );

    const totalVenta = ticketItems.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);

    // FUNCIONES DE ACCIÓN
    const agregarAlTicket = (producto) => {
        setTicketItems(prev => {
            const existe = prev.find(item => item.idProducto === producto.idProducto);
            if (existe) {
                if (existe.cantidad >= producto.stock) {
                    alert(`Stock máximo alcanzado. Solo quedan ${producto.stock} unidades fijas.`);
                    return prev;
                }
                return prev.map(item => 
                    item.idProducto === producto.idProducto 
                    ? { ...item, cantidad: item.cantidad + 1 } 
                    : item
                );
            }
            return [...prev, { ...producto, cantidad: 1 }];
        });
    };

    const modificarCantidad = (id, delta) => {
        setTicketItems(prev => prev.map(item => {
            if (item.idProducto === id) {
                const nueva = item.cantidad + delta;
                const prodInventario = inventario.find(p => p.idProducto === id);
                if (delta > 0 && prodInventario && nueva > prodInventario.stock) {
                    alert(`Acción retenida: Stock físico máximo de ${prodInventario.stock} u.`);
                    return item;
                }
                return nueva > 0 ? { ...item, cantidad: nueva } : item;
            }
            return item;
        }));
    };

    const eliminarDelTicket = (id) => {
        setTicketItems(prev => prev.filter(item => item.idProducto !== id));
    };

    // 2. REGISTRAR VENTA REAL EN EL BACKEND (ACTUALIZADO CON EL ID_CIERRE)
    const registrarVenta = async () => {
        if (ticketItems.length === 0) return alert("Agregue productos al ticket.");
        if (!idCierreTurno) return alert("Operación retenida: Falta vincular un turno de caja activo.");

        const idUsuarioActual = localStorage.getItem('userId') || 2; 

        const ventaPresencialPayload = {
            usuario: { idUsuario: parseInt(idUsuarioActual) },
            
            // 💡 AQUÍ INYECTAMOS EL ID DEL CIERRE_TURNO ACTIVO PARA TU RELACIÓN
            cierreTurno: { idCierre: parseInt(idCierreTurno) },
            
            listaVentaDetalle: ticketItems.map(item => ({
                cantidad: item.cantidad,
                producto: { idProducto: item.idProducto }
            })),
            pago: {
                montoPago: totalVenta,
                fechaPago: new Date().toISOString().split("T")[0], 
                metodoPago: { idMetodoPago: parseInt(metodoPago) }
            }
        };

        try {
            const response = await fetch("http://localhost:8080/ventas/crear", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ventaPresencialPayload)
            });

            if (!response.ok) {
                const msgError = await response.text();
                throw new Error(msgError || "Error en el servidor al procesar la venta.");
            }

            const ventaGuardada = await response.json();

            setVentaFinalizada({
                idVentaCabecera: ventaGuardada.idVenta,
                fecha: new Date(ventaGuardada.fecha).toLocaleString('es-AR'), 
                totalVenta: ventaGuardada.totalVenta,
                metodoPagoDesc: metodoPago === "1" ? "Efectivo" : metodoPago === "2" ? "Débito" : metodoPago === "3" ? "Crédito" : "Transferencia / QR",
                detalles: ticketItems
            });

            alert("¡Venta en mostrador registrada y stock actualizado!");

        } catch (error) {
            console.error("Error al registrar la venta presencial:", error);
            alert(error.message || "No se pudo completar la operación.");
        }
    };

    const nuevaOperacion = async () => {
        setTicketItems([]);
        setVentaFinalizada(null);
        setBusqueda('');
        try {
            const response = await listarProductos();
            if (response && response.data) {
                setInventario(response.data.filter(prod => prod.estado === 1));
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading) return <div className="loading-pos">Sincronizando inventario con el servidor...</div>;

    return (
        <div className="pos-page">
            
            {/* 💡 MODAL DE APERTURA DE CAJA AUTOMÁTICO (BLOQUEA LA INTERFAZ SI NO HAY TURNO) */}
            {mostrarModalAPERTURA && (
                <div className="modal-overlay" style={{ zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div className="comprobante-ticket" style={{ maxWidth: '400px', textAlign: 'center', padding: '30px' }}>
                        <div className="ticket-header">
                            <h2>Apertura de Caja</h2>
                            <p className="ticket-info-p" style={{ margin: '15px 0', color: '#bbb' }}>
                                No se encuentra ninguna caja habilitada actualmente. Por favor, inicialice el turno ingresando el dinero de apertura para dar cambio.
                            </p>
                        </div>
                        <form onSubmit={manejarAperturaCaja} style={{ marginTop: '20px' }}>
                            <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                                <label className="label-pos" style={{ marginBottom: '8px', display: 'block' }}>Monto Inicial ($)</label>
                                <input 
                                    type="number" 
                                    className="pos-buscador"
                                    style={{ margin: 0, padding: '10px' }}
                                    placeholder="Ej: 5000"
                                    value={montoInicialInput}
                                    onChange={(e) => setMontoInicialInput(e.target.value)}
                                    min="0"
                                    required
                                    autoFocus
                                />
                            </div>
                            <button type="submit" className="btn-blendy btn-enfasis w-100 btn-cobrar">
                                ENTRAR EN TURNO
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* BUSCADOR E INVENTARIO */}
            <div className="pos-inventario">
                <div className="pos-header">
                    <h1>Venta Mostrador</h1>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {idCierreTurno && <span className="badge-sucursal" style={{ backgroundColor: '#2e7d32' }}>Turno: #{idCierreTurno}</span>}
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
                            {productosFiltrados.map(prod => (
                                <tr key={prod.idProducto}>
                                    <td>#{prod.idProducto}</td>
                                    <td>{prod.descripcion}</td>
                                    <td className={prod.stock <= 0 ? "sin-stock" : ""}>
                                        {prod.stock <= 0 ? "Sin stock" : `${prod.stock} un.`}
                                    </td>
                                    <td>${prod.precioUnitario.toLocaleString('es-AR')}</td>
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
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                            <p>Esperando productos...</p>
                        </div>
                    ) : (
                        ticketItems.map(item => (
                            <div key={item.idProducto} className="ticket-item">
                                <div className="ticket-item-info">
                                    <h4>{item.descripcion}</h4>
                                    <p>${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}</p>
                                </div>
                                <div className="ticket-controles">
                                    <button onClick={() => modificarCantidad(item.idProducto, -1)}>-</button>
                                    <span className="ticket-cant">{item.cantidad}</span>
                                    <button onClick={() => modificarCantidad(item.idProducto, 1)}>+</button>
                                    <button style={{ backgroundColor: '#ff6b6b', marginLeft: '10px' }} onClick={() => eliminarDelTicket(item.idProducto)}>
                                        x
                                    </button>
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
                        <option value="1">Efectivo (Caja)</option>
                        <option value="2">Tarjeta Débito</option>
                        <option value="3">Tarjeta Crédito</option>
                        <option value="4">Transferencia / QR</option>
                    </select>

                    <div className="pos-total-final">
                        <span>Total:</span>
                        <span className="monto-total">${totalVenta.toLocaleString('es-AR')}</span>
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

            {/* MODAL DEL COMPROBANTE CON DATOS DEL BACKEND */}
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
                                    <th style={{ textAlign: 'right' }}>SUBT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ventaFinalizada.detalles.map((item, idx) => (
                                    <tr key={idx}>
                                        <td>{item.cantidad}</td>
                                        <td>{item.descripcion.substring(0, 20)}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            ${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="ticket-divisor"></div>
                        
                        <div className="ticket-total-row">
                            <span>TOTAL COBRADO</span>
                            <span>${ventaFinalizada.totalVenta.toLocaleString('es-AR')}</span>
                        </div>
                        
                        <p className="ticket-info-p" style={{ marginTop: '10px' }}>
                            Forma de pago: {ventaFinalizada.metodoPagoDesc}
                        </p>

                        <div className="ticket-footer-btns">
                            <button className="btn-ticket-accion btn-imprimir" onClick={() => window.print()}>
                                Imprimir Comprobante
                            </button>
                            <button className="btn-ticket-accion btn-nueva-venta" onClick={nuevaOperacion}>
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