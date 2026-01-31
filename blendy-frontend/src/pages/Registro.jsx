import { useState } from 'react';
import api from '../api/axios'; // El archivo de configuración que creamos antes

const Register = () => {
    // Definimos el estado inicial según tus atributos de Java
    const [usuario, setUsuario] = useState({
        nombre: '',
        apellido: '',
        correoElectronico: '',
        contrasenia: '',
        telefono: '',
        estado: 1, // Valor por defecto
        rol: 'USER' // Ajusta según cómo manejes el enum/clase Rol
    });

    const handleChange = (e) => {
        setUsuario({
            ...usuario,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        // Concatenamos '/crear' porque así está en tu @PostMapping de Java
        const response = await api.post('/usuarios/crear', usuario); 
        alert("¡Usuario creado exitosamente!");
        console.log(response.data);
    } catch (error) {
        console.error("Error detallado:", error.response);
        alert("Error al registrar. Revisa la consola.");
    }
};

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
                        <h2 className="text-center mb-4">Registro Blendy</h2>
                        
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Nombre</label>
                                <input type="text" name="nombre" className="form-control" onChange={handleChange} required />
                            </div>
                            <div className="col-md-6 mb-3">
                                <label className="form-label">Apellido</label>
                                <input type="text" name="apellido" className="form-control" onChange={handleChange} required />
                            </div>
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Correo Electrónico</label>
                            <input type="email" name="correoElectronico" className="form-control" onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Contraseña</label>
                            <input type="password" name="contrasenia" className="form-control" onChange={handleChange} required />
                        </div>

                        <div className="mb-3">
                            <label className="form-label">Teléfono</label>
                            <input type="text" name="telefono" className="form-control" onChange={handleChange} />
                        </div>

                        <button type="submit" className="btn btn-primary w-100 py-2">Crear Cuenta</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Register;