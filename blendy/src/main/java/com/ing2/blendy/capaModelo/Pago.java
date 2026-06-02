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

import java.time.LocalDate;

/**
 *
 * @author ariel
 * @author Fatima
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

    @Column(name="monto_pago")
    private float montoPago;

    @Column(name="fecha_pago")
    private LocalDate fechaPago;

    @Transient
    private String metodoPago;

    @Column(name="fk_id_metodo_pago")
    private int idMetodoPago;
}
