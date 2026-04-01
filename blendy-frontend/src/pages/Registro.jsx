import { useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

const Register = () => {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        correoElectronico: '',
        contrasenia: '',
        telefono: '',
        estado: 1
    });

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const usuarioParaEnviar = {
            idUsuario: 0, 
            ...usuario,            
            rol: { 
                idRol: 2,          
                nombreRol: "Cliente", 
                estado: 1          
            }
        };

        try {
            const response = await api.post('/usuarios/crear', usuarioParaEnviar); 
            alert("¡Registro exitoso en Blendly!");
            console.log("Datos guardados en DB:", response.data);
            // redirección al login
        } catch (error) {
            console.error("Error al registrar:", error.response?.data || error.message);
            alert("Hubo un problema con el registro. Revisa la consola (F12).");
        }
    };

    return (
        <div className="login-page">
            
            <div className="login-header">
                <span className="login-portal">NUEVO USUARIO</span>
                <h1>Únete a Blendly</h1>
                <p>Crea tu cuenta para acceder a selecciones exclusivas y gestionar tus pedidos.</p>
            </div>

            <div className="login-card-outer">
                <div className="login-form-inner">
                    <h2 className="login-form-logo">Blendly</h2>
                    
                    {/* función onSubmit */}
                    <form onSubmit={handleSubmit}>
                        
                        {/* Fila para Nombre y Apellido (Flexbox para que queden uno al lado del otro) */}
                        <div style={{ display: 'flex', gap: '15px' }}>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Nombre *</label>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    placeholder="Ej: Fátima" 
                                    value={usuario.nombre}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Apellido *</label>
                                <input 
                                    type="text" 
                                    name="apellido"
                                    placeholder="Ej: Pérez" 
                                    value={usuario.apellido}
                                    onChange={handleChange}
                                    required 
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Correo Electrónico *</label>
                            <input 
                                type="email" 
                                name="correoElectronico"
                                placeholder="nombre@ejemplo.com" 
                                value={usuario.correoElectronico}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Contraseña *</label>
                            <input 
                                type="password" 
                                name="contrasenia"
                                placeholder="Crea una contraseña segura" 
                                value={usuario.contrasenia}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label>Teléfono</label>
                            <input 
                                type="text" 
                                name="telefono"
                                placeholder="Ej: 3794123456" 
                                value={usuario.telefono}
                                onChange={handleChange}
                            />
                        </div>

                        <button type="submit" className="btn-blendy btn-enfasis btn-pill w-100">
                            Crear cuenta
                        </button>
                    </form>
                </div>

                <div className="login-footer-links" style={{ justifyContent: 'center' }}>
                    <span style={{ color: 'var(--color-texto)', fontFamily: 'var(--font-cuerpo)', fontSize: '0.85rem', marginRight: '5px' }}>
                        ¿Ya tienes una cuenta?
                    </span>
                    <Link to="/login">Inicia sesión aquí</Link>
                </div>

            </div>
        </div>
    );
};

export default Register;