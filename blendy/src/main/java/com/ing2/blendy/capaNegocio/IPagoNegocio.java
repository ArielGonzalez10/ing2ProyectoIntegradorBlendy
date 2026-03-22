/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Pago;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IPagoNegocio {
    void crearPago(Pago p_pago);
    Pago buscarPago(int p_id_pago);
    void eliminarPago(int p_id_pago);
    void modificarPago(Pago p_pago);
    List<Pago> listarPagos();
}
