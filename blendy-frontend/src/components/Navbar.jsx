import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        // Usamos la clase principal (Glassmorphism)
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
                
                {/* Iniciar Sesión / Perfil */}
                <Link to="/login" className="navbar-icon" title="Iniciar Sesión">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                </Link>

                {/* Carrito de Compras */}
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