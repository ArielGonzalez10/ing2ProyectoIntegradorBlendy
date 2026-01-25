/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.VentaCabecera;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IVentaCabeceraService {
    public void crearVentaCabecera(VentaCabecera p_ventaCabecera);
    public VentaCabecera buscarVentaCabecera(int p_id_ventaCabecera);
    public void eliminarVentaCabecera(int p_id_ventaCabecera);
    public List<VentaCabecera> listarVentaCabeceras();
}
