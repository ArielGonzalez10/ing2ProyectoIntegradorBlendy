import { useState, useEffect, useRef } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Home = () => {
    const [productos, setProductos] = useState([]);
    const [cargando, setCargando] = useState(true);
    const scrollRef = useRef(null); 
    const [progreso, setProgreso] = useState(0);

    // Mover el carrusel
    const scroll = (direccion) => {
        const { current } = scrollRef;
        const scrollAmount = 350;
        if (direccion === 'izquierda') {
            current.scrollLeft -= scrollAmount;
        } else {
            current.scrollLeft += scrollAmount;
        }
    };

    // Calcular cuánto se ha desplazado 
    const manejarScroll = () => {
        if (!scrollRef.current) return;
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        const totalScrollable = scrollWidth - clientWidth;
        // Evitar dividir por cero si no hay scroll
        if (totalScrollable > 0) {
            const porcentaje = (scrollLeft / totalScrollable) * 100;
            setProgreso(porcentaje);
        }
    };

    // Traer productos del backend
    useEffect(() => {
        const obtenerProductos = async () => {
            try {
                const response = await api.get('/productos');
                setProductos(response.data);
                setCargando(false);
            } catch (error) {
                console.error("Error al traer productos:", error);
                setCargando(false);
            }
        };
        obtenerProductos();
    }, []);

    return (
        <div className="home-container">
            
            {/* HERO*/}
            <section className="home-hero">
                {/* Izquierda: Textos y Botones */}
                <div className="hero-content">
                    <span className="hero-subtitle">BIENVENIDOS A BLENDY</span>
                    <h1>Tu botillería,<br />unida y<br />simplificada</h1>
                    
                    <div className="hero-botones">
                        <Link to="/tienda" className="btn-blendy btn-primario btn-pill">
                            Ir a la Tienda
                        </Link>
                        <Link to="/gestion" className="btn-blendy btn-secundario btn-pill">
                            Ver Gestión
                        </Link>
                    </div>
                </div>

                {/* Derecha: Imagen */}
                <div className="hero-image-container">
                    <img 
                        src="https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=800&auto=format&fit=crop" 
                        alt="Estantería Blendy" 
                        className="hero-img" 
                    />
                </div>
            </section>

            {/* CATEGORÍAS */}
            <section className="categorias-section">
                <h2>Comprar por Categoría</h2>
                
                <div className="categorias-grid">
                    <div className="categoria-card">
                        {/* <span className="categoria-numero">[1]</span> */}
                        <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=400&auto=format&fit=crop" alt="Vinos" className="categoria-imagen" />
                        <h3 className="categoria-titulo">Vinos</h3>
                        <p className="categoria-descripcion">Explora nuestra selección de vinos de la mejor calidad, desde los más clásicos hasta las nuevas tendencias globales.</p>
                    </div>

                    <div className="categoria-card">
                        {/* <span className="categoria-numero">[2]</span> */}
                        <img src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=400&auto=format&fit=crop" alt="Licores" className="categoria-imagen" />
                        <h3 className="categoria-titulo">Licores</h3>
                        <p className="categoria-descripcion">Descubre una amplia variedad de destilados premium, desde whiskies de origen reconocido hasta destilados artesanales.</p>
                    </div>

                    <div className="categoria-card">
                        {/* <span className="categoria-numero">[3]</span> */}
                        <img src="https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=400&auto=format&fit=crop" alt="Refrescos" className="categoria-imagen" />
                        <h3 className="categoria-titulo">Refrescos</h3>
                        <p className="categoria-descripcion">Elige entre nuestras bebidas gaseosas de origen natural, refrescantes y sin aditivos, perfectas para cualquier ocasión.</p>
                    </div>

                    <div className="categoria-card">
                        {/* <span className="categoria-numero">[4]</span> */}
                        <img src="https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=400&auto=format&fit=crop" alt="Energéticas" className="categoria-imagen" />
                        <h3 className="categoria-titulo">Energéticas</h3>
                        <p className="categoria-descripcion">Optimiza tu rendimiento con nuestras bebidas energéticas formuladas para mantener tu enfoque durante todo el día.</p>
                    </div>
                </div>
            </section>

            {/* DESTACADAS Carrusel */}
            <section className="destacados-section">
                <div className="destacados-header">
                    <h2>Nuestras Selecciones<br />Destacadas</h2>
                    
                    {/* Botones de navegación */}
                    <div className="carousel-controls">
                        <button onClick={() => scroll('izquierda')} className="control-btn" aria-label="Anterior">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 18l-6-6 6-6"/></svg>
                        </button>
                        <button onClick={() => scroll('derecha')} className="control-btn" aria-label="Siguiente">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l6-6-6-6"/></svg>
                        </button>
                    </div>
                </div>
                
                {/* Contenedor del scroll */}
                <div className="carousel-container" ref={scrollRef} onScroll={manejarScroll}>
                    
                    <div className="destacado-card">
                        <div className="destacado-imagen-wrapper">
                            <img src="https://images.unsplash.com/photo-1569529465841-dfecdab7503b?q=80&w=300&auto=format&fit=crop" alt="Licor de Hierbas" className="destacado-imagen" />
                        </div>
                        <div className="destacado-info">
                            <h3>Licor de Hierbas Italiano</h3>
                            <p>$75.000</p>
                            <button className="btn-blendy btn-secundario btn-pill btn-sm">+ Comprar</button>
                        </div>
                    </div>

                    <div className="destacado-card">
                        <div className="destacado-imagen-wrapper">
                            <img src="https://images.unsplash.com/photo-1556881286-fc6915169721?q=80&w=300&auto=format&fit=crop" alt="Sake Premium" className="destacado-imagen" />
                        </div>
                        <div className="destacado-info">
                            <h3>Sake Premium Japonés</h3>
                            <p>$95.000</p>
                            <button className="btn-blendy btn-secundario btn-pill btn-sm">+ Comprar</button>
                        </div>
                    </div>

                    <div className="destacado-card">
                        <div className="destacado-imagen-wrapper">
                            <img src="https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=300&auto=format&fit=crop" alt="Vino Tinto" className="destacado-imagen" />
                        </div>
                        <div className="destacado-info">
                            <h3>Vino Tinto Francés</h3>
                            <p>$120.000</p>
                            <button className="btn-blendy btn-secundario btn-pill btn-sm">+ Comprar</button>
                        </div>
                    </div>

                    <div className="destacado-card">
                        <div className="destacado-imagen-wrapper">
                            <img src="https://images.unsplash.com/photo-1622543925917-763c34d1a86e?q=80&w=300&auto=format&fit=crop" alt="Agua Cítrica" className="destacado-imagen" />
                        </div>
                        <div className="destacado-info">
                            <h3>Agua Cítrica Menta</h3>
                            <p>$16.000</p>
                            <button className="btn-blendy btn-secundario btn-pill btn-sm">+ Comprar</button>
                        </div>
                    </div>
                    
                    <div className="destacado-card">
                        <div className="destacado-imagen-wrapper">
                            <img src="https://images.unsplash.com/photo-1563223771-5fe4038fbfc9?q=80&w=300&auto=format&fit=crop" alt="Whisky" className="destacado-imagen" />
                        </div>
                        <div className="destacado-info">
                            <h3>Whisky Single Malt</h3>
                            <p>$180.000</p>
                            <button className="btn-blendy btn-secundario btn-pill btn-sm">+ Comprar</button>
                        </div>
                    </div>

                </div>

                {/* Barra de progreso visual */}
                <div className="carousel-guide-container">
                    <div 
                        className="carousel-guide-fill" 
                        style={{ width: `${progreso}%` }}
                    ></div>
                </div>
            </section>

            {/* OFERTAS / PAQUETES */}
            <section className="ofertas-section">
                
                <div className="ofertas-image-container">
                    {/*  URL de ej */}
                    <img 
                        src="https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?q=80&w=800&auto=format&fit=crop" 
                        alt="Botella Premium Blendly" 
                        className="ofertas-image" 
                    />
                </div>
                
                <div className="ofertas-content">
                    <span className="ofertas-ticker">
                        OFERTAS EXCLUSIVAS • BEBIDAS DE CALIDAD • ENVÍO GRATIS • OFERTAS EXCLUSIVAS
                    </span>
                    <h2>Descubre el Mejor de Blendly con Paquetes Exclusivos</h2>
                    <p>Optimiza tus compras con nuestras combinaciones de bebidas seleccionadas. Envíos rápidos y atención personalizada para tu botillería.</p>
                    <button className="btn-paquetes">
                        Ver Paquetes
                    </button>
                </div>

            </section>

            {/* VISIÓN / CITA */}
            <section className="vision-section">
                <h2 className="vision-quote">
                    "La excelencia en el servicio de bebidas comienza con una gestión integral y una visión unificada."
                </h2>
                <div className="vision-columns">
                    <div className="vision-col">
                        <p>En Blendy, transformamos la experiencia de su negocio de bebidas. Unificamos sus operaciones físicas y digitales en una sola interfaz intuitiva, eliminando barreras y optimizando cada proceso de gestión.</p>
                    </div>
                    <div className="vision-col center-col">
                        <p>Nuestra plataforma centraliza el catálogo, los pedidos y los pagos en tiempo real. Desde el control de inventario hasta la emisión de recibos PDF, tenemos la tecnología necesaria para su éxito.</p>
                    </div>
                    <div className="vision-col">
                        <p>Con Blendy, su botillería es más que una tienda; es un ecosistema de confianza. Simplificamos la operación para que pueda enfocarse en lo que realmente importa: su comunidad y su producto.</p>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;