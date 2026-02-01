/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Provincia;
import com.ing2.blendy.repository.IProvinciaRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class ProvinciaService implements IProvinciaService{
    
    @Autowired
    private IProvinciaRepository provinciaRepo;

    @Override
    public void crearProvincia(Provincia p_provincia) {
        provinciaRepo.save(p_provincia);
    }

    @Override
    public Provincia buscarProvincia(int p_id_provincia) {
        return provinciaRepo.findById(p_id_provincia).orElse(null);
    }

    @Override
    public void eliminarProvincia(int p_id_provincia) {
        provinciaRepo.deleteById(p_id_provincia);
    }

    @Override
    public List<Provincia> listarProvincias() {
        return provinciaRepo.findAll();
    }
    
}
