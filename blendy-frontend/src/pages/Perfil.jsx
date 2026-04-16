import { useState, useEffect } from 'react'; 
import { buscarUsuario } from '../api/auth';
import { modificarUsuario } from '../api/auth';
import { listarDomicilios } from '../api/auth';
import '../styles/perfil.css';

const Perfil = () => {
  const [activeTab, setActiveTab] = useState("cuenta");
  const [mostrandoFormularioDireccion, setMostrandoFormularioDireccion] = useState(false);
  const [mostrandoFormularioBilletera, setMostrandoFormularioBilletera] = useState(false);

  const [domicilios, setDomicilios] = useState([]);
  const [cargandoDirecciones, setCargandoDirecciones] = useState(false);
  const [nuevaDireccion, setNuevaDireccion] = useState({
    provincia: "",
    localidad: "",
    codigoPostal: "",
    calle: "",
    altura: "",
    piso: "",
    departamento: ""
  });

  const [usuario, setUsuario] = useState({
    nombre: "",
    apellido: "",
    correoElectronico: "",
    telefono: "",
    domicilio: "", 
  });

  const cargarDatosUsuario = async (email) => {
    try {
      const res = await buscarUsuario(email);
      if (res.data) {
        setUsuario(res.data);
      }
    } catch (error) {
      console.error("Error al buscar usuario:", error);
    }
  };

  const cargarMisDirecciones = async (email) => {
    setCargandoDirecciones(true);
    try {
      const res = await listarDomicilios(email);
      console.log("Respuesta de la API:", res.data);
      if (res.data) {
        setDomicilios(res.data);
      }
    } catch (error) {
      console.error("Error al traer domicilios:", error);
      setDomicilios([]); 
    } finally {
      setCargandoDirecciones(false);
    }
  };

  useEffect(() => {
    const emailLogueado = localStorage.getItem("userEmail");
    if (emailLogueado) {
      cargarDatosUsuario(emailLogueado);
      cargarMisDirecciones(emailLogueado);
    }
  }, []);

  const handleChange = (e) => {
    setUsuario({
      ...usuario,
      [e.target.name]: e.target.value,
    });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const response = await modificarUsuario(usuario);
      if (response.status === 200) {
        alert("¡Datos actualizados con éxito!");
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      alert("No se pudo actualizar la información.");
    }
  };

  const handleGuardarTarjeta = (e) => {
    e.preventDefault();
    alert("¡Tarjeta guardada de forma segura! (Vista simulada)");
    setMostrandoFormularioBilletera(false);
  };

  const handleGuardarDireccion = (e) => {
    e.preventDefault();
    setMostrandoFormularioDireccion(false);
  };

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <div className="perfil-header">
          <h1>Configuración de Cuenta</h1>
          <p>Administra tu información personal, direcciones de envío y métodos de pago.</p>
        </div>

        <div className="perfil-layout">
          <aside className="perfil-sidebar">
            <button className={`perfil-tab ${activeTab === "cuenta" ? "active" : ""}`} onClick={() => setActiveTab("cuenta")}>Mi Cuenta</button>
            <button className={`perfil-tab ${activeTab === "direcciones" ? "active" : ""}`} onClick={() => setActiveTab("direcciones")}>Mis Direcciones</button>
            <button className={`perfil-tab ${activeTab === "billetera" ? "active" : ""}`} onClick={() => setActiveTab("billetera")}>Billetera</button>
          </aside>

          <main className="perfil-content">
            {activeTab === "cuenta" && (
              <form onSubmit={handleGuardar}>
                <div className="perfil-seccion">
                  <h3>Información Personal</h3>
                  <p>Actualiza tus datos básicos para tus pedidos y facturación.</p>
                  <div className="perfil-form-row">
                    <div className="perfil-form-group">
                      <label>Nombre</label>
                      <input type="text" name="nombre" value={usuario.nombre || ""} onChange={handleChange} required />
                    </div>
                    <div className="perfil-form-group">
                      <label>Apellido</label>
                      <input type="text" name="apellido" value={usuario.apellido || ""} onChange={handleChange} required />
                    </div>
                  </div>
                  <div className="perfil-form-row">
                    <div className="perfil-form-group">
                      <label>Teléfono</label>
                      <input type="text" name="telefono" value={usuario.telefono || ""} onChange={handleChange} />
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
                      <input type="email" value={usuario.correoElectronico || ""} disabled />
                    </div>
                    <div className="perfil-form-group">
                      <label>Contraseña</label>
                      <input type="password" value="********" disabled />
                    </div>
                  </div>
                  <span style={{ fontSize: "0.85rem", color: "#00bcd4", cursor: "pointer", textDecoration: "underline" }}>
                    Solicitar cambio de contraseña
                  </span>
                </div>

                <div className="perfil-acciones">
                  <button type="button" className="btn-blendy btn-secundario">Descartar</button>
                  <button type="submit" className="btn-blendy btn-enfasis">Actualizar información</button>
                </div>
              </form>
            )}

            {activeTab === "direcciones" && (
              <div className="perfil-seccion">
                {!mostrandoFormularioDireccion ? (
                  <>
                    <div className="perfil-header-flex" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <h3>Mis Direcciones</h3>
                        <p>Administra tus lugares de entrega.</p>
                      </div>
                      <button className="btn-blendy btn-enfasis btn-pill" onClick={() => setMostrandoFormularioDireccion(true)}>+ Nueva</button>
                    </div>

                    {cargandoDirecciones ? (
                      <p>Cargando direcciones...</p>
                    ) : (
                      <div className="direcciones-lista" style={{ marginTop: "20px" }}>
                                                  {domicilios.map((dom) => (
                                                      <div
                                                          /* 1. Usamos id_domicilio o idDomicilio según lo que mande el backend */
                                                          key={dom.id_domicilio || dom.idDomicilio || Math.random()}
                                                          className="direccion-card"
                                                          style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "10px", display: "flex", justifyContent: "space-between" }}
                                                      >
                                                          <div>
                                                              <strong style={{ display: "block", fontSize: "1.1rem" }}>
                                                                  {dom.calle} {dom.altura}
                                                              </strong>
                                                              <span style={{ color: "#666" }}>
                                                                  {/* 2. Mapeo flexible para la localidad y el nombre */}
                                                                  {dom.localidad?.nombreLocalidad || dom.localidad?.nombre || "Localidad"},
                                                                  CP {dom.codigoPostal || dom.codigo_postal || "3400"}
                                                              </span>

                                                              {(dom.piso || dom.depto) && (
                                                                  <p style={{ margin: "5px 0 0 0", fontSize: "0.9rem", color: "#888" }}>
                                                                      {dom.piso ? `Piso ${dom.piso}` : ""} {dom.depto ? `- Depto ${dom.depto}` : ""}
                                                                  </p>
                                                              )}
                                                          </div>
                                                          <div className="direccion-badge" style={{ background: "#e0f7fa", color: "#00838f", padding: "5px 10px", borderRadius: "15px", fontSize: "0.8rem", height: "fit-content" }}>
                                                              Guardada
                                                          </div>
                                                      </div>
                                                  ))}
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleGuardarDireccion}>
                    <h3>Agregar Nueva Dirección</h3>
                    <p>Completá los datos para agilizar tus futuras compras.</p>
                    
                    {/* Fila 1: Provincia, Localidad y CP */}
                    <div className="perfil-form-row">
                      <div className="perfil-form-group" style={{ flex: 2 }}>
                        <label>Provincia *</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Corrientes" 
                          required 
                          value={nuevaDireccion.provincia} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, provincia: e.target.value})} 
                        />
                      </div>
                      <div className="perfil-form-group" style={{ flex: 2 }}>
                        <label>Localidad *</label>
                        <input 
                          type="text" 
                          placeholder="Ej: Corrientes Cap." 
                          required 
                          value={nuevaDireccion.localidad} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, localidad: e.target.value})} 
                        />
                      </div>
                      <div className="perfil-form-group" style={{ flex: 1 }}>
                        <label>C.P. *</label>
                        <input 
                          type="number" 
                          placeholder="3400" 
                          required 
                          value={nuevaDireccion.codigoPostal} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, codigoPostal: e.target.value})} 
                        />
                      </div>
                    </div>

                    {/* Fila 2: Calle y Altura */}
                    <div className="perfil-form-row">
                      <div className="perfil-form-group" style={{ flex: 3 }}>
                        <label>Calle *</label>
                        <input 
                          type="text" 
                          placeholder="Ej: San Martín" 
                          required 
                          value={nuevaDireccion.calle} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, calle: e.target.value})} 
                        />
                      </div>
                      <div className="perfil-form-group" style={{ flex: 1 }}>
                        <label>Altura *</label>
                        <input 
                          type="number" 
                          placeholder="Ej: 1234" 
                          required 
                          value={nuevaDireccion.altura} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, altura: e.target.value})} 
                        />
                      </div>
                    </div>

                    {/* Fila 3: Piso y Departamento */}
                    <div className="perfil-form-row">
                      <div className="perfil-form-group" style={{ flex: 1 }}>
                        <label>Piso (Opcional)</label>
                        <input 
                          type="text" 
                          placeholder="Ej: 3" 
                          value={nuevaDireccion.piso} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, piso: e.target.value})} 
                        />
                      </div>
                      <div className="perfil-form-group" style={{ flex: 1 }}>
                        <label>Dpto (Opcional)</label>
                        <input 
                          type="text" 
                          placeholder="Ej: B" 
                          value={nuevaDireccion.departamento} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, departamento: e.target.value})} 
                        />
                      </div>
                    </div>

                    {/* Botones de Acción */}
                    <div className="perfil-acciones" style={{ marginTop: '20px' }}>
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

            {activeTab === "billetera" && (
              <div className="perfil-seccion">
                {!mostrandoFormularioBilletera ? (
                  <>
                    <h3>Billetera</h3>
                    <p>Guarda tus detalles de pago para finalizar la compra de forma rápida y segura.</p>
                    <div style={{ textAlign: "center", padding: "60px 0" }}>
                      <p style={{ fontSize: "1.1rem", margin: "0 0 20px 0" }}>No tienes métodos de pago guardados.</p>
                      <button className="btn-blendy btn-secundario btn-pill" onClick={() => setMostrandoFormularioBilletera(true)}>+ Agregar nueva tarjeta</button>
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
                        <input type="text" required placeholder="Ej: JUAN PÉREZ" style={{ textTransform: "uppercase" }} />
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
                      <button type="button" className="btn-blendy btn-secundario" onClick={() => setMostrandoFormularioBilletera(false)}>Cancelar</button>
                      <button type="submit" className="btn-blendy btn-enfasis">Guardar Tarjeta</button>
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