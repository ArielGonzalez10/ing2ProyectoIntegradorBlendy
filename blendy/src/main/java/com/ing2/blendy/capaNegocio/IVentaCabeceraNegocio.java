/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.VentaCabecera;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IVentaCabeceraNegocio {
    void crearVentaCabecera(VentaCabecera p_ventaCabecera);
    VentaCabecera buscarVentaCabecera(int p_id_ventaCabecera);
    void eliminarVentaCabecera(int p_id_ventaCabecera);
    List<VentaCabecera> listarVentaCabeceras();
}
