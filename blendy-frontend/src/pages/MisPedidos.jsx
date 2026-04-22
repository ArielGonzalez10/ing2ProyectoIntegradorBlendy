import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/pedidos.css';
import { listarVentaCabecera } from '../api/ventas'; 

const MisPedidos = () => {
    const navigate = useNavigate();
    
    // Leemos las claves individuales que vimos en tu LocalStorage
    const [userEmail] = useState(localStorage.getItem('userEmail'));
    const [userRole] = useState(localStorage.getItem('userRole'));

    const [busqueda, setBusqueda] = useState('');
    const [todasLasVentas, setTodasLasVentas] = useState([]);

    useEffect(() => {
        // Ahora usamos directamente userEmail que ya es un string
        if (userEmail) {
            console.log("Intentando listar ventas para:", userEmail);
            
            listarVentaCabecera(userEmail)
                .then(response => {
                    console.log("Respuesta del servidor:", response.data);
                    
                    const datosMapeados = response.data.map(venta => ({
                        idVentaCabecera: venta.idVentaCabecera,
                        fecha: venta.fecha,
                        totalVenta: venta.totalVenta,
                        estado: "En preparación", 
                        idUsuario: venta.usuario?.idUsuario,
                        clienteNombre: venta.usuario ? `${venta.usuario.nombre} ${venta.usuario.apellido || ''}` : "Cliente"
                    }));
                    setTodasLasVentas(datosMapeados);
                })
                .catch(err => {
                    console.error("Error al traer pedidos:", err);
                });
        } else {
            console.warn("No se encontró 'userEmail' en LocalStorage");
        }
    }, [userEmail]);

    // LÓGICA DE FILTRADO
    let ventasMostradas = todasLasVentas;

    if (busqueda) {
        ventasMostradas = ventasMostradas.filter(venta => 
            venta.idVentaCabecera.toString().includes(busqueda) || 
            (venta.clienteNombre && venta.clienteNombre.toLowerCase().includes(busqueda.toLowerCase()))
        );
    }

    const getBadgeClass = (estado) => {
        if (estado === 'Entregado') return 'badge-entregado';
        return 'badge-preparacion';
    };

    return (
        <div className="pedidos-page">
            <div className="pedidos-container">
                <div className="pedidos-header">
                    <div className="pedidos-title">
                        {/* Comparamos con "2" porque en LocalStorage suelen guardarse como strings */}
                        <h1>{userRole === "2" ? 'Mis Pedidos' : 'Historial de Ventas'}</h1>
                    </div>

                    <div className="pedidos-search">
                        <input 
                            type="text" 
                            placeholder="Buscar por pedido o nombre..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                        />
                    </div>
                </div>

                <div className="pedidos-lista">
                    {ventasMostradas.length > 0 ? (
                        ventasMostradas.map((venta) => (
                            <div key={venta.idVentaCabecera} className="pedido-card">
                                <div className="pedido-info-principal">
                                    <span className="pedido-id">Pedido #{venta.idVentaCabecera}</span>
                                    <span className="pedido-fecha">Realizado el {venta.fecha}</span>
                                    {userRole !== "2" && (
                                        <span className="pedido-cliente">Cliente: {venta.clienteNombre}</span>
                                    )}
                                    <span className="pedido-total">${venta.totalVenta.toLocaleString('es-AR')}</span>
                                </div>

                                <div className="pedido-acciones">
                                    <span className={`badge-pedido ${getBadgeClass(venta.estado)}`}>
                                        {venta.estado}
                                    </span>
                                    <button className="btn-blendy btn-secundario"
                                        onClick={() => navigate(`/confirmacion/${venta.idVentaCabecera}`)}>
                                        Ver detalles
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="pedidos-vacio">
                            <p>No tienes pedidos registrados con el mail: {userEmail}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MisPedidos;