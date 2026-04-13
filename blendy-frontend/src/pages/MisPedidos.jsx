import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/pedidos.css';
import { useNavigate } from 'react-router-dom';

const MisPedidos = () => {
    const navigate = useNavigate();
    const [user] = useState({ idUsuario: 101, nombre: "Fátima", idRol:  2}); 
    const [busqueda, setBusqueda] = useState('');

    const [todasLasVentas] = useState([
        { idVentaCabecera: 1045, fecha: "2026-04-05", totalVenta: 15500, estado: "Entregado", idUsuario: 101, clienteNombre: "Fátima Pérez" },
        { idVentaCabecera: 1046, fecha: "2026-04-08", totalVenta: 22000, estado: "En preparación", idUsuario: 101, clienteNombre: "Fátima Pérez" },
        { idVentaCabecera: 1047, fecha: "2026-04-09", totalVenta: 8900, estado: "Entregado", idUsuario: 205, clienteNombre: "Carlos Gómez" },
        { idVentaCabecera: 1048, fecha: "2026-04-09", totalVenta: 45000, estado: "Cancelado", idUsuario: 310, clienteNombre: "Ana Martínez" },
    ]);

    // LÓGICA DE FILTRADO POR ROL Y BÚSQUEDA
    let ventasMostradas = todasLasVentas;

    // filtrado por Rol
    if (user.idRol === 2) {
        // Si es CLIENTE, solo ve sus propias compras
        ventasMostradas = ventasMostradas.filter(venta => venta.idUsuario === user.idUsuario);
    } 
    // Si es Vendedor (3) o Admin (1), ve todas, no filtramos por ID.

    // Filtrado por Búsqueda (Tiempo Real)
    if (busqueda) {
        ventasMostradas = ventasMostradas.filter(venta => 
            venta.idVentaCabecera.toString().includes(busqueda) || 
            venta.clienteNombre.toLowerCase().includes(busqueda.toLowerCase())
        );
    }

    // Función auxiliar para los colores de las etiquetas
    const getBadgeClass = (estado) => {
        if (estado === 'Entregado') return 'badge-entregado';
        if (estado === 'En preparación') return 'badge-preparacion';
        if (estado === 'Cancelado') return 'badge-cancelado';
        return '';
    };

    return (
        <div className="pedidos-page">
            <div className="pedidos-container">
                
                {/* ENCABEZADO DINÁMICO */}
                <div className="pedidos-header">
                    <div className="pedidos-title">
                        <h1>{user.idRol === 2 ? 'Mis Pedidos' : 'Historial de Ventas'}</h1>
                        <p>
                            {user.idRol === 2 
                                ? 'Revisa tu historial de compras o el estado de un pedido reciente.' 
                                : 'Panel de control de transacciones para vendedores de sucursal.'}
                        </p>
                    </div>

                    <div className="pedidos-search">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                        <input 
                            type="text" 
                            placeholder={user.idRol === 2 ? "Buscar por N° de pedido..." : "Buscar por N° o nombre del cliente..."}
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                {/* LISTA DE PEDIDOS / ESTADO VACÍO */}
                <div className="pedidos-lista">
                    {ventasMostradas.length > 0 ? (
                        ventasMostradas.map((venta) => (
                            <div key={venta.idVentaCabecera} className="pedido-card">
                                
                                <div className="pedido-info-principal">
                                    <span className="pedido-id">Pedido #{venta.idVentaCabecera}</span>
                                    <span className="pedido-fecha">Realizado el {venta.fecha}</span>
                                    {/* El Vendedor necesita ver de quién es el pedido */}
                                    {user.idRol !== 2 && (
                                        <span className="pedido-cliente">Cliente: {venta.clienteNombre}</span>
                                    )}
                                    <span className="pedido-total">${venta.totalVenta.toLocaleString('es-AR')}</span>
                                </div>

                                <div className="pedido-acciones">
                                    <span className={`badge-pedido ${getBadgeClass(venta.estado)}`}>
                                        {venta.estado}
                                    </span>
                                    <button className="btn-blendy btn-secundario" style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                                        onClick={() => navigate(`/confirmacion/${venta.idVentaCabecera}`)}>
                                        Ver detalles
                                    </button>
                                </div>

                            </div>
                        ))
                    ) : (
                        <div className="pedidos-vacio">
                            <p>
                                {user.idRol === 2 
                                    ? 'Todavía no has realizado ningún pedido.' 
                                    : `No se encontraron ventas que coincidan con "${busqueda}".`}
                            </p>
                            {user.idRol === 2 && (
                                <Link to="/tienda" className="btn-blendy btn-enfasis btn-pill">
                                    Comenzar a navegar
                                </Link>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default MisPedidos;