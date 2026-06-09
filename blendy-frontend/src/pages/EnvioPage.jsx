import { useState, useEffect } from 'react';
import EnvioTable from './EnvioTable';
// Importamos las dos funciones de tu API
import { listarTodosEnvios, modificarEnvio } from '../api/envios'; 

import '../styles/panel.css';
import '../styles/envios.css';

const EnvioPage = () => {
    const [envios, setEnvios] = useState([]);
    const [loading, setLoading] = useState(true);

    const cargarEnvios = () => {
        setLoading(true);
        listarTodosEnvios()
            .then(res => {
                setEnvios(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error("No hay envios.", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        cargarEnvios();
    }, []);

    // El método ahora usa tu función limpia del servicio de API
    const handleCambiarEstado = (idEnvio, nuevoEstadoDesdeSelector) => {
        console.log(`Ejecutando cambio para Envío ID: ${idEnvio} -> Estado solicitado: ${nuevoEstadoDesdeSelector}`);
        
        const fechaHoy = new Date().toISOString().split('T')[0]; // Genera YYYY-MM-DD
        let fechaDespacho = null;
        let fechaRecepcion = null;

        if (nuevoEstadoDesdeSelector === 'EN_CAMINO') {
            fechaDespacho = fechaHoy;
        } else if (nuevoEstadoDesdeSelector === 'ENTREGADO') {
            fechaRecepcion = fechaHoy;
        }

        // Llamamos a la función modularizada igual que hiciste con listar
        modificarEnvio(idEnvio, fechaDespacho, fechaRecepcion)
            .then(() => {
                alert("¡Estado del envío actualizado con éxito !");
                cargarEnvios(); // Refrescamos la tabla con los datos mutados por el patrón State
            })
            .catch(err => {
                console.error("", err);
                const msg = err.response?.data?.message || "Error al conectar con el servidor.";
                alert("" + msg);
            });
    };

    if (loading) return <p>Cargando envíos de Blendly...</p>;

    return (
        <div className="admin-page">
            <div className="admin-container">
                <div className="admin-header-row">
                    <div className="admin-title">
                        <h1>Gestión de Envíos</h1>
                        <p>Supervisa el estado y flujo logístico de los pedidos.</p>
                    </div>
                </div>

                <div className="table-responsive">
                    <EnvioTable envios={envios} onUpdateEstado={handleCambiarEstado} />
                </div>
            </div>
        </div>
    );
};

export default EnvioPage;