import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [menuAbierto, setMenuAbierto] = useState(false);
    const navigate = useNavigate();

    // Leemos los datos que guardamos en el Login
    const token = localStorage.getItem('token');
    const rol = localStorage.getItem('userRole');

    const handleLogout = () => {
        localStorage.clear(); // Limpiamos token, rol y email
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
                <li><Link to="/tienda">Tienda</Link></li>
                <li><Link to="/categorias">Categorías</Link></li>
            </ul>

            <div className="navbar-actions">
                
                {/* LÓGICA DINÁMICA PARA EL ICONO DE USUARIO */}
                {!token ? (
                    // Si no está logueado, es un link normal al login
                    <Link to="/login" className="navbar-icon" title="Iniciar Sesión">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </Link>
                ) : (
                    // Si está logueado, mostramos el menú desplegable
                    <div className="perfil-menu-container" style={{ position: 'relative' }}>
                        <button 
                            className="navbar-icon" 
                            onClick={() => setMenuAbierto(!menuAbierto)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit' }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                <circle cx="12" cy="7" r="4"></circle>
                            </svg>
                        </button>

                        {menuAbierto && (
                            <div className="dropdown-blendy">
                                <Link to="/perfil" onClick={() => setMenuAbierto(false)}>Mis Datos</Link>
                                
                                {/* Si el rol es 1 (Admin), mostramos el panel de staff */}
                                {rol === "1" && (
                                    <Link to="/panel/productos" onClick={() => setMenuAbierto(false)}>
                                        Panel de Productos
                                    </Link>
                                )}

                                <div className="dropdown-divider"></div>
                                
                                <button onClick={handleLogout} className="btn-logout-nav">
                                    Cerrar Sesión
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* Carrito de Compras (Se mantiene igual) */}
                <Link to="/carrito" className="navbar-icon" title="Ver Carrito" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    <span style={{ color: 'var(--color-celeste)', fontSize: '0.9rem', fontWeight: 'bold' }}>
                        0
                    </span>
                </Link>
                
            </div>
        </nav>
    );
};

export default Navbar;