package com.ing2.blendy.capaNegocio;
import com.ing2.blendy.capaModelo.Envio;
import java.time.LocalDate;

public interface IEnvioEstado {
    void enviar(Envio p_envio, LocalDate p_fecha_despacho);
    void entregar(Envio p_envio, LocalDate p_fecha_recepcion);
    String obtenerNombreEstado();
}
