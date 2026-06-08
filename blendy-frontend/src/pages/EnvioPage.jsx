import { useState, useEffect } from 'react';
import EnvioTable from './EnvioTable';
import { MOCK_ENVIOS } from '../data/mockEnvios'; // archivo de datos de prueba
import '../styles/panel.css';
import '../styles/envios.css';

const EnvioPage = () => {
    const [envios, setEnvios] = useState(MOCK_ENVIOS); // Inicia con los datos ficticios
    const [loading, setLoading] = useState(false);
  
    // Descomenta lo de abajo y borra lo de arriba para usar la API real
    /*                                                                                      
    const [envios, setEnvios] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/envios')
        .then(res => res.json())
        .then(data => {
            setEnvios(data);
            setLoading(false);
        });
    }, []);                                             
    */

    // recibe el ID y el nuevo estado desde el StatusSelector
    const handleCambiarEstado = (id, nuevoEstado) => {
        console.log(`Cambiando pedido ${id} a estado: ${nuevoEstado}`);
        
        // Simulación en el frontend de cómo el Patrón State cambia el estado:
        const enviosActualizados = envios.map(envio => 
            envio.id === id ? { ...envio, estado: nuevoEstado } : envio
        );
        setEnvios(enviosActualizados);
    };

    if (loading) return <p>Cargando envíos...</p>;

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