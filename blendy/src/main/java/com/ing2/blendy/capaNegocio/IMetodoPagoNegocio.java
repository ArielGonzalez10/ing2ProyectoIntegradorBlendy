/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.MetodoPago;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IMetodoPagoNegocio {
    void crearMetodoPago(MetodoPago p_metodoPago);
    MetodoPago buscarMetodoPago(int p_id_metodoPago);
    void eliminarMetodoPago(int p_id_metodoPago);
    List<MetodoPago> listarMetodoPagos();
}
