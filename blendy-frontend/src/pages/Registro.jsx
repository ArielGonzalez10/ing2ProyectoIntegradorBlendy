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
    
    const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
    const [feedback, setFeedback] = useState({ texto: '', tipo: '' });//Declara la variable para manejar el response entity de el back
    const [errores, setErrores] = useState({});
    
    const validarCampo = (name, value) => {
        let errorMsg = '';
        const letrasRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        const numerosRegex = /^[0-9]+$/;

        switch(name) {
            case 'nombre':
            case 'apellido':
                if (value && !letrasRegex.test(value)) errorMsg = 'Solo debe contener letras y espacios.';
                break;
            case 'correoElectronico':
                if (value && !emailRegex.test(value)) errorMsg = 'Formato requerido (ej. usuario@gmail.com).';
                break;
            case 'contrasenia':
                if (value && value.length < 8) errorMsg = 'Mínimo 8 caracteres.';
                break;
            case 'telefono':
                if (value && !numerosRegex.test(value)) errorMsg = 'Solo admite caracteres numéricos.';
                break;
            default:
                break;
        }
        
        // Actualiza solo el error del campo que se está modificando
        setErrores(prev => ({ ...prev, [name]: errorMsg }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUsuario({
            ...usuario,
            [name]: value
        });
        validarCampo(name, value);

        if (name === 'contrasenia' && confirmarContrasenia) {
            if (value !== confirmarContrasenia) {
                setErrores(prev => ({ ...prev, confirmarContrasenia: 'Las contraseñas no coinciden.' }));
            } else {
                setErrores(prev => ({ ...prev, confirmarContrasenia: '' }));
            }
        }
    };

    const handleConfirmPasswordChange = (e) => {
        const value = e.target.value;
        setConfirmarContrasenia(value);
        if (value && value !== usuario.contrasenia) {
            setErrores(prev => ({ ...prev, confirmarContrasenia: 'Las contraseñas no coinciden.' }));
        } else {
            setErrores(prev => ({ ...prev, confirmarContrasenia: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const hayErrores = Object.values(errores).some(error => error !== '');
        if (hayErrores) {
            setFeedback({ 
                texto: 'Por favor, revise los campos marcados antes de continuar.', 
                tipo: 'danger' 
            });
            return;
        }

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
            setTimeout(() => {
                navigate('/login');
            }, 2500);
        } catch (error) {
           const mensajeError = error.response?.data || "Error de conexión";
            //Carga el mensaje del back
            setFeedback({ 
                texto: mensajeError, 
                tipo: 'danger' 
            });
        }
    };

    const estiloError = {
        color: '#666666',
        fontSize: '0.8rem',
        marginTop: '4px',
        display: 'block'
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
                        
                        {/* Nombre y Apellido */}
                        <div className="login-form-row">
                            <div className="form-group" style={{ flex: 1 }}>
                                <label>Nombre *</label>
                                <input 
                                    type="text" 
                                    name="nombre"
                                    placeholder="Ej: Juan" 
                                    value={usuario.nombre}
                                    onChange={handleChange}
                                    required 
                                />
                                {errores.nombre && <span style={estiloError}>{errores.nombre}</span>}
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
                                {errores.apellido && <span style={estiloError}>{errores.apellido}</span>}
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
                            {errores.correoElectronico && <span style={estiloError}>{errores.correoElectronico}</span>}
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
                                minLength="8"
                            />
                            {errores.contrasenia && <span style={estiloError}>{errores.contrasenia}</span>}
                        </div>

                        <div className="form-group">
                            <label>Confirmar Contraseña *</label>
                            <input 
                                type="password" 
                                placeholder="Repite tu contraseña" 
                                value={confirmarContrasenia}
                                onChange={(e) => setConfirmarContrasenia(e.target.value)}
                                required 
                                minLength="8"
                            />
                            {errores.confirmarContrasenia && <span style={estiloError}>{errores.confirmarContrasenia}</span>}
                        </div>

                        <div className="form-group">
                            <label>Teléfono</label>
                            <input 
                                type="text" 
                                name="telefono"
                                placeholder="Ej: 3794123456" 
                                value={usuario.telefono}
                                onChange={handleChange}
                                maxLength="15"
                            />
                            {errores.telefono && <span style={estiloError}>{errores.telefono}</span>}
                        </div>

                        <button type="submit" className="btn-blendy btn-enfasis btn-pill w-100">
                            Crear cuenta
                        </button>
                        
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