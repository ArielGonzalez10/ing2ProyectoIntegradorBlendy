/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Consulta;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IConsultaService {
    public void crearConsulta(Consulta p_consulta);
    public Consulta buscarConsulta(int p_id_consulta);
    public void eliminarConsulta(int p_id_consulta);
    public List<Consulta> listarConsultas();
}
