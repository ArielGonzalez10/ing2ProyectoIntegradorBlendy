/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Consulta;
import com.ing2.blendy.capaDatos.IConsultaDatos;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

/**
 *
 * @author ariel
 */
@Service
public class ConsultaNegocio implements IConsultaNegocio {
    
    @Autowired
    private IConsultaDatos consultaRepo;
    
    @Override
    public void crearConsulta(Consulta p_consulta) {
        consultaRepo.save(p_consulta);
    }

    @Override
    public Consulta buscarConsulta(int p_id_consulta) {
        return consultaRepo.findById(p_id_consulta).orElse(null);
    }

    @Override
    public void eliminarConsulta(int p_id_consulta) {
        consultaRepo.deleteById(p_id_consulta);
    }

    @Override
    public List<Consulta> listarConsultas() {
        return consultaRepo.findAll();
    }
    
}
