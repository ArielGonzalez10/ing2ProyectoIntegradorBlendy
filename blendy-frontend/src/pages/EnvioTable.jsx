import '../styles/envios.css';
import StatusSelector from './StatusSelector';

const EnvioTable = ({ envios, onUpdateEstado }) => {
    return (
        <table className="admin-table">
            <thead>
                <tr>
                    <th>Pedido</th>
                    <th>Cliente</th>
                    <th>Correo</th>
                    <th>Dirección</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                </tr>
            </thead>
            <tbody>
                {envios.map((envio) => (
                    <tr key={envio.id}>
                        <td>#{envio.id}</td>
                        <td className="td-nombre">{envio.apellido}, {envio.nombre}</td>
                        <td>{envio.correo}</td>
                        <td>{envio.direccion}</td>
                        <td>
                            <span className={`badge-estado ${
                                envio.estado === 'PENDIENTE' ? 'badge-inactivo' : 
                                envio.estado === 'EN_CAMINO' ? 'badge-activo' : 'badge-activo'
                            }`}>
                                {envio.estado}
                            </span>
                        </td>
                        <td>
                            <StatusSelector 
                                envio={envio} 
                                onUpdate={onUpdateEstado} 
                            />
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default EnvioTable;
