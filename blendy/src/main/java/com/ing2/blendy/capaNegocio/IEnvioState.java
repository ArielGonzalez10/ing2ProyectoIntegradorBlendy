package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Envio;

public interface IEnvioState {
    void enviar(Envio p_envio);
    void entregar(Envio p_envio);
    String obtenerNombreEstado();
}
