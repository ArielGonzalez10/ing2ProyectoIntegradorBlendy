import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/tienda.css';

const Tienda = () => {
    const navigate = useNavigate();

    // Simulador de usuario logueado (Cambialo a 1 para ver la vista de Admin)
    const user = { idRol: 2 }; 

    // Estados
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');
    const [orden, setOrden] = useState('recomendados');
    const [menuAbierto, setMenuAbierto] = useState(false); // <--- Controla el panel en celular

    const [productos] = useState([
        { idProducto: 1, descripcion: "Vino Tinto Malbec Reserva", precioUnitario: 15500, idCategoria: 1, categoria: "Vinos", estado: 1, img: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400&auto=format&fit=crop" },
        { idProducto: 2, descripcion: "Gin Artesanal Premium", precioUnitario: 22000, idCategoria: 2, categoria: "Licores", estado: 1, img: "https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=400&auto=format&fit=crop" },
        { idProducto: 3, descripcion: "Sake Premium Japonés", precioUnitario: 95000, idCategoria: 2, categoria: "Licores", estado: 0, img: "https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=400&auto=format&fit=crop" },
        { idProducto: 4, descripcion: "Agua Cítrica Menta", precioUnitario: 1600, idCategoria: 3, categoria: "Refrescos", estado: 1, img: "https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=400&auto=format&fit=crop" },
    ]);

    let productosMostrados = productos;

    if (categoriaActiva !== 'Todas') {
        productosMostrados = productosMostrados.filter(p => p.categoria === categoriaActiva);
    }

    if (orden === 'menor-precio') productosMostrados.sort((a, b) => a.precioUnitario - b.precioUnitario);
    else if (orden === 'mayor-precio') productosMostrados.sort((a, b) => b.precioUnitario - a.precioUnitario);

    const handleAccionBoton = () => {
        navigate('/login');
    };

    const handleCambiarEstado = (idProducto, estadoActual) => {
        alert(`Cambiar estado del producto ID: ${idProducto}`);
    };

    return (
        <div className="tienda-page">
            
            <div className="tienda-banner">
                <div className="breadcrumbs">
                    <Link to="/">Inicio</Link> <span>›</span> <span style={{ color: 'var(--color-texto)' }}>Todos los productos</span>
                </div>
                <h1>Catálogo Blendly</h1>
            </div>

            <div className="tienda-container">
                
                {/* BOTÓN MOBILE QUE ABRE EL MENÚ */}
                <button 
                    className="btn-blendy btn-mobile-filtros btn-pill"
                    onClick={() => setMenuAbierto(true)}
                >
                    Filtrar Productos
                </button>

                {/* OVERLAY FONDO OSCURO PARA CELULAREES */}
                <div 
                    className={`overlay-filtros ${menuAbierto ? 'visible' : ''}`} 
                    onClick={() => setMenuAbierto(false)}
                ></div>

                {/* BARRA LATERAL (Drawer dinámico) */}
                <aside className={`tienda-sidebar ${menuAbierto ? 'abierto' : ''}`}>
                    <div className="filtro-seccion">
                        <h3 className="filtro-titulo">Explorar por</h3>
                        <ul className="filtro-lista">
                            {['Todas', 'Vinos', 'Licores', 'Refrescos', 'Energéticas'].map(cat => (
                                <li 
                                    key={cat}
                                    className={`filtro-item ${categoriaActiva === cat ? 'activo' : ''}`} 
                                    onClick={() => {
                                        setCategoriaActiva(cat);
                                        setMenuAbierto(false); // Cierra menú al elegir en celular
                                    }}
                                >
                                    {cat === 'Todas' ? 'Todos los productos' : cat}
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>

                <main className="tienda-main">
                    <div className="tienda-top-bar">
                        <span className="tienda-resultados">{productosMostrados.length} productos</span>
                        <div>
                            <span style={{ color: 'var(--color-subtitulos)', fontSize: '0.9rem', marginRight: '10px' }}>Ordenar por:</span>
                            <select className="tienda-orden" value={orden} onChange={(e) => setOrden(e.target.value)}>
                                <option value="recomendados">Recomendados</option>
                                <option value="menor-precio">Menor Precio</option>
                                <option value="mayor-precio">Mayor Precio</option>
                            </select>
                        </div>
                    </div>

                    <div className="tienda-grid">
                        {productosMostrados.map((prod) => (
                            <div key={prod.idProducto} className="tienda-producto-card">
                                <div className="img-container">
                                    <img src={prod.img} alt={prod.descripcion} className="tienda-producto-img" />
                                </div>
                                <div className="tienda-producto-info">
                                    <h3>{prod.descripcion}</h3>
                                    <p className="tienda-producto-precio">${prod.precioUnitario.toLocaleString('es-AR')}</p>
                                    
                                    {/* LÓGICA DE ROLES INTACTA */}
                                    {user?.idRol === 1 ? (
                                        <button 
                                            className={`btn-blendy btn-pill w-100 ${prod.estado === 1 ? 'btn-baja' : 'btn-alta'}`}
                                            onClick={() => handleCambiarEstado(prod.idProducto, prod.estado)}
                                        >
                                            {prod.estado === 1 ? 'Dar de Baja' : 'Dar de Alta'}
                                        </button>
                                    ) : (
                                        <button 
                                            className="btn-blendy btn-secundario btn-pill w-100"
                                            onClick={handleAccionBoton}
                                        >
                                            Añadir al carrito
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </div>
    );
};

export default Tienda;