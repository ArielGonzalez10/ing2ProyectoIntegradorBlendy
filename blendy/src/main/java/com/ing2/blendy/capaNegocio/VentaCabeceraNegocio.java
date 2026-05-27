/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaDatos.IProductoDatos;
import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaModelo.VentaCabecera;
import com.ing2.blendy.capaDatos.IVentaCabeceraDatos;

import java.time.LocalDate;
import java.util.List;

import com.ing2.blendy.capaModelo.VentaDetalle;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class VentaCabeceraNegocio implements IVentaCabeceraNegocio {
    
    @Autowired
    private IVentaCabeceraDatos ventaCabeceraDatos;

    @Autowired
    private IProductoDatos productoDatos;

    @Override
    @Transactional
    public VentaCabecera crearVenta(VentaCabecera p_ventaCabecera) {

        if(p_ventaCabecera.getFecha() == null) {
            p_ventaCabecera.setFecha(LocalDate.now());
        }
        double totalCalculado = 0;

        if (p_ventaCabecera.getListaVentaDetalle() != null) {
            for (VentaDetalle detalle : p_ventaCabecera.getListaVentaDetalle()) {

                detalle.setVentaCabecera(p_ventaCabecera);

                Producto productoReal = productoDatos.findById(detalle.getProducto().getIdProducto())
                        .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

                if(productoReal.getStock() < detalle.getCantidad()) {
                    throw new RuntimeException("Stock insuficiente para: " + productoReal.getDescripcion());
                }

                productoReal.setStock(productoReal.getStock() - detalle.getCantidad());

                detalle.setPrecioHistorico(productoReal.getPrecioUnitario());
                detalle.setTotal(detalle.getCantidad() * productoReal.getPrecioUnitario());

                totalCalculado += detalle.getTotal();
            }
        }

        p_ventaCabecera.setTotalVenta(totalCalculado);
        p_ventaCabecera.setEstado(1);

        return ventaCabeceraDatos.save(p_ventaCabecera);
    }

    @Override
    public VentaCabecera buscarVenta(int p_id_ventaCabecera) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void eliminarVenta(int p_id_ventaCabecera) {
        VentaCabecera venta = this.buscarVenta(p_id_ventaCabecera);
        if(venta != null) {
            venta.setEstado(0);
            ventaCabeceraDatos.save(venta);
        }
    }

    @Override
    public List<VentaCabecera> listarVenta(String p_correoElectronico) {
        return ventaCabeceraDatos.listarVentas(p_correoElectronico);
    }
    
}
