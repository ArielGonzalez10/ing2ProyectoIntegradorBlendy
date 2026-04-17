import { useState, useEffect } from 'react'; 
import { 
  buscarUsuario, 
  modificarUsuario, 
  listarDomicilios, 
  listarProvincias, 
  listarLocalidades,
  crearDomicilio // <--- Importación agregada
} from '../api/auth';
import '../styles/perfil.css';

const Perfil = () => {
  const [activeTab, setActiveTab] = useState("cuenta");
  const [mostrandoFormularioDireccion, setMostrandoFormularioDireccion] = useState(false);
  const [mostrandoFormularioBilletera, setMostrandoFormularioBilletera] = useState(false);

  const [domicilios, setDomicilios] = useState([]);
  const [cargandoDirecciones, setCargandoDirecciones] = useState(false);
  
  const [listaProvincias, setListaProvincias] = useState([]);
  const [listaLocalidades, setListaLocalidades] = useState([]);

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

  // --- CARGA DE DATOS ---

  const cargarDatosUsuario = async (email) => {
    try {
      const res = await buscarUsuario(email);
      if (res.data) setUsuario(res.data);
    } catch (error) {
      console.error("Error al buscar usuario:", error);
    }
  };

  const cargarMisDirecciones = async (email) => {
    setCargandoDirecciones(true);
    try {
      const res = await listarDomicilios(email);
      if (res.data) setDomicilios(res.data);
    } catch (error) {
      console.error("Error al traer domicilios:", error);
    } finally {
      setCargandoDirecciones(false);
    }
  };

  // Carga inicial de Provincias
  useEffect(() => {
    const emailLogueado = localStorage.getItem("userEmail");
    if (emailLogueado) {
      cargarDatosUsuario(emailLogueado);
      cargarMisDirecciones(emailLogueado);
    }

    const cargarProvinciasBD = async () => {
      try {
        const res = await listarProvincias();
        console.log("Datos Provincias recibidos:", res.data);
        if (res.data) setListaProvincias(res.data);
      } catch (error) {
        console.error("Error en listarProvincias:", error);
      }
    };
    cargarProvinciasBD();
  }, []);

  // Carga de Localidades cuando cambia la provincia
  useEffect(() => {
    const cargarLocalidadesBD = async () => {
      if (nuevaDireccion.provincia) {
        try {
          console.log("Buscando localidades para provincia ID:", nuevaDireccion.provincia);
          const res = await listarLocalidades(nuevaDireccion.provincia);
          console.log("Datos Localidades recibidos:", res.data);
          if (res.data) setListaLocalidades(res.data);
        } catch (error) {
          console.error("Error en listarLocalidades:", error);
        }
      } else {
        setListaLocalidades([]);
      }
    };
    cargarLocalidadesBD();
  }, [nuevaDireccion.provincia]);

  // --- HANDLERS ---

  const handleChange = (e) => {
    setUsuario({ ...usuario, [e.target.name]: e.target.value });
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    try {
      const response = await modificarUsuario(usuario);
      if (response.status === 200) alert("¡Datos actualizados!");
    } catch (error) {
      alert("Error al actualizar.");
    }
  };

  // LOGICA DE GUARDADO INTEGRADA AQUÍ
  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
    const emailLogueado = localStorage.getItem("userEmail");

    const datosEnvio = {
      calle: nuevaDireccion.calle,
      altura: parseInt(nuevaDireccion.altura),
      localidad: {
        idLocalidad: parseInt(nuevaDireccion.localidad)
      },
      usuario: {
        correoElectronico: emailLogueado
      }
    };

    try {
      const res = await crearDomicilio(datosEnvio);
      if (res.status === 200 || res.status === 201) {
        alert("Dirección guardada con éxito");
        setNuevaDireccion({
          provincia: "",
          localidad: "",
          codigoPostal: "",
          calle: "",
          altura: "",
          piso: "",
          departamento: ""
        });
        setMostrandoFormularioDireccion(false);
        if (emailLogueado) cargarMisDirecciones(emailLogueado);
      }
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      alert("Error al guardar la dirección.");
    }
  };

  const handleGuardarTarjeta = (e) => {
    e.preventDefault();
    setMostrandoFormularioBilletera(false);
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
                  </div>
                </div>

                <div className="perfil-seccion">
                  <h3>Acceso y Seguridad</h3>
                  <div className="perfil-form-row">
                    <div className="perfil-form-group">
                      <label>Correo Electrónico</label>
                      <input type="email" value={usuario.correoElectronico || ""} disabled />
                    </div>
                    <div className="perfil-form-group">
                      <label>Contraseña</label>
                      <input type="password" value="********" disabled />
                    </div>
                  </div>
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
                      <h3>Mis Direcciones</h3>
                      <button className="btn-blendy btn-enfasis btn-pill" onClick={() => setMostrandoFormularioDireccion(true)}>+ Nueva</button>
                    </div>
                    {cargandoDirecciones ? <p>Cargando...</p> : (
                      <div className="direcciones-lista" style={{ marginTop: "20px" }}>
                        {domicilios.map((dom) => (
                          <div key={dom.idDomicilio || Math.random()} className="direccion-card" style={{ border: "1px solid #ddd", borderRadius: "8px", padding: "15px", marginBottom: "10px" }}>
                            <strong>{dom.calle} {dom.altura}</strong>
                            <p>{dom.localidad?.nombre || "Localidad"}, CP {dom.localidad?.codigoPostal || dom.codigoPostal}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <form onSubmit={handleGuardarDireccion}>
                    <h3>Agregar Nueva Dirección</h3>
                    <div className="perfil-form-row">
                      <div className="perfil-form-group" style={{ flex: 2 }}>
                        <label>Provincia *</label>
                        <select 
                          required 
                          className="perfil-input"
                          value={nuevaDireccion.provincia} 
                          onChange={(e) => setNuevaDireccion({...nuevaDireccion, provincia: e.target.value, localidad: "", codigoPostal: ""})}
                        >
                          <option value="">Seleccione Provincia</option>
                          {listaProvincias.map(p => (
                            <option key={p.idProvincia} value={p.idProvincia}>
                                {p.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="perfil-form-group" style={{ flex: 2 }}>
                        <label>Localidad *</label>
                        <select 
                          required 
                          className="perfil-input"
                          disabled={!nuevaDireccion.provincia}
                          value={nuevaDireccion.localidad} 
                          onChange={(e) => {
                            const idSel = parseInt(e.target.value);
                            const loc = listaLocalidades.find(l => l.idLocalidad === idSel);
                            setNuevaDireccion({
                              ...nuevaDireccion, 
                              localidad: e.target.value,
                              codigoPostal: loc ? loc.codigoPostal : "" 
                            });
                          }}
                        >
                          <option value="">Seleccione Localidad</option>
                          {listaLocalidades.map(loc => (
                            <option key={loc.idLocalidad} value={loc.idLocalidad}>
                                {loc.nombre}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="perfil-form-group" style={{ flex: 1 }}>
                        <label>C.P. *</label>
                        <input 
                          type="text" 
                          required 
                          readOnly 
                          className="perfil-input"
                          value={nuevaDireccion.codigoPostal} 
                        />
                      </div>
                    </div>

                    <div className="perfil-form-row">
                      <div className="perfil-form-group" style={{ flex: 3 }}>
                        <label>Calle *</label>
                        <input type="text" placeholder="Ej: San Martin" className="perfil-input" required value={nuevaDireccion.calle} onChange={(e) => setNuevaDireccion({...nuevaDireccion, calle: e.target.value})} />
                      </div>
                      <div className="perfil-form-group" style={{ flex: 1 }}>
                        <label>Altura *</label>
                        <input type="number" placeholder="Ej: 1234" className="perfil-input" required value={nuevaDireccion.altura} onChange={(e) => setNuevaDireccion({...nuevaDireccion, altura: e.target.value})} />
                      </div>
                    </div>

                    <div className="perfil-form-row">
                      <div className="perfil-form-group">
                        <label>Piso (Opcional)</label>
                        <input type="text" placeholder="Ej: 3" className="perfil-input" value={nuevaDireccion.piso} onChange={(e) => setNuevaDireccion({...nuevaDireccion, piso: e.target.value})} />
                      </div>
                      <div className="perfil-form-group">
                        <label>Dpto (Opcional)</label>
                        <input type="text" placeholder="Ej: B" className="perfil-input" value={nuevaDireccion.departamento} onChange={(e) => setNuevaDireccion({...nuevaDireccion, departamento: e.target.value})} />
                      </div>
                    </div>

                    <div className="perfil-acciones">
                      <button type="button" className="btn-blendy btn-secundario" onClick={() => setMostrandoFormularioDireccion(false)}>Cancelar</button>
                      <button type="submit" className="btn-blendy btn-enfasis">Guardar Dirección</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {activeTab === "billetera" && (
              <div className="perfil-seccion">
                {!mostrandoFormularioBilletera ? (
                  <div style={{ textAlign: "center", padding: "60px 0" }}>
                    <p>No tienes métodos de pago guardados.</p>
                    <button className="btn-blendy btn-secundario btn-pill" onClick={() => setMostrandoFormularioBilletera(true)}>+ Agregar tarjeta</button>
                  </div>
                ) : (
                  <form onSubmit={handleGuardarTarjeta}>
                    <h3>Agregar Tarjeta</h3>
                    <div className="perfil-form-row">
                      <div className="perfil-form-group">
                        <label>Número de Tarjeta *</label>
                        <input type="text" className="perfil-input" required placeholder="0000 0000 0000 0000" />
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