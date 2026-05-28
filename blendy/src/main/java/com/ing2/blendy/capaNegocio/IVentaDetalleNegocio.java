package com.ing2.blendy.capaNegocio;
import com.ing2.blendy.capaModelo.VentaDetalle;


import java.util.List;

/*
@author ariel
*/
  public interface IVentaDetalleNegocio {
    VentaDetalle crearVentaDetalle(VentaDetalle p_ventaDetalle);
     VentaDetalle buscarVentaDetalle(int p_id_ventaDetalle);
    void eliminarVentaDetalle(int p_id_ventaDetalle);
    List<VentaDetalle> listarVentaDetalles();
  }
