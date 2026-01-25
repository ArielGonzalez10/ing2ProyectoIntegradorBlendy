/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Localidad;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface ILocalidadService {
    public void crearLocalidad(Localidad p_localidad);
    public Localidad buscarLocalidad(int p_id_localidad);
    public void eliminarLocalidad(int p_id_localidad);
    public List<Localidad> listarLocalidades();
}
