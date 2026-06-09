import '../styles/envios.css';
import StatusSelector from './StatusSelector';

const EnvioTable = ({ envios, onUpdateEstado }) => {
    
    // VALIDACIÓN IMPORTANTE: Evita que falle el .map si la respuesta del backend tiene problemas
    if (!envios || !Array.isArray(envios) || envios.length === 0) {
        return (
            <div style={{ color: '#fff', padding: '20px', textAlign: 'center' }}>
                No hay envíos registrados.
            </div>
        );
    }

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
                {envios.map((envio) => {
                    // 1. Navegamos las relaciones reales de tus clases Java
                    const venta = envio.venta;
                    const cliente = venta?.usuario;
                    // Como un usuario tiene una lista de domicilios, tomamos el primero
                    const primerDomicilio = cliente?.domicilios?.[0]; 

                    // 2. Adaptamos los textos al formato que maneja tu Backend ("Pendiente", "En camino", "Entregado")
                    const estadoFormateado = envio.estado; // Ej: "En camino"
                    const estadoUpper = envio.estado ? envio.estado.toUpperCase().replace(" ", "_") : ""; // Ej: "EN_CAMINO"

                    return (
                        <tr key={envio.idEnvio}>
                            {/* Tu backend usa idEnvio */}
                            <td>#{envio.idEnvio}</td>
                            
                            {/* Obtenemos el apellido y nombre desde el objeto cliente (Usuario) */}
                            <td className="td-nombre">
                                {cliente ? `${cliente.apellido}, ${cliente.nombre}` : "Sin Cliente"}
                            </td>
                            
                            {/* Obtenemos el correo electrónico */}
                            <td>{cliente?.correoElectronico || "N/A"}</td>
                            
                            {/* Obtenemos la calle y la altura combinados */}
                            <td>
                                {primerDomicilio ? `${primerDomicilio.calle} ${primerDomicilio.altura}` : "No especificada"}
                            </td>
                            
                            {/* Corregimos las condiciones de los badges según los Strings de tu BD */}
                            <td>
                                <span className={`badge-estado ${
                                    estadoFormateado === 'Pendiente' ? 'badge-inactivo' : 
                                    estadoFormateado === 'En camino' ? 'badge-activo' : 'badge-activo'
                                }`}>
                                    {estadoUpper}
                                </span>
                            </td>
                            
                            {/* Enviamos el objeto con el formato adaptado a tu StatusSelector */}
                            <td>
                                <StatusSelector 
                                    envio={{ idEnvio: envio.idEnvio, estado: estadoUpper }} 
                                    onUpdate={onUpdateEstado} 
                                />
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default EnvioTable;