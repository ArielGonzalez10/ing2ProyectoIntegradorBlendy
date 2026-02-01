/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Localidad;
import com.ing2.blendy.repository.ILocalidadRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;

/**
 *
 * @author ariel
 */
public class LocalidadService implements ILocalidadService{
    
    @Autowired
    private ILocalidadRepository localidadRepo;

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
