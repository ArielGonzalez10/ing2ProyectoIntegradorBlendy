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
    VentaCabecera crearVenta(VentaCabecera p_ventaCabecera);
    VentaCabecera buscarVenta(int p_id_ventaCabecera);
    void eliminarVenta(int p_id_ventaCabecera);
    List<VentaCabecera> listarVenta(String p_correoElectronico);
}
