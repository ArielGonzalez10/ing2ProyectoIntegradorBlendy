import { useState, useEffect } from "react";
import { buscarUsuario, modificarUsuario } from "../api/auth";
import {
  listarDomicilios,
  listarProvincias,
  listarLocalidades,
  listarCP, // 🟢 Ahora sí lo importamos correctamente
  crearDomicilio,
} from "../api/domicilios";
import "../styles/perfil.css";

const Perfil = () => {
  const [activeTab, setActiveTab] = useState("cuenta");
  const [mostrandoFormularioDireccion, setMostrandoFormularioDireccion] =
    useState(false);
  const [mostrandoFormularioBilletera, setMostrandoFormularioBilletera] =
    useState(false);

  const [domicilios, setDomicilios] = useState([]);
  const [cargandoDirecciones, setCargandoDirecciones] = useState(false);

  const [listaProvincias, setListaProvincias] = useState([]);
  const [listaLocalidades, setListaLocalidades] = useState([]);

  const [nuevaDireccion, setNuevaDireccion] = useState({
    provincia: "", // 🟢 Almacenará el nombre (String)
    localidad: "", // 🟢 Almacenará el nombre (String)
    codigoPostal: "",
    calle: "",
    altura: "",
    piso: "",
    departamento: "",
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
        if (res.data) setListaProvincias(res.data); // Tu back devuelve List<String>
      } catch (error) {
        console.error("Error en listarProvincias:", error);
      }
    };
    cargarProvinciasBD();
  }, []);

  // 🟢 Carga de Localidades cuando cambia el NOMBRE de la provincia
  useEffect(() => {
    const cargarLocalidadesBD = async () => {
      if (nuevaDireccion.provincia) {
        try {
          console.log(
            "Buscando localidades para provincia:",
            nuevaDireccion.provincia
          );
          const res = await listarLocalidades(nuevaDireccion.provincia);
          console.log("Datos Localidades recibidos:", res.data);
          if (res.data) setListaLocalidades(res.data); // Tu back devuelve List<String>
        } catch (error) {
          console.error("Error en listarLocalidades:", error);
        }
      } else {
        setListaLocalidades([]);
      }
    };
    cargarLocalidadesBD();
  }, [nuevaDireccion.provincia]);

  // 🟢 Carga del Código Postal cuando cambia el NOMBRE de la localidad
  useEffect(() => {
    const cargarCodigoPostalBD = async () => {
      if (nuevaDireccion.localidad) {
        try {
          console.log(
            "Buscando CP para la localidad:",
            nuevaDireccion.localidad
          );
          const res = await listarCP(nuevaDireccion.localidad);
          console.log("Datos CP recibidos:", res.data);

          if (res.data && res.data.length > 0) {
            // Como tu back devuelve un List<Integer>, tomamos el primero disponible
            setNuevaDireccion((prev) => ({
              ...prev,
              codigoPostal: res.data[0],
            }));
          } else {
            setNuevaDireccion((prev) => ({ ...prev, codigoPostal: "" }));
          }
        } catch (error) {
          console.error("Error en listarCP:", error);
        }
      } else {
        setNuevaDireccion((prev) => ({ ...prev, codigoPostal: "" }));
      }
    };
    cargarCodigoPostalBD();
  }, [nuevaDireccion.localidad]);

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
    console.error(error); 
    alert("Error al actualizar.");
  }
};

  const handleGuardarDireccion = async (e) => {
    e.preventDefault();
    const emailLogueado = localStorage.getItem("userEmail");

    // 🟢 Modificado: Enviamos la estructura plana que mapea 1:1 con Domicilio.java
    const datosEnvio = {
      calle: nuevaDireccion.calle,
      altura: parseInt(nuevaDireccion.altura),
      estado: "Activo",
      provincia: nuevaDireccion.provincia, // Se asocia al @Transient de Java
      localidad: nuevaDireccion.localidad, // Se asocia al @Transient de Java (String plano)
      usuario: {
        correoElectronico: emailLogueado, // Tu backend lo usa para buscar el usuario
      },
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
          departamento: "",
        });
        setMostrandoFormularioDireccion(false);
        if (emailLogueado) cargarMisDirecciones(emailLogueado);
      }
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      alert("Error al guardar la dirección.");
    }
  };

  return (
    <div className="perfil-page">
      <div className="perfil-container">
        <div className="perfil-header">
          <h1>Configuración de Cuenta</h1>
          <p>
            Administra tu información personal, direcciones de envío y métodos
            de pago.
          </p>
        </div>

        <div className="perfil-layout">
          <aside className="perfil-sidebar">
            <button
              className={`perfil-tab ${activeTab === "cuenta" ? "active" : ""}`}
              onClick={() => setActiveTab("cuenta")}
            >
              Mi Cuenta
            </button>
            <button
              className={`perfil-tab ${
                activeTab === "direcciones" ? "active" : ""
              }`}
              onClick={() => setActiveTab("direcciones")}
            >
              Mis Direcciones
            </button>
          </aside>

          <main className="perfil-content">
            {activeTab === "cuenta" && (
              <form onSubmit={handleGuardar}>
                <div className="perfil-seccion">
                  <h3>Información Personal</h3>
                  <div className="perfil-form-row">
                    <div className="perfil-form-group">
                      <label>Nombre</label>
                      <input
                        type="text"
                        name="nombre"
                        value={usuario.nombre || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="perfil-form-group">
                      <label>Apellido</label>
                      <input
                        type="text"
                        name="apellido"
                        value={usuario.apellido || ""}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="perfil-form-row">
                    <div className="perfil-form-group">
                      <label>Teléfono</label>
                      <input
                        type="text"
                        name="telefono"
                        value={usuario.telefono || ""}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="perfil-seccion">
                  <h3>Acceso y Seguridad</h3>
                  <div className="perfil-form-row">
                    <div className="perfil-form-group">
                      <label>Correo Electrónico</label>
                      <input
                        type="email"
                        value={usuario.correoElectronico || ""}
                        disabled
                      />
                    </div>
                    <div className="perfil-form-group">
                      <label>Contraseña</label>
                      <input type="password" value="********" disabled />
                    </div>
                  </div>
                </div>

                <div className="perfil-acciones">
                  <button
                    type="button"
                    className="btn-blendy btn-secundario"
                    onClick={() => {
                      const emailLogueado = localStorage.getItem("userEmail");
                      if (emailLogueado) cargarDatosUsuario(emailLogueado);
                    }}
                  >
                    Descartar
                  </button>
                  <button type="submit" className="btn-blendy btn-enfasis">
                    Actualizar información
                  </button>
                </div>
              </form>
            )}

            {activeTab === "direcciones" && (
              <div className="perfil-seccion">
                {!mostrandoFormularioDireccion ? (
                  <>
                    <div
                      className="perfil-header-flex"
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3>Mis Direcciones</h3>
                      <button
                        className="btn-blendy btn-enfasis btn-pill"
                        onClick={() => setMostrandoFormularioDireccion(true)}
                      >
                        + Nueva
                      </button>
                    </div>
                    {cargandoDirecciones ? (
                      <p>Cargando...</p>
                    ) : (
                      <div
                        className="direcciones-lista"
                        style={{ marginTop: "20px" }}
                      >
                        {domicilios.map((dom) => (
                          <div
                            key={dom.idDomicilio || Math.random()}
                            className="direccion-card"
                            style={{
                              border: "1px solid #ddd",
                              borderRadius: "8px",
                              padding: "15px",
                              marginBottom: "10px",
                            }}
                          >
                            <strong>
                              {dom.calle} {dom.altura}
                            </strong>
                            <p>
                              {dom.localidad?.nombre || "Localidad"}, CP{" "}
                              {dom.localidad?.codigoPostal || dom.codigoPostal}
                            </p>
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
                          onChange={(e) =>
                            setNuevaDireccion({
                              ...nuevaDireccion,
                              provincia: e.target.value, // Guarda el String directamente
                              localidad: "",
                              codigoPostal: "",
                            })
                          }
                        >
                          <option value="">Seleccione Provincia</option>
                          {listaProvincias.map((prov) => (
                            <option key={prov} value={prov}>
                              {prov}
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
                          onChange={(e) =>
                            setNuevaDireccion({
                              ...nuevaDireccion,
                              localidad: e.target.value, // Guarda el String directamente
                              codigoPostal: "", // Se auto-llenará mediante el useEffect
                            })
                          }
                        >
                          <option value="">Seleccione Localidad</option>
                          {listaLocalidades.map((loc) => (
                            <option key={loc} value={loc}>
                              {loc}
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
                        <input
                          type="text"
                          placeholder="Ej: San Martin"
                          className="perfil-input"
                          required
                          value={nuevaDireccion.calle}
                          onChange={(e) =>
                            setNuevaDireccion({
                              ...nuevaDireccion,
                              calle: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="perfil-form-group" style={{ flex: 1 }}>
                        <label>Altura *</label>
                        <input
                          type="number"
                          placeholder="Ej: 1234"
                          className="perfil-input"
                          required
                          value={nuevaDireccion.altura}
                          onChange={(e) =>
                            setNuevaDireccion({
                              ...nuevaDireccion,
                              altura: e.target.value,
                            })
                          }
                        />
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
          </main>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
