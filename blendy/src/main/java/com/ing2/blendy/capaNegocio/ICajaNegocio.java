package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Caja;

public interface ICajaNegocio {
    void cerrarCaja(String p_correo, float p_montoDeclarado, int p_id_caja);
    void crearCaja(String p_correo,float p_montoInicial);
    Caja buscarCaja(String p_correo);
    float buscarMontoInicial(int p_id_caja);
}
