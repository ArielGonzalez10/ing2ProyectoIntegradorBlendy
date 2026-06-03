package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Envio;

public class EstadoEntregado implements IEnvioEstado {
    @Override
    public void enviar(Envio p_envio) {
        throw new RuntimeException("Error: El paquete ya fue entregado!");
    }

    @Override
    public void entregar(Envio p_envio) {
        throw new RuntimeException("Error: El paquete ya fue entregado previamente");
    }

    @Override
    public String obtenerNombreEstado() {
        return "Entregado";
    }
}
