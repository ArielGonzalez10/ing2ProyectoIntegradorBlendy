import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/carrito.css';

const Carrito = () => {
    // Traemos los productos y las funciones directamente de la memoria global
    const { cartItems, updateQuantity, removeFromCart, clearCart } = useCart()

    // El cálculo del total
    const subtotal = cartItems.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const costoEnvio = 2500;
    const total = subtotal + costoEnvio;

    return (
        <div className="carrito-page">
            <h1>Mi carrito</h1>

            {cartItems.length === 0 ? (
                // VISTA VACÍA
                <div className="carrito-vacio" style={{ marginTop: '100px' }}>
                    <p style={{ fontSize: '1.5rem', color: 'var(--color-texto)' }}>El carrito está vacío</p>
                    <Link to="/tienda">Seguir navegando</Link>
                </div>
            ) : (
                <div className="carrito-layout">
                    
                    {/* PRODUCTOS */}
                    <div className="carrito-items-list">
                        {cartItems.map((item) => (
                            <div key={item.idProducto} className="item-drawer" style={{ alignItems: 'center' }}>
                                <img src={item.img} alt={item.descripcion} style={{ width: '100px', height: '120px' }} />
                                
                                <div className="item-drawer-info" style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.2rem', marginBottom: '10px' }}>{item.descripcion}</h3>
                                        <button className="btn-eliminar-item" onClick={() => removeFromCart(item.idProducto)}>
                                            Eliminar
                                        </button>
                                    </div>
                                    
                                    <div className="cantidad-control" style={{ marginRight: '30px' }}>
                                        <button onClick={() => updateQuantity(item.idProducto, -1)}>-</button>
                                        <span>{item.cantidad}</span>
                                        <button onClick={() => updateQuantity(item.idProducto, 1)}>+</button>
                                    </div>

                                    <div className="item-drawer-precio" style={{ fontSize: '1.2rem', minWidth: '100px', textAlign: 'right' }}>
                                        ${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {/* BOTÓN VACIAR CARRITO */}
                        <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: '20px' }}>
                            <button className="btn-vaciar-texto" onClick={() => {
                                    if(window.confirm("¿Seguro que quieres quitar todos los productos?")) clearCart();
                                }}
                            >
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>

                    {/* RESUMEN DE COMPRA */}
                    <div className="carrito-resumen">
                        <h3>Resumen del pedido</h3>
                        
                        <div className="resumen-linea">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString('es-AR')}</span>
                        </div>
                        <div className="resumen-linea">
                            <span>Envío estimado</span>
                            <span>${costoEnvio.toLocaleString('es-AR')}</span>
                        </div>
                        
                        <div className="resumen-total">
                            <span>Total</span>
                            <span style={{ color: 'var(--color-celeste)' }}>${total.toLocaleString('es-AR')}</span>
                        </div>

                        <Link to="/checkout" className="btn-blendy btn-enfasis btn-pill w-100" style={{ display: 'block', textAlign: 'center', marginTop: '30px' }}>
                            Iniciar Pago
                        </Link>
                    </div>

                </div>
            )}
        </div>
    );
};

export default Carrito;
