import { useState } from 'react';
import '../styles/punto-venta.css';

const NuevaVentaLocal = () => {

    const [ticketItems, setTicketItems] = useState([]);
    const [busqueda, setBusqueda] = useState('');
    const [metodoPago, setMetodoPago] = useState("1");
    const [ventaFinalizada, setVentaFinalizada] = useState(null);

    const inventario = [
        { idProducto: 1, descripcion: "Vino Tinto Malbec Reserva", precioUnitario: 15500, stock: 24 },
        { idProducto: 2, descripcion: "Gin Artesanal Premium", precioUnitario: 22000, stock: 10 },
        { idProducto: 3, descripcion: "Agua Cítrica Menta", precioUnitario: 1600, stock: 50 },
        { idProducto: 10, descripcion: "Licor de Hierbas Italiano", precioUnitario: 75000, stock: 5 },
    ];

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
                return nueva > 0 ? { ...item, cantidad: nueva } : item;
            }
            return item;
        }));
    };

    const eliminarDelTicket = (id) => {
        setTicketItems(prev => prev.filter(item => item.idProducto !== id));
    };

    const registrarVenta = () => {
        if (ticketItems.length === 0) return alert("Agregue productos al ticket.");

        const nuevaVenta = {
            idVentaCabecera: Math.floor(Math.random() * 9000) + 1000,
            fecha: new Date().toLocaleDateString('es-AR'),
            totalVenta: totalVenta,
            idUsuario: localStorage.getItem('userId') || 1,
            idDomicilio: null, // Venta en sucursal
            metodoPagoDesc: metodoPago === "1" ? "Efectivo" : metodoPago === "2" ? "Débito" : "Crédito",
            detalles: [...ticketItems]
        };

        setVentaFinalizada(nuevaVenta);
    };

    const nuevaOperacion = () => {
        setTicketItems([]);
        setVentaFinalizada(null);
        setBusqueda('');
    };

    return (
        <div className="pos-page">
            
            {/* BUSCADOR E INVENTARIO */}
            <div className="pos-inventario">
                <div className="pos-header">
                    <h1>Venta Mostrador</h1>
                    <span className="badge-sucursal">Sucursal Capital</span>
                </div>
                
                <input 
                    type="text" 
                    className="pos-buscador" 
                    placeholder="Escriba nombre o ID del producto..." 
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    autoFocus
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
                                    <td>{prod.stock} un.</td>
                                    <td>${prod.precioUnitario.toLocaleString('es-AR')}</td>
                                    <td>
                                        <button className="btn-add-pos" onClick={() => agregarAlTicket(prod)}>
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
                        disabled={ticketItems.length === 0}
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
                            <p className="ticket-info-p">Nro. Transacción: #{ventaFinalizada.idVentaCabecera}</p>
                            <p className="ticket-info-p">Fecha: {ventaFinalizada.fecha}</p>
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