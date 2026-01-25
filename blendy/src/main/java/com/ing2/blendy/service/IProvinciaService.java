/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Provincia;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IProvinciaService {
    public void crearProvincia(Provincia p_provincia);
    public Provincia buscarProvincia(int p_id_provincia);
    public void eliminarProvincia(int p_id_provincia);
    public List<Provincia> listarProvincias();
}
