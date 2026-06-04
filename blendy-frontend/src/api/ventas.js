import api from "./axios.js";

/**
 * Envía la cabecera de la venta, pago, envío y la lista transitoria de productos
 * para que el backend procese todo en una sola transacción unificada.
 */
export function crearVenta(data) {
    return api.post("/ventas/crear", data);
}

/**
 * Recupera el historial de compras filtrado por el correo del usuario actual y la fecha.
 */
export function listarVentas(p_correoElectronico, p_fecha) {
    return api.get("/ventas/listar", {
        params: { 
            p_correoElectronico, 
            p_fecha              
        }
    });
}