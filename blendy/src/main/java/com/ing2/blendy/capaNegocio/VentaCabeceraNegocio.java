/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.VentaCabecera;
import com.ing2.blendy.capaDatos.IVentaCabeceraDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class VentaCabeceraNegocio implements IVentaCabeceraNegocio {
    
    @Autowired
    private IVentaCabeceraDatos ventaCabeceraDatos;

    @Override
    public VentaCabecera crearVentaCabecera(VentaCabecera p_ventaCabecera) {
        return ventaCabeceraDatos.save(p_ventaCabecera);
    }

    @Override
    public VentaCabecera buscarVentaCabecera(int p_id_ventaCabecera) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public void eliminarVentaCabecera(int p_id_ventaCabecera) {
        throw new UnsupportedOperationException("Not supported yet."); // Generated from nbfs://nbhost/SystemFileSystem/Templates/Classes/Code/GeneratedMethodBody
    }

    @Override
    public List<VentaCabecera> listarVentaCabeceras(String p_correoElectronico) {
        return ventaCabeceraDatos.listarVentas(p_correoElectronico);
    }
    
}
