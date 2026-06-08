import React from 'react';

const StatusSelector = ({ envio, onUpdate }) => {

    // Lógica de restricciones basada en Patrón State
    const getSiguientesEstados = (estadoActual) => {
        switch(estadoActual) {
            case 'PENDIENTE': return ['EN_CAMINO'];
            case 'EN_CAMINO': return ['ENTREGADO'];
            default: return []; // ENTREGADO no devuelve nada
        }
    };

    const opciones = getSiguientesEstados(envio.estado);

    return (
        <div className="status-selector-container">
            {envio.estado === 'ENTREGADO' ? (
                <span className="text-muted" style={{ fontStyle: 'italic', fontSize: '0.8rem', color: '#ABABAB' }}>
                    Sin acciones
                </span>
            ) : (
                <select 
                    className="select-estado"
                    onChange={(e) => onUpdate(envio.id, e.target.value)}
                    defaultValue=""
                >
                    <option value="" disabled>Seleccionar...</option>
                    {opciones.map(op => (
                        <option key={op} value={op}>Marcar como {op.replace('_', ' ')}</option>
                    ))}
                </select>
            )}
        </div>
    );
};

export default StatusSelector;