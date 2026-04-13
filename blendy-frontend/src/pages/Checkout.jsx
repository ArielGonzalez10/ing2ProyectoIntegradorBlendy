import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, clearCart } = useCart();
    
    if (cartItems.length === 0) {
        navigate('/tienda');
    }

    const subtotal = cartItems.reduce((acc, item) => acc + (item.precioUnitario * item.cantidad), 0);
    const costoEnvio = 2500;
    const total = subtotal + costoEnvio;

    // SIMULACIÓN 
    const direccionesGuardadas = [
        { id: 1, alias: "Mi Casa", calle: "San Martín 1234", ciudad: "Corrientes Capital", cp: "3400" }
    ];

    // FORMULARIO 
    const [direccionSeleccionada, setDireccionSeleccionada] = useState("1");
    const [metodoPago, setMetodoPago] = useState("transferencia");

    // Estado para nueva dirección ("nueva")
    const [nuevaDireccion, setNuevaDireccion] = useState({
        calle: '', ciudad: '', cp: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        
        const datosVenta = {
            total: total,
            idDomicilio: direccionSeleccionada === "nueva" ? null : direccionSeleccionada,
            domicilioNuevo: direccionSeleccionada === "nueva" ? nuevaDireccion : null,
            metodoPago: metodoPago,
            detalles: cartItems
        };

        console.log("Enviando al backend:", datosVenta);
        
        // ID ej. 1050
        const idGeneradoPorBackend = 1050; 
        navigate(`/confirmacion/${idGeneradoPorBackend}`);
    };

    return (
        <div className="checkout-page">
            <h1>Finalizar Compra</h1>

            <form className="checkout-layout" onSubmit={handleSubmit}>
                
                {/* DATOS */}
                <div className="checkout-formularios">
                    
                    {/* DIRECCIÓN DE ENVÍO */}
                    <div className="checkout-seccion">
                        <h2><span className="checkout-numero-paso">1</span> Entrega</h2>
                        
                        <div className="opcion-radio-group">
                            {/* Opciones del Perfil */}
                            {direccionesGuardadas.map(dir => (
                                <label key={dir.id} className={`opcion-radio ${direccionSeleccionada === String(dir.id) ? 'seleccionada' : ''}`}>
                                    <input 
                                        type="radio" 
                                        name="direccion" 
                                        value={dir.id} 
                                        checked={direccionSeleccionada === String(dir.id)}
                                        onChange={(e) => setDireccionSeleccionada(e.target.value)}
                                    />
                                    <div className="opcion-info">
                                        <h4>{dir.alias}</h4>
                                        <p>{dir.calle}, {dir.ciudad} (CP: {dir.cp})</p>
                                    </div>
                                </label>
                            ))}

                            {/* Opción Nueva Dirección */}
                            <label className={`opcion-radio ${direccionSeleccionada === "nueva" ? 'seleccionada' : ''}`}>
                                <input 
                                    type="radio" 
                                    name="direccion" 
                                    value="nueva" 
                                    checked={direccionSeleccionada === "nueva"}
                                    onChange={(e) => setDireccionSeleccionada(e.target.value)}
                                />
                                <div className="opcion-info">
                                    <h4>Enviar a otra dirección</h4>
                                    <p>Ingresar nuevos datos de entrega</p>
                                </div>
                            </label>
                        </div>

                        {/* Formulario que solo aparece si elige "Nueva" */}
                        {direccionSeleccionada === "nueva" && (
                            <div className="formulario-nuevo">
                                <div className="form-group">
                                    <label>Calle y Altura *</label>
                                    <input 
                                        type="text" 
                                        placeholder="Ej: Junín 850" 
                                        required 
                                        value={nuevaDireccion.calle}
                                        onChange={(e) => setNuevaDireccion({...nuevaDireccion, calle: e.target.value})}
                                    />
                                </div>
                                <div className="form-row">
                                    <div className="form-group" style={{ flex: 2 }}>
                                        <label>Ciudad *</label>
                                        <input 
                                            type="text" 
                                            value={nuevaDireccion.ciudad}
                                            onChange={(e) => setNuevaDireccion({...nuevaDireccion, ciudad: e.target.value})}
                                            required 
                                        />
                                    </div>
                                    <div className="form-group" style={{ flex: 1 }}>
                                        <label>Código Postal *</label>
                                        <input 
                                            type="text" 
                                            value={nuevaDireccion.cp}
                                            onChange={(e) => setNuevaDireccion({...nuevaDireccion, cp: e.target.value})}
                                            required 
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* MÉTODO DE PAGO */}
                    <div className="checkout-seccion">
                        <h2><span className="checkout-numero-paso">2</span> Pago</h2>
                        
                        <div className="opcion-radio-group">
                            <label className={`opcion-radio ${metodoPago === "transferencia" ? 'seleccionada' : ''}`}>
                                <input 
                                    type="radio" name="pago" value="transferencia" 
                                    checked={metodoPago === "transferencia"}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                />
                                <div className="opcion-info">
                                    <h4>Transferencia Bancaria</h4>
                                    <p>5% de descuento adicional</p>
                                </div>
                            </label>
                            
                            <label className={`opcion-radio ${metodoPago === "mercadopago" ? 'seleccionada' : ''}`}>
                                <input 
                                    type="radio" name="pago" value="mercadopago" 
                                    checked={metodoPago === "mercadopago"}
                                    onChange={(e) => setMetodoPago(e.target.value)}
                                />
                                <div className="opcion-info">
                                    <h4>MercadoPago / Tarjetas</h4>
                                    <p>Débito y Crédito hasta 3 cuotas</p>
                                </div>
                            </label>
                        </div>
                    </div>
                </div>

                {/* RESUMEN */}
                <div className="carrito-resumen" style={{ height: 'fit-content', position: 'sticky', top: '100px' }}>
                    <h3>Tu pedido</h3>
                    
                    <div style={{ marginBottom: '20px', borderBottom: '1px solid #1F1F1F', paddingBottom: '15px' }}>
                        {cartItems.map(item => (
                            <div key={item.idProducto} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '0.9rem', color: 'var(--color-texto)' }}>
                                <span>{item.cantidad}x {item.descripcion}</span>
                                <span>${(item.precioUnitario * item.cantidad).toLocaleString('es-AR')}</span>
                            </div>
                        ))}
                    </div>

                    <div className="resumen-linea"><span>Subtotal</span><span>${subtotal.toLocaleString('es-AR')}</span></div>
                    <div className="resumen-linea"><span>Envío</span><span>${costoEnvio.toLocaleString('es-AR')}</span></div>
                    
                    <div className="resumen-total">
                        <span>Total a pagar</span>
                        <span style={{ color: 'var(--color-celeste)' }}>${total.toLocaleString('es-AR')}</span>
                    </div>

                    <button type="submit" className="btn-blendy btn-enfasis btn-pill w-100" style={{ marginTop: '30px' }}>
                        Confirmar y Pagar
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Checkout;