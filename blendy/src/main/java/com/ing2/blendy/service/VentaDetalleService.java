/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.VentaDetalle;
import com.ing2.blendy.repository.IVentaDetalleRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class VentaDetalleService implements IVentaDetalleService{
    
    @Autowired
    private IVentaDetalleRepository ventaDetalleRepo;

    @Override
    public void crearVentaDetalle(VentaDetalle p_ventaDetalle) {
        ventaDetalleRepo.save(p_ventaDetalle);
    }

    @Override
    public VentaDetalle buscarVentaDetalle(int p_id_ventaDetalle) {
        return ventaDetalleRepo.findById(p_id_ventaDetalle).orElse(null);
    }

    @Override
    public void eliminarVentaDetalle(int p_id_ventaDetalle) {
        ventaDetalleRepo.deleteById(p_id_ventaDetalle);;
    }

    @Override
    public List<VentaDetalle> listarVentaDetalles() {
        return ventaDetalleRepo.findAll();
    }
    
}
