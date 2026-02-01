/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Domicilio;
import com.ing2.blendy.repository.IDomicilioRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class DomicilioService implements IDomicilioService{
    
    @Autowired
    private IDomicilioRepository domicilioRepo;

    @Override
    public void crearDomicilio(Domicilio p_id_domicilio) {
        domicilioRepo.save(p_id_domicilio);
    }

    @Override
    public Domicilio buscarDomicilio(int p_id_domicilio) {
        return domicilioRepo.findById(p_id_domicilio).orElse(null);
    }

    @Override
    public void eliminarDomicilio(int p_id_domicilio) {
        domicilioRepo.deleteById(p_id_domicilio);
    }

    @Override
    public List<Domicilio> listarDomicilios() {
        return domicilioRepo.findAll();
    }
    
}
