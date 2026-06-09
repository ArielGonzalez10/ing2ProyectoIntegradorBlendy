package com.ing2.blendy.capaNegocio;
import com.ing2.blendy.capaModelo.Envio;
import java.time.LocalDate;

public class EstadoEnCamino implements IEnvioEstado {
    @Override
    public void enviar(Envio p_envio, LocalDate p_fecha_despacho) {
        throw new RuntimeException("No se puede enviar, El paquete ya se encuentra en camino");
    }

    @Override
    public void entregar(Envio p_envio, LocalDate p_fecha_recepcion) {
        if(p_envio.getFechaDespacho() != null && p_fecha_recepcion.isBefore(p_envio.getFechaDespacho())){
            throw new RuntimeException("La fecha de recepción debe ser mayor o igual a la fecha de despacho");
        }
        p_envio.setFechaRecepcion(p_fecha_recepcion);

        // En vez de "Entregado", usás el método del nuevo estado
        IEnvioEstado proximoEstado = new EstadoEntregado();
        p_envio.setEstado(proximoEstado.obtenerNombreEstado());
    }

    @Override
    public String obtenerNombreEstado() {
        return "En camino";
    }
}