package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Envio;
import java.time.LocalDate;

public class EstadoEntregado implements IEnvioEstado {
    @Override
    public void enviar(Envio p_envio, LocalDate p_fecha_despacho) {
        throw new RuntimeException("El paquete ya fue entregado, no se puede poner en pendiente !");
    }

    @Override
    public void entregar(Envio p_envio, LocalDate p_fecha_recepcion) {
        throw new RuntimeException("El paquete ya fue entregado previamente");
    }

    @Override
    public String obtenerNombreEstado() {
        return "Entregado";
    }
}