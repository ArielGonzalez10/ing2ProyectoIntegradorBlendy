/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.MetodoPago;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IMetodoPagoService {
    public void crearMetodoPago(MetodoPago p_metodoPago);
    public MetodoPago buscarMetodoPago(int p_id_metodoPago);
    public void eliminarMetodoPago(int p_id_metodoPago);
    public List<MetodoPago> listarMetodoPagos();
}
