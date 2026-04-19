/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaDatos.IProductoDatos;
import com.ing2.blendy.capaDatos.IVentaCabeceraDatos;
import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaModelo.VentaCabecera;
import com.ing2.blendy.capaModelo.VentaDetalle;
import com.ing2.blendy.capaDatos.IVentaDetalleDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 *
 * @author ariel
 */
@Service
public class VentaDetalleNegocio implements IVentaDetalleNegocio {

    @Autowired
    private IVentaDetalleDatos ventaDetalleDatos;

    @Override
    public VentaDetalle crearVentaDetalle(VentaDetalle p_ventaDetalle) {
        return ventaDetalleDatos.save(p_ventaDetalle);
    }

    @Override
    public VentaDetalle buscarVentaDetalle(int p_id_ventaDetalle) {
        return ventaDetalleDatos.findById(p_id_ventaDetalle).orElse(null);
    }

    @Override
    public void eliminarVentaDetalle(int p_id_ventaDetalle) {
        ventaDetalleDatos.deleteById(p_id_ventaDetalle);;
    }

    @Override
    public List<VentaDetalle> listarVentaDetalles() {
        return ventaDetalleDatos.findAll();
    }
    
}
