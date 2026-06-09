import React from 'react';

const StatusSelector = ({ envio, onUpdate }) => {

    // Lógica de restricciones basada en Patrón State
    // Ajustado para coincidir con los strings exactos de tu Backend ("Pendiente", "En camino", "Entregado")
    const getSiguientesEstados = (estadoActual) => {
        switch(estadoActual) {
            case 'PENDIENTE': 
            case 'Pendiente': 
                return ['EN_CAMINO'];
            case 'EN_CAMINO': 
            case 'En camino': 
                return ['ENTREGADO'];
            default: 
                return []; // Entregado o cualquier otro caso no devuelve acciones
        }
    };

    const opciones = getSiguientesEstados(envio.estado);

    // Normalizamos el chequeo visual para congelar el select si ya fue entregado
    const estaEntregado = envio.estado === 'ENTREGADO' || envio.estado === 'Entregado';

    return (
        <div className="status-selector-container">
            {estaEntregado ? (
                <span className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#ABABAB' }}>
                    Sin acciones
                </span>
            ) : (
                <select 
                    className="select-estado"
                    // CORRECCIÓN: Usamos envio.idEnvio porque es la propiedad real de tus objetos de Java
                    onChange={(e) => onUpdate(envio.idEnvio, e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Seleccionar...</option>
                    {opciones.map(op => (
                        <option key={op} value={op}>
                            Marcar como {op.replace('_', ' ')}
                        </option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default StatusSelector;