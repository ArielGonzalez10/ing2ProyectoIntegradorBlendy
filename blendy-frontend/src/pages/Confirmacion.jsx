import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/confirmacion.css';

const Confirmacion = () => {
    const { id } = useParams(); // Obtenemos el ID de la URL
    const { clearCart } = useCart();
    const [orden, setOrden] = useState(null);

    useEffect(() => {
        clearCart();

        const pedidoEncontrado = {
            idPedido: id,
            cliente: "Fátima",
            email: "fatima@email.com",
            subtotal: 15500,
            envio: 2500,
            total: 18000,
            productos: [
                { id: 1, nombre: "Vino Tinto Malbec Reserva", cantidad: 1, precio: 15500, img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400&auto=format&fit=crop" }
            ],
            direccionEnvio: {
                nombre: "Fátima",
                calle: "San Martín 1234",
                ciudad: "Corrientes Capital",
                cp: "3400"
            }
        };
        setOrden(pedidoEncontrado);
    }, [id]);

    if (!orden) return <div className="confirmacion-page">Cargando detalles del pedido...</div>;

    return (
        <div className="confirmacion-page">
            <div className="confirmacion-container">
                <div className="confirmacion-header">
                    <h1>Detalles del Pedido</h1>
                    <div className="pedido-numero">Orden #{orden.idPedido}</div>
                </div>

                <div className="confirmacion-card">
                    {orden.productos.map(prod => (
                        <div key={prod.id} className="confirmacion-item">
                            <img src={prod.img} alt={prod.nombre} />
                            <div className="confirmacion-item-info">
                                <div className="confirmacion-item-detalle">
                                    <h4>{prod.nombre}</h4>
                                    <p>Cantidad: {prod.cantidad}</p>
                                </div>
                                <div className="confirmacion-item-precio">
                                    <strong>${prod.precio.toLocaleString('es-AR')}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                    
                    <div className="confirmacion-totales">
                        <div className="total-linea"><span>Subtotal</span><span>${orden.subtotal.toLocaleString('es-AR')}</span></div>
                        <div className="total-linea"><span>Envío</span><span>${orden.envio.toLocaleString('es-AR')}</span></div>
                        <div className="total-final"><span>Total:</span><span style={{ color: 'var(--color-celeste)' }}>${orden.total.toLocaleString('es-AR')}</span></div>
                    </div>
                </div>

                <div className="confirmacion-card confirmacion-direcciones">
                    <div className="direccion-bloque">
                        <h3>Entrega en</h3>
                        <p>{orden.direccionEnvio.nombre}</p>
                        <p>{orden.direccionEnvio.calle}</p>
                        <p>{orden.direccionEnvio.ciudad}, CP {orden.direccionEnvio.cp}</p>
                    </div>
                    <div className="direccion-bloque" style={{textAlign: 'right'}}>
                        <Link to="/pedidos" className="btn-blendy btn-secundario" style={{fontSize: '0.8rem'}}>
                            Volver a mis pedidos
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Confirmacion;