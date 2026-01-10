/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.model;

import jakarta.persistence.Entity;
import java.time.LocalDate;
import java.util.List;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author ariel
 */
@Getter
@Setter
@Entity
public class VentaCabecera {
    private int idVentaCabecera;
    private LocalDate fecha;
    private double totalVenta;
    private Usuario usuario;
    private Domicilio domicilio;
    private List<VentaDetalle> listaVentaDetalle;
}
