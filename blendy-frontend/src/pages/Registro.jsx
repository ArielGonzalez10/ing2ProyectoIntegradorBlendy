import { useState } from 'react';
import api from '../api/axios';

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
        
        // Estructura exacta que funcionó en tu prueba manual
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
            // Asegúrate de que en axios.js la baseURL sea http://localhost:8080
            const response = await api.post('/usuarios/crear', usuarioParaEnviar); 
            alert("¡Registro exitoso como Cliente!");
            console.log("Datos guardados en DB:", response.data);
        } catch (error) {
            console.error("Error al registrar:", error.response?.data || error.message);
            alert("Hubo un problema con el registro. Revisa la consola (F12).");
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