import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Agregué useNavigate aquí
import { login } from '../api/auth';

const Login = () => {
    // 1. Estados
    const [credenciales, setCredenciales] = useState({
        correoElectronico: '',
        contrasenia: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // 2. Manejador de cambios
    const handleChange = (e) => {
        setCredenciales({
            ...credenciales,
            [e.target.name]: e.target.value
        });
    };

    // 3. Manejador del envío (Conexión con el Back)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const response = await login(credenciales);
            const token = response.data.token || response.data; 
            
            localStorage.setItem('token', token);
            console.log("Sesión iniciada en Blendly");
            
            navigate('/home'); 
        } catch (err) {
            console.error(err);
            setError('Email o contraseña incorrectos');
        }
    };

    return (
        <div className="login-page">
            <div className="login-header">
                <span className="login-portal">PORTAL DE ACCESO</span>
                <h1>Bienvenido de nuevo a Blendy</h1>
                <p>Inicia sesión con tu cuenta de cliente o credenciales de staff para continuar.</p>
            </div>

            <div className="login-card-outer">
                <div className="login-form-inner">
                    <h2 className="login-form-logo">Blendy</h2>
                    
                    {/* Mensaje de error visual */}
                    {error && (
                        <div style={{ color: '#721c24', backgroundColor: '#f8d7da', padding: '10px', borderRadius: '5px', marginBottom: '15px', textAlign: 'center', fontSize: '0.85rem' }}>
                            {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>Email *</label>
                            <input 
                                type="email" 
                                name="correoElectronico" // Agregado el name para que handleChange funcione
                                placeholder="nombre@ejemplo.com" 
                                value={credenciales.correoElectronico}
                                onChange={handleChange}
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Contraseña *</label>
                            <input 
                                type="password" 
                                name="contrasenia" // Agregado el name para que handleChange funcione
                                placeholder="Introduce tu contraseña" 
                                value={credenciales.contrasenia}
                                onChange={handleChange}
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-blendy btn-enfasis btn-pill w-100">
                            Iniciar sesión
                        </button>
                    </form>
                </div>

                <div className="login-footer-links">
                    <Link to="/registro">Crear cuenta</Link>
                    <Link to="/recuperar">Olvidé mi contraseña</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;