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
 * @author Fatima
 */
public interface IDomicilioNegocio {
    void crearDomicilio(Domicilio p_id_domicilio);
    Domicilio buscarDomicilio(int p_id_domicilio);

    void eliminarDomicilio(int p_id_domicilio);
    List<Domicilio> listarDomicilios(String p_correoElectronico);

    List<String> listarProvincias();
    List<String> listarLocalidades(String p_provincia);
    List<Integer> listarCP(String p_localidad);
}
