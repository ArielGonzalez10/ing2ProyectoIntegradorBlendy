import { useState, useEffect } from 'react'; // Agregado useEffect
import { useNavigate, Link } from 'react-router-dom';
import '../styles/tienda.css';
import { useCart } from '../context/CartContext';
import { listarProductos } from '../api/products'; // Importamos tu servicio de productos

const Tienda = () => {
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const user = { idRol: 2 };

    // Estados
    const [productos, setProductos] = useState([]); // Ahora inicia vacío
    const [categoriaActiva, setCategoriaActiva] = useState('Todas');
    const [orden, setOrden] = useState('recomendados');
    const [menuAbierto, setMenuAbierto] = useState(false);

    // --- CARGA DE DATOS DESDE LA BD ---
    useEffect(() => {
        const cargarProductosTienda = async () => {
            try {
                const res = await listarProductos();
                if (res && res.data) {
                    // Seteamos los productos de la base de datos
                    setProductos(res.data);
                }
            } catch (error) {
                console.error("Error al cargar productos en la tienda:", error);
            }
        };
        cargarProductosTienda();
    }, []);

    const handleAccionBoton = (producto) => {
        if (user.idRol === 2 || user.idRol === 3) {
            addToCart(producto);
        } else {
            navigate('/login');
        }
    };

    // --- LÓGICA DE FILTRADO Y ORDEN ---
    // Clonamos el array para no mutar el estado original
    let productosMostrados = [...productos];

    if (categoriaActiva !== 'Todas') {
        // Filtramos por la descripción de la categoría que viene de la BD
        productosMostrados = productosMostrados.filter(p => p.categoria?.descripcion === categoriaActiva);
    }

    if (orden === 'menor-precio') {
        productosMostrados.sort((a, b) => a.precioUnitario - b.precioUnitario);
    } else if (orden === 'mayor-precio') {
        productosMostrados.sort((a, b) => b.precioUnitario - a.precioUnitario);
    }

    const handleCambiarEstado = (idProducto, estadoActual) => {
        alert(`Cambiar estado del producto ID: ${idProducto}`);
    };

    return (
      <div className="tienda-page">
        <div className="tienda-banner">
          <div className="breadcrumbs">
            <Link to="/">Inicio</Link> <span>›</span>{" "}
            <span style={{ color: "var(--color-texto)" }}>
              Todos los productos
            </span>
          </div>
          <h1>Catálogo Blendly</h1>
        </div>

        <div className="tienda-container">
          <button
            className="btn-blendy btn-mobile-filtros btn-pill"
            onClick={() => setMenuAbierto(true)}
          >
            Filtrar Productos
          </button>

          <div
            className={`overlay-filtros ${menuAbierto ? "visible" : ""}`}
            onClick={() => setMenuAbierto(false)}
          ></div>

          <aside className={`tienda-sidebar ${menuAbierto ? "abierto" : ""}`}>
            <div className="filtro-seccion">
              <h3 className="filtro-titulo">Explorar por</h3>
              <ul className="filtro-lista">
                {["Todas", "Vinos", "Licores", "Refrescos", "Energéticas"].map(
                  (cat) => (
                    <li
                      key={cat}
                      className={`filtro-item ${
                        categoriaActiva === cat ? "activo" : ""
                      }`}
                      onClick={() => {
                        setCategoriaActiva(cat);
                        setMenuAbierto(false);
                      }}
                    >
                      {cat === "Todas" ? "Todos los productos" : cat}
                    </li>
                  )
                )}
              </ul>
            </div>
          </aside>

          <main className="tienda-main">
            <div className="tienda-top-bar">
              <span className="tienda-resultados">
                {productosMostrados.length} productos
              </span>
              <div>
                <span
                  style={{
                    color: "var(--color-subtitulos)",
                    fontSize: "0.9rem",
                    marginRight: "10px",
                  }}
                >
                  Ordenar por:
                </span>
                <select
                  className="tienda-orden"
                  value={orden}
                  onChange={(e) => setOrden(e.target.value)}
                >
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
                    <img
                      src={
                        prod.imagenes && prod.imagenes.length > 0
                          ? `data:image/jpeg;base64,${prod.imagenes[0].descripcion}` // <-- AGREGAMOS EL PREFIJO AQUÍ
                          : "https://via.placeholder.com/400x400?text=Sin+Imagen"
                      }
                      alt={prod.descripcion}
                      className="tienda-producto-img"
                    />
                  </div>
                  <div className="tienda-producto-info">
                    <h3>{prod.descripcion}</h3>
                    <p className="tienda-producto-precio">
                      $
                      {prod.precioUnitario
                        ? prod.precioUnitario.toLocaleString("es-AR")
                        : "0"}
                    </p>

                    {user?.idRol === 1 ? (
                      <button
                        className={`btn-blendy btn-pill w-100 ${
                          prod.estado === 1 ? "btn-baja" : "btn-alta"
                        }`}
                        onClick={() =>
                          handleCambiarEstado(prod.idProducto, prod.estado)
                        }
                      >
                        {prod.estado === 1 ? "Dar de Baja" : "Dar de Alta"}
                      </button>
                    ) : (
                      <button
                        className="btn-blendy btn-secundario btn-pill w-100"
                        onClick={() => handleAccionBoton(prod)}
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