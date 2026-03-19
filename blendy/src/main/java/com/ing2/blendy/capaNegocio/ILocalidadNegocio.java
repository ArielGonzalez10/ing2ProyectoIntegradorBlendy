/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Localidad;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface ILocalidadNegocio {
    void crearLocalidad(Localidad p_localidad);
    Localidad buscarLocalidad(int p_id_localidad);
    void eliminarLocalidad(int p_id_localidad);
    List<Localidad> listarLocalidades();
}
