/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */
package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Venta;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

/**
 *
 * @author ariel
 */
public interface IVentaNegocio {
    Venta crearVenta(Venta p_venta);
    Venta buscarVenta(int p_id_venta);
    List<Venta> listarVenta(String p_correoElectronico, LocalDate p_fecha);
    void registrarFechaVenta(Venta p_venta);
}
