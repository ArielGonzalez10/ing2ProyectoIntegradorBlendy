/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.MetodoPago;
import com.ing2.blendy.capaDatos.IMetodoPagoDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 * @author Fatima
 */
@Service
public class MetodoPagoNegocio implements IMetodoPagoNegocio {
    
    @Autowired
    private IMetodoPagoDatos metodoPagoDatos;

    @Override
    public void crearMetodoPago(MetodoPago p_metodoPago) {
        metodoPagoDatos.save(p_metodoPago)
;    }

    @Override
    public MetodoPago buscarMetodoPago(int p_id_metodoPago) {
        return metodoPagoDatos.findById(p_id_metodoPago).orElse(null);
    }

    @Override
    public void eliminarMetodoPago(int p_id_metodoPago) {
        metodoPagoDatos.deleteById(p_id_metodoPago);
    }

    @Override
    public List<MetodoPago> listarMetodoPagos() {
        return metodoPagoDatos.findAll();
    }

    @Override
    public void modificarMetodoPago(int p_id_metodo_pago, MetodoPago p_metodo_pago_modificado) {
        MetodoPago metodoBuscado = this.buscarMetodoPago(p_id_metodo_pago);

        if (metodoBuscado != null) {
            metodoBuscado.setDescripcion(p_metodo_pago_modificado.getDescripcion());
            metodoBuscado.setEstado(p_metodo_pago_modificado.getEstado());
            metodoPagoDatos.save(metodoBuscado);
        } else {
            throw new RuntimeException("Error: El método de pago que intenta modificar no existe.");
        }
    }
}
