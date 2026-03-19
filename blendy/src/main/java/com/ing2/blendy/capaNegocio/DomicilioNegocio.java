/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Domicilio;
import com.ing2.blendy.capaDatos.IDomicilioDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class DomicilioNegocio implements IDomicilioNegocio {
    
    @Autowired
    private IDomicilioDatos domicilioRepo;

    @Override
    public void crearDomicilio(Domicilio p_id_domicilio) {
        domicilioRepo.save(p_id_domicilio);
    }

    @Override
    public Domicilio buscarDomicilioPorUsuario(int p_id_usuario) {
        return domicilioRepo.findById(p_id_usuario).orElse(null);
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
