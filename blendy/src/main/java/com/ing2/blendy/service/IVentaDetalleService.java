/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.VentaDetalle;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IVentaDetalleService {
    public void crearVentaDetalle(VentaDetalle p_ventaDetalle);
    public VentaDetalle buscarVentaDetalle(int p_id_ventaDetalle);
    public void eliminarVentaDetalle(int p_id_ventaDetalle);
    public List<VentaDetalle> listarVentaDetalles();
}
