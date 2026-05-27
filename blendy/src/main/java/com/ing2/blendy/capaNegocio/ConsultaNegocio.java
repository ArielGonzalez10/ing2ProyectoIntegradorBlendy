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
 * @author Fatima
 */
@Service
public class ConsultaNegocio implements IConsultaNegocio {
    
    @Autowired
    private IConsultaDatos consultaDatos;
    
    @Override
    public void crearConsulta(Consulta p_consulta) {
        p_consulta.setEstado(0);
        consultaDatos.save(p_consulta);
    }

    @Override
    public Consulta buscarConsulta(int p_id_consulta) {
        return consultaDatos.findById(p_id_consulta).orElse(null);
    }

    @Override
    public void eliminarConsulta(int p_id_consulta) {
        consultaDatos.deleteById(p_id_consulta);
    }

    @Override
    public List<Consulta> listarConsultas() {
        return consultaDatos.findAll();
    }

    @Override
    public void responderConsulta(int p_id_consulta, String p_respuesta) {
        Consulta consultaBuscada = this.buscarConsulta(p_id_consulta);

        if(consultaBuscada != null) {
            consultaBuscada.setRespuesta(p_respuesta);
            consultaBuscada.setEstado(1);
            consultaDatos.save(consultaBuscada);
        } else {
            throw new RuntimeException("Error: La consulta que intenta responder no existe.");
        }
    }
}
