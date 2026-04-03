import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registro } from '../api/auth';

const Register = () => {
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        correoElectronico: '',
        contrasenia: '',
        telefono: '',
        estado: 1
    });
    
    const [feedback, setFeedback] = useState({ texto: '', tipo: '' });//Declara la variable para manejar el response entity de el back

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const data = {
            idUsuario: 0, 
            ...usuario,            
            rol: { 
                idRol: 2,          
                nombreRol: "Cliente", 
                estado: 1          
            }
        };

        try {
            const response = await registro(data);
            //Carga el mensaje del back
            setFeedback({ 
                texto: response.data, 
                tipo: 'success' 
            });
            // redirección al login
        } catch (error) {
           const mensajeError = error.response?.data || "Error de conexión";
            //Carga el mensaje del back
            setFeedback({ 
                texto: mensajeError, 
                tipo: 'danger' 
            });
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
                    {/* Muestra el mensaje del back */}
                    {feedback.texto && (
                        <div style={{
                            padding: '12px',
                            marginBottom: '20px',
                            borderRadius: '8px',
                            fontSize: '0.9rem',
                            textAlign: 'center',
                            backgroundColor: feedback.tipo === 'success' ? '#d4edda' : '#f8d7da',
                            color: feedback.tipo === 'success' ? '#155724' : '#721c24',
                            border: `1px solid ${feedback.tipo === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                            }}>
                            {feedback.texto}
                        </div>
                    )}
                    {/* función onSubmit */}
                    <form onSubmit={handleSubmit}>
                        
                        {/* Nombre y Apellido */}
                        <div className="login-form-row">
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

                <div className="login-footer-links registro-footer">
                    <span className="texto-pregunta">
                        ¿Ya tienes una cuenta?
                    </span>
                    <Link to="/login">Inicia sesión aquí</Link>
                </div>

            </div>
        </div>
    );
};

export default Register;