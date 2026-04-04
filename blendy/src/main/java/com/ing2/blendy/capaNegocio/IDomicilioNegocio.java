/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Domicilio;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IDomicilioNegocio {
    void crearDomicilio(Domicilio p_id_domicilio);
    Domicilio buscarDomicilioPorUsuario(int p_id_usuario);
    void eliminarDomicilio(int p_id_domicilio);
    List<Domicilio> listarDomicilios(String p_correoElectronico);
}
