/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Provincia;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IProvinciaNegocio {
    void crearProvincia(Provincia p_provincia);
    Provincia buscarProvincia(int p_id_provincia);
    void modificarProvincia(Provincia p_provincia);
    void eliminarProvincia(int p_id_provincia);
    List<Provincia> listarProvincias();
}
