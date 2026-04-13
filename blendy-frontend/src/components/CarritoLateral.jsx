import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/carrito.css';

const CarritoLateral = () => {
    const { isCartOpen, setIsCartOpen, cartItems, updateQuantity, removeFromCart, clearCart } = useCart();
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const cerrarCarrito = () => setIsCartOpen(false);

    return (
        <>
            <div className={`carrito-overlay ${isCartOpen ? 'visible' : ''}`} onClick={cerrarCarrito}></div>

            <div className={`carrito-lateral ${isCartOpen ? 'abierto' : ''}`}>
                <div className="carrito-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h2>Carrito ({cartItems.length})</h2>
                        
                        {/* Vaciar carrito */}
                        {cartItems.length > 0 && (
                            <button 
                                className="btn-vaciar-icono" 
                                onClick={() => {
                                    if(window.confirm("¿Vaciar todo el carrito?")) clearCart();
                                }}
                                title="Vaciar carrito"
                            >
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="3 6 5 6 21 6"></polyline>
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                                    <line x1="10" y1="11" x2="10" y2="17"></line>
                                    <line x1="14" y1="11" x2="14" y2="17"></line>
                                </svg>
                            </button>
                        )}
                    </div>
                    <button className="btn-cerrar-carrito" onClick={cerrarCarrito}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <div className="carrito-body">
                    {cartItems.length === 0 ? (
                        <div className="carrito-vacio">
                            <p>Tu carrito está vacío.</p>
                            <Link to="/tienda" onClick={cerrarCarrito}>Seguir navegando</Link>
                        </div>
                    ) : (
                        cartItems.map((item, index) => (
                            <div key={index} className="item-drawer">
                                <img src={item.img} alt={item.descripcion} />
                                <div className="item-drawer-info">
                                    <div>
                                        <h4>{item.descripcion}</h4>
                                        <p className="item-drawer-precio">${item.precioUnitario.toLocaleString('es-AR')}</p>
                                    </div>
                                    <div className="cantidad-control">
                                        <button onClick={() => updateQuantity(item.idProducto, -1)}>-</button>
                                        <span>{item.cantidad}</span>
                                        <button onClick={() => updateQuantity(item.idProducto, 1)}>+</button>
                                    </div>
                                    <button 
                                        onClick={() => removeFromCart(item.idProducto)}
                                        style={{background: 'none', border: 'none', color: '#ff6b6b', fontSize: '0.8rem', textAlign: 'left', cursor: 'pointer', padding: 0, marginTop: '5px'}}
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cartItems.length > 0 && (
                    <div className="carrito-footer">
                        <div className="carrito-subtotal">
                            <span>Subtotal</span>
                            <span>${subtotal.toLocaleString('es-AR')}</span>
                        </div>
                        <Link to="/carrito" className="btn-blendy btn-enfasis btn-pill w-100" onClick={cerrarCarrito} style={{ display: 'block', textAlign: 'center', marginBottom: '10px' }}>
                            Ir a Pagar
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
};

export default CarritoLateral;