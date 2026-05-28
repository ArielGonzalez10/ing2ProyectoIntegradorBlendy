/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaDatos.IProductoDatos;
import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaModelo.Venta;
import com.ing2.blendy.capaDatos.IVentaDatos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
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
public class VentaNegocio implements IVentaNegocio {
    
    @Autowired
    private IVentaDatos ventaDatos;

    @Autowired
    private IProductoDatos productoDatos;

    @Override
    @Transactional
    public Venta crearVenta(Venta p_venta) {

        if(p_venta.getFecha() == null) {
            p_venta.setFecha(LocalDateTime.now());
        }
        double totalCalculado = 0;

        if (p_venta.getListaVentaDetalle() != null) {
            for (VentaDetalle detalle : p_venta.getListaVentaDetalle()) {

                detalle.setVenta(p_venta);

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

        p_venta.setTotalVenta(totalCalculado);
        p_venta.setEstado(1);

        return ventaDatos.save(p_venta);
    }

    @Override
    public Venta buscarVenta(int p_id_ventaCabecera) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void eliminarVenta(int p_id_ventaCabecera) {
        Venta venta = this.buscarVenta(p_id_ventaCabecera);
        if(venta != null) {
            venta.setEstado(0);
            ventaDatos.save(venta);
        }
    }

    @Override
    public List<Venta> listarVenta(String p_correoElectronico, Date p_fecha) {
        return ventaDatos.listarVentas(p_correoElectronico,p_fecha);
    }
    
}
