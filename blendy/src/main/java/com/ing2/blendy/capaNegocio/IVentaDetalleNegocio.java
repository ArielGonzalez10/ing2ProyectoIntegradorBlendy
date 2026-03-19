/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.VentaDetalle;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IVentaDetalleNegocio {
    void crearVentaDetalle(VentaDetalle p_ventaDetalle);
    VentaDetalle buscarVentaDetalle(int p_id_ventaDetalle);
    void eliminarVentaDetalle(int p_id_ventaDetalle);
    List<VentaDetalle> listarVentaDetalles();
}
