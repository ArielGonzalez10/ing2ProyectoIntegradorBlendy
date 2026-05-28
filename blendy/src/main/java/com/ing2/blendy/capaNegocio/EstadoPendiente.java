package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Envio;

import java.time.LocalDate;

public class EstadoPendiente implements IEnvioState{
    @Override
    public void enviar(Envio p_envio) {
        p_envio.setFechaDespacho(LocalDate.now());
        p_envio.setEstado("En camino");
        System.out.println("El paquete está en camino");
    }

    @Override
    public void entregar(Envio p_envio) {
        throw new RuntimeException("No se puede entregar, ya que todavia no se despachó");

    }

    @Override
    public String obtenerNombreEstado() {
        return "Pendiente";
    }
}
