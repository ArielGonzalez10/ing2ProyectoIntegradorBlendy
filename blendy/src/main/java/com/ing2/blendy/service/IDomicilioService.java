/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.service;

import com.ing2.blendy.model.Domicilio;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IDomicilioService {
    public void crearDomicilio(Domicilio p_id_domicilio);
    public Domicilio buscarDomicilio(int p_id_domicilio);
    public void eliminarDomicilio(int p_id_domicilio);
    public List<Domicilio> listarDomicilios();
}
