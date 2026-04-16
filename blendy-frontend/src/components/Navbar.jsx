import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Navbar = () => {
    const { cartItems, setIsCartOpen } = useCart();
    const totalItems = cartItems.reduce((acc, item) => acc + item.cantidad, 0);

    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    const token = localStorage.getItem('token'); 
    const rol = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.clear();
        setMenuAbierto(false);
        navigate('/login');
    };

    return (
        <nav className="navbar-blendy">
            <Link to="/" className="navbar-logo">
                <img src="/img/mapache01.png" alt="Logo Blendly" />
            </Link>

            <ul className="navbar-links mb-0 p-0">
                <li><Link to="/">Inicio</Link></li>
                {/* Ocultamos Tienda para el vendedor, mostramos Nueva Venta */}
                {rol !== "3" && <li><Link to="/tienda">Tienda</Link></li>}

                {rol === "3" && (
                    <li>
                        <Link to="/panel/nueva-venta" style={{ color: 'var(--color-celeste)', fontWeight: 'bold' }}>
                            Venta Mostrador
                        </Link>
                    </li>
                )}
                
                {/* Enlace destacado para roles de gestión */}
                {(rol === "1" || rol === "3") && (
                    <li>
                        <Link to="/panel/cierre-caja" className="nav-link-destacado">
                            Cierre de Caja
                        </Link>
                    </li>
                )}
            </ul>

            <div className="navbar-actions">
                {!token ? (
                    <Link to="/login" className="navbar-icon" title="Iniciar Sesión">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                    </Link>
                ) : (
                    <div className="perfil-menu-container">
                        <button className="navbar-icon btn-perfil-toggle" onClick={() => setMenuAbierto(!menuAbierto)}>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                        </button>

                        {menuAbierto && (
                            <div className="dropdown-blendy">
                                {/* SECCIÓN DE DATOS (Común a todos) */}
                                <Link to="/perfil" onClick={() => setMenuAbierto(false)}>Mis Datos</Link>

                                {/* LÓGICA POR ROL EN EL DROPDOWN */}
                                {rol === "1" && (
                                    <>
                                        <Link to="/panel/productos" onClick={() => setMenuAbierto(false)}>Gestión de Productos</Link>
                                        <Link to="/panel/cierre-caja" onClick={() => setMenuAbierto(false)}>Caja</Link>
                                    </>
                                )}

                                {rol === "2" && (
                                    <Link to="/pedidos" onClick={() => setMenuAbierto(false)}>Mis Pedidos</Link>
                                )}

                                {rol === "3" && (
                                    <>
                                        <Link to="/pedidos" onClick={() => setMenuAbierto(false)}>Historial de Pedidos</Link>
                                        <Link to="/panel/cierre-caja" onClick={() => setMenuAbierto(false)}>Cierre de Caja</Link>
                                    </>
                                )}

                                <div className="dropdown-divider"></div>
                                <button onClick={handleLogout} className="btn-logout-nav">Cerrar Sesión</button>
                            </div>
                        )}
                    </div>
                )}

                <button className="navbar-icon" onClick={() => setIsCartOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }} title="Ver Carrito">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
                    
                    {/* El número ahora es dinámico */}
                    <span className="cart-count">{totalItems}</span>
                </button>
            </div>
        </nav>
    );
};

export default Navbar;