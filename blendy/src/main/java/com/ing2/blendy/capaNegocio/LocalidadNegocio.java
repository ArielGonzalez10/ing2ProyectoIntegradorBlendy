/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Localidad;
import com.ing2.blendy.capaDatos.ILocalidadDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class LocalidadNegocio implements ILocalidadNegocio {
    
    @Autowired
    private ILocalidadDatos localidadRepo;

    @Override
    public void crearLocalidad(Localidad p_localidad) {
        localidadRepo.save(p_localidad);
    }

    @Override
    public Localidad buscarLocalidad(int p_id_localidad) {
        return localidadRepo.findById(p_id_localidad).orElse(null);
    }

    @Override
    public void eliminarLocalidad(int p_id_localidad) {
        localidadRepo.deleteById(p_id_localidad);
    }

    @Override
    public List<Localidad> listarLocalidades() {
        return localidadRepo.findAll();
    }
    
}
