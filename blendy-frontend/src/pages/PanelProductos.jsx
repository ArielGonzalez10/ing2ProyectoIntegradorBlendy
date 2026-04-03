import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/panel.css';

const PanelProductos = () => {
    // Simulacion
    const [productos, setProductos] = useState([
        { idProducto: 1, descripcion: "Vino Malbec Reserva Blendy", categoria: "Vinos", precioUnitario: 15500, stock: 42, estado: 1 },
        { idProducto: 2, descripcion: "Gin Artesanal Premium", categoria: "Licores", precioUnitario: 22000, stock: 15, estado: 1 },
        { idProducto: 3, descripcion: "Pack Cerveza IPA x6", categoria: "Cervezas", precioUnitario: 8900, stock: 120, estado: 1 },
        { idProducto: 4, descripcion: "Whisky Single Malt 12 años", categoria: "Licores", precioUnitario: 45700, stock: 7, estado: 0 }, // Inactivo por falta de stock temporal
        { idProducto: 5, descripcion: "Agua Tónica Premium", categoria: "Refrescos", precioUnitario: 2500, stock: 0, estado: 1 } // Sin stock pero activo en catálogo
    ]);

    const [busqueda, setBusqueda] = useState('');

    // Lógica para filtrar la tabla según lo que se escriba en el buscador
    const productosFiltrados = productos.filter(producto => 
        producto.descripcion.toLowerCase().includes(busqueda.toLowerCase()) ||
        producto.categoria.toLowerCase().includes(busqueda.toLowerCase())
    );

    // Funciones simuladas para los botones de acción
    const handleModificar = (id) => {
        alert(`Abriendo modal para modificar producto ID: ${id}`);
    };

    const handleToggleEstado = (id, estadoActual) => {
        const nuevoEstado = estadoActual === 1 ? 'Baja' : 'Alta';
        if(window.confirm(`¿Seguro que deseas dar de ${nuevoEstado} este producto?`)) {
            // api.put(`/productos/${id}/estado`)
            setProductos(productos.map(p => 
                p.idProducto === id ? { ...p, estado: p.estado === 1 ? 0 : 1 } : p
            ));
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-container">
                
                <div className="admin-header-row">
                    <div className="admin-title">
                        <h1>Gestión de Productos</h1>
                        <p>Administra el catálogo, precios y stock de tu botillería.</p>
                    </div>

                    <div className="admin-controls">
                        {/* Barra de Búsqueda */}
                        <div className="search-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"></circle>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                            </svg>
                            <input 
                                type="text" 
                                className="search-input" 
                                placeholder="Buscar producto o categoría..." 
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                            />
                        </div>
                        
                        <Link to="/panel/productos/nuevo" className="btn-blendy btn-enfasis btn-pill">
                            + Nuevo Producto
                        </Link>
                    </div>
                </div>

                <div className="table-responsive">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Producto</th>
                                <th>Categoría</th>
                                <th>Precio</th>
                                <th>Stock</th>
                                <th>Estado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {productosFiltrados.length > 0 ? (
                                productosFiltrados.map((prod) => (
                                    <tr key={prod.idProducto}>
                                        <td>#{prod.idProducto}</td>
                                        <td className="td-nombre">{prod.descripcion}</td>
                                        <td>{prod.categoria}</td>
                                        <td className="td-precio">${prod.precioUnitario.toLocaleString('es-AR')}</td>
                                        <td style={{ color: prod.stock === 0 ? '#dc3545' : 'inherit' }}>
                                            {prod.stock} un.
                                        </td>
                                        <td>
                                            <span className={`badge-estado ${prod.estado === 1 ? 'badge-activo' : 'badge-inactivo'}`}>
                                                {prod.estado === 1 ? 'Activo' : 'Inactivo'}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-buttons">
                                                {/* Modificar (Lápiz) */}
                                                <button 
                                                    className="btn-icon btn-edit" 
                                                    title="Modificar"
                                                    onClick={() => handleModificar(prod.idProducto)}
                                                >
                                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                </button>
                                                
                                                {/* Alta/Baja (Ojo / Ojo tachado) */}
                                                <button 
                                                    className="btn-icon btn-toggle" 
                                                    title={prod.estado === 1 ? "Dar de baja" : "Dar de alta"}
                                                    onClick={() => handleToggleEstado(prod.idProducto, prod.estado)}
                                                >
                                                    {prod.estado === 1 ? (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                                                    ) : (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                                                    )}
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px' }}>
                                        No se encontraron productos con "{busqueda}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
};

export default PanelProductos;