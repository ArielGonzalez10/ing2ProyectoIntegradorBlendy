package com.ing2.blendy.capaNegocio;
import com.ing2.blendy.capaModelo.Envio;
import java.time.LocalDate;

public class EstadoPendiente implements IEnvioEstado {
    @Override
    public void enviar(Envio p_envio, LocalDate p_fecha_despacho) {
        p_envio.setFechaDespacho(p_fecha_despacho);

        // En vez de "En camino", creás el estado que sigue y le pedís el nombre
        IEnvioEstado proximoEstado = new EstadoEnCamino();
        p_envio.setEstado(proximoEstado.obtenerNombreEstado());
    }

    @Override
    public void entregar(Envio p_envio, LocalDate p_fecha_recepcion) {
        throw new RuntimeException("No se puede entregar, ya que todavia no se despachó");
    }

    @Override
    public String obtenerNombreEstado() {
        return "Pendiente";
    }
}