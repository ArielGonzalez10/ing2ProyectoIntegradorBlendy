/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaModelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author ariel
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Pago {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idPago;
    private double montoPago;
    @ManyToOne
    @JoinColumn(name = "venta_cabecera_id_venta_cabecera")
    private VentaCabecera ventaCabecera;
    @ManyToOne
    @JoinColumn(name = "metodo_pago_id_metodo_pago")
    private MetodoPago metodoPago;
}
