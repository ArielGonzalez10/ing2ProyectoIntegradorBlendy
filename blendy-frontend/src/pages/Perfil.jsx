import { useState, useEffect } from 'react'; // Agregado useEffect
import { buscarUsuario } from '../api/auth';
import { modificarUsuario } from '../api/auth';
import '../styles/perfil.css';

const Perfil = () => {
    // Controlar qué pestaña está activa
    const [activeTab, setActiveTab] = useState('cuenta');
    const [mostrandoFormularioDireccion, setMostrandoFormularioDireccion] = useState(false);
    const [mostrandoFormularioBilletera, setMostrandoFormularioBilletera] = useState(false);

    // Estado inicial vacío para llenar con la API
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        correoElectronico: '',
        telefono: '',
        domicilio: '' // Coincide con tu UsuarioDTO
    });

    // 1. CARGAR DATOS AL INICIAR
    useEffect(() => {
        const obtenerDatosUsuario = async () => {
            try {
                // Recuperas el email del usuario logueado (ej: de localStorage)
                const emailLogueado = localStorage.getItem('userEmail');
                
                //llama al metodo de buscar
                const response = await buscarUsuario(emailLogueado);

                if (response.data) {
                    setUsuario(response.data);
                }
            } catch (error) {
                console.error("Error cargando datos de Blendly:", error);
            }
        };

        obtenerDatosUsuario();
    }, []);

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const handleGuardar = async (e) => {
        e.preventDefault();
        try {
            // Llamamos a la función del servicio
            const response = await modificarUsuario(usuario);
            
            if (response.status === 200) {
                alert("¡Datos actualizados con éxito!");
            }
        } catch (error) {
            console.error("Error al actualizar:", error);
            alert("No se pudo actualizar la información.");
        }
    };

    const handleGuardarDireccion = (e) => {
        e.preventDefault();
        alert("¡Dirección guardada! (Vista simulada)");
        setMostrandoFormularioDireccion(false);
    };

    const handleGuardarTarjeta = (e) => {
        e.preventDefault();
        alert("¡Tarjeta guardada de forma segura! (Vista simulada)");
        setMostrandoFormularioBilletera(false);
    };
    
    return (
        <div className="perfil-page">
            <div className="perfil-container">
                
                {/* ENCABEZADO */}
                <div className="perfil-header">
                    <h1>Configuración de Cuenta</h1>
                    <p>Administra tu información personal, direcciones de envío y métodos de pago.</p>
                </div>

                <div className="perfil-layout">
                    
                    {/* MENÚ LATERAL (Tabs) */}
                    <aside className="perfil-sidebar">
                        <button 
                            className={`perfil-tab ${activeTab === 'cuenta' ? 'active' : ''}`}
                            onClick={() => setActiveTab('cuenta')}
                        >
                            Mi Cuenta
                        </button>
                        <button 
                            className={`perfil-tab ${activeTab === 'direcciones' ? 'active' : ''}`}
                            onClick={() => setActiveTab('direcciones')}
                        >
                            Mis Direcciones
                        </button>
                        <button 
                            className={`perfil-tab ${activeTab === 'billetera' ? 'active' : ''}`}
                            onClick={() => setActiveTab('billetera')}
                        >
                            Billetera
                        </button>
                    </aside>

                    {/* CONTENIDO PRINCIPAL */}
                    <main className="perfil-content">
                        
                        {/* MI CUENTA */}
                        {activeTab === 'cuenta' && (
                            <form onSubmit={handleGuardar}>
                                
                                <div className="perfil-seccion">
                                    <h3>Información Personal</h3>
                                    <p>Actualiza tus datos básicos para tus pedidos y facturación.</p>
                                    
                                    <div className="perfil-form-row">
                                        <div className="perfil-form-group">
                                            <label>Nombre</label>
                                            <input type="text" name="nombre" value={usuario.nombre} onChange={handleChange} required />
                                        </div>
                                        <div className="perfil-form-group">
                                            <label>Apellido</label>
                                            <input type="text" name="apellido" value={usuario.apellido} onChange={handleChange} required />
                                        </div>
                                    </div>

                                    <div className="perfil-form-row">
                                        <div className="perfil-form-group">
                                            <label>Teléfono</label>
                                            <input type="text" name="telefono" value={usuario.telefono || ''} onChange={handleChange} />
                                        </div>
                                        <div className="perfil-form-group"></div>
                                    </div>
                                </div>

                                <div className="perfil-seccion">
                                    <h3>Acceso y Seguridad</h3>
                                    <p>Tus credenciales para ingresar a Blendly.</p>
                                    
                                    <div className="perfil-form-row">
                                        <div className="perfil-form-group">
                                            <label>Correo Electrónico (No editable)</label>
                                            <input type="email" value={usuario.correoElectronico} disabled />
                                        </div>
                                        <div className="perfil-form-group">
                                            <label>Contraseña</label>
                                            <input type="password" value="********" disabled />
                                        </div>
                                    </div>
                                    <span style={{ fontSize: '0.85rem', color: '#00bcd4', cursor: 'pointer', textDecoration: 'underline' }}>
                                        Solicitar cambio de contraseña
                                    </span>
                                </div>

                                <div className="perfil-acciones">
                                    <button type="button" className="btn-blendy btn-secundario">
                                        Descartar
                                    </button>
                                    <button type="submit" className="btn-blendy btn-enfasis">
                                        Actualizar información
                                    </button>
                                </div>

                            </form>
                        )}

                        {/* PESTAÑA: MIS DIRECCIONES */}
                        {activeTab === 'direcciones' && (
                            <div className="perfil-seccion">
                                {!mostrandoFormularioDireccion ? (
                                    <>
                                        <h3>Mis Direcciones</h3>
                                        <p>Agrega y administra las direcciones que utilizas con frecuencia.</p>
                                        
                                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                            <p style={{ fontSize: '1.1rem', margin: '0 0 20px 0' }}>No has guardado ninguna dirección todavía.</p>
                                            <button 
                                                className="btn-blendy btn-secundario btn-pill"
                                                onClick={() => setMostrandoFormularioDireccion(true)}
                                            >
                                                + Agregar nueva dirección
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <form onSubmit={handleGuardarDireccion}>
                                        <h3>Agregar Nueva Dirección</h3>
                                        <p>Ingresa los datos exactos para garantizar la entrega de tu pedido.</p>

                                        <div className="perfil-form-row">
                                            <div className="perfil-form-group">
                                                <label>Provincia *</label>
                                                <select required>
                                                    <option value="">Selecciona una provincia</option>
                                                    <option value="1">Corrientes</option>
                                                    <option value="2">Chaco</option>
                                                    <option value="3">Misiones</option>
                                                </select>
                                            </div>
                                            <div className="perfil-form-group">
                                                <label>Localidad *</label>
                                                <select required>
                                                    <option value="">Selecciona una localidad</option>
                                                    <option value="1">Corrientes Capital</option>
                                                    <option value="2">Goya</option>
                                                    <option value="3">Resistencia</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="perfil-form-row">
                                            <div className="perfil-form-group" style={{ flex: 2 }}>
                                                <label>Calle *</label>
                                                <input type="text" required placeholder="Ej: San Martín" />
                                            </div>
                                            <div className="perfil-form-group" style={{ flex: 1 }}>
                                                <label>Número *</label>
                                                <input type="text" required placeholder="Ej: 1234" />
                                            </div>
                                        </div>

                                        <div className="perfil-form-row">
                                            <div className="perfil-form-group">
                                                <label>Piso</label>
                                                <input type="text" placeholder="Ej: 2" />
                                            </div>
                                            <div className="perfil-form-group">
                                                <label>Departamento</label>
                                                <input type="text" placeholder="Ej: B" />
                                            </div>
                                            <div className="perfil-form-group">
                                                <label>Código Postal *</label>
                                                <input type="text" required placeholder="Ej: 3400" />
                                            </div>
                                        </div>

                                        <div className="perfil-acciones">
                                            <button 
                                                type="button" 
                                                className="btn-blendy btn-secundario"
                                                onClick={() => setMostrandoFormularioDireccion(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn-blendy btn-enfasis">
                                                Guardar Dirección
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                        {/* PESTAÑA: BILLETERA */}
                        {activeTab === 'billetera' && (
                            <div className="perfil-seccion">
                                {!mostrandoFormularioBilletera ? (
                                    <>
                                        <h3>Billetera</h3>
                                        <p>Guarda tus detalles de pago para finalizar la compra de forma rápida y segura.</p>
                                        
                                        <div style={{ textAlign: 'center', padding: '60px 0' }}>
                                            <p style={{ fontSize: '1.1rem', margin: '0 0 20px 0' }}>No tienes métodos de pago guardados.</p>
                                            <button 
                                                className="btn-blendy btn-secundario btn-pill"
                                                onClick={() => setMostrandoFormularioBilletera(true)}
                                            >
                                                + Agregar nueva tarjeta
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <form onSubmit={handleGuardarTarjeta}>
                                        <h3>Agregar Tarjeta</h3>
                                        <p>Aceptamos todas las tarjetas de crédito y débito.</p>

                                        <div className="perfil-form-row">
                                            <div className="perfil-form-group">
                                                <label>Número de Tarjeta *</label>
                                                <input type="text" required placeholder="0000 0000 0000 0000" maxLength="19" />
                                            </div>
                                        </div>

                                        <div className="perfil-form-row">
                                            <div className="perfil-form-group">
                                                <label>Nombre en la Tarjeta *</label>
                                                <input type="text" required placeholder="Ej: JUAN PÉREZ" style={{ textTransform: 'uppercase' }} />
                                            </div>
                                        </div>

                                        <div className="perfil-form-row">
                                            <div className="perfil-form-group" style={{ flex: 1 }}>
                                                <label>Vencimiento (MM/AA) *</label>
                                                <input type="text" required placeholder="MM/AA" maxLength="5" />
                                            </div>
                                            <div className="perfil-form-group" style={{ flex: 1 }}>
                                                <label>Código de Seguridad *</label>
                                                <input type="password" required placeholder="CVC" maxLength="4" />
                                            </div>
                                            <div className="perfil-form-group" style={{ flex: 1 }}>
                                                <label>DNI del Titular *</label>
                                                <input type="text" required placeholder="Ej: 12345678" maxLength="8" />
                                            </div>
                                        </div>

                                        <div className="perfil-acciones">
                                            <button 
                                                type="button" 
                                                className="btn-blendy btn-secundario"
                                                onClick={() => setMostrandoFormularioBilletera(false)}
                                            >
                                                Cancelar
                                            </button>
                                            <button type="submit" className="btn-blendy btn-enfasis">
                                                Guardar Tarjeta
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        )}

                    </main>
                </div>
            </div>
        </div>
    );
};

export default Perfil;