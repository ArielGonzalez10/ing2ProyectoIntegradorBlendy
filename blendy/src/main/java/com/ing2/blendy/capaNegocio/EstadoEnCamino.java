package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Envio;

import java.time.LocalDate;

public class EstadoEnCamino implements IEnvioEstado {
    @Override
    public void enviar(Envio p_envio) {
        throw new RuntimeException("No se puede enviar, El paquete ya se encuentra en camino");
    }

    @Override
    public void entregar(Envio p_envio) {
        LocalDate fechaHoy = LocalDate.now();
        if(p_envio.getFechaDespacho()!= null && fechaHoy.isBefore(p_envio.getFechaDespacho())){
            throw new RuntimeException("Error: La fecha de recepción debe ser mayor o igual a la fecha de despacho");
        }
        p_envio.setFechaRecepcion(fechaHoy);
        p_envio.setEstado("Entregado");
    }

    @Override
    public String obtenerNombreEstado() {
        return "En camino";
    }
}
