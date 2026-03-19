/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Consulta;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IConsultaNegocio {
    void crearConsulta(Consulta p_consulta);
    Consulta buscarConsulta(int p_id_consulta);
    void eliminarConsulta(int p_id_consulta);
    List<Consulta> listarConsultas();
}
