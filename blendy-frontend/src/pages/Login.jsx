import { Link } from 'react-router-dom';

const Login = () => {
    return (
        <div className="login-page">
            
            <div className="login-header">
                <span className="login-portal">PORTAL DE ACCESO</span>
                <h1>Bienvenido de nuevo a Blendy</h1>
                <p>Inicia sesión con tu cuenta de cliente o credenciales de staff para continuar.</p>
            </div>

            {/* CAJA EXTERIOR */}
            <div className="login-card-outer">
                
                {/* CAJA INTERIOR */}
                <div className="login-form-inner">
                    <h2 className="login-form-logo">Blendy</h2>
                    
                    {/* Formulario sin conexión: preventDefault evita que la página recargue */}
                    <form onSubmit={(e) => e.preventDefault()}>
                        
                        <div className="form-group">
                            <label>Email *</label>
                            <input 
                                type="email" 
                                placeholder="nombre@ejemplo.com" 
                                required 
                            />
                        </div>
                        
                        <div className="form-group">
                            <label>Contraseña *</label>
                            <input 
                                type="password" 
                                placeholder="Introduce tu contraseña" 
                                required 
                            />
                        </div>

                        <button type="submit" className="btn-blendy btn-enfasis btn-pill w-100">
                            Iniciar sesión
                        </button>
                    </form>
                </div>

                {/* ENLACES DE RECUPERACIÓN Y REGISTRO */}
                <div className="login-footer-links">
                    {/* Link que apunta al archivo Registro.jsx */}
                    <Link to="/registro">Crear cuenta</Link>
                    <Link to="/recuperar">Olvidé mi contraseña</Link>
                </div>

            </div>
        </div>
    );
};

export default Login;