/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Pago;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IPagoService {
    public void crearPago(Pago p_pago);
    public Pago buscarPago(int p_id_pago);
    public void eliminarPago(int p_id_pago);
    public List<Pago> listarPagos();
}
