/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.ing2.blendy.capaModelo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 *
 * @author Fatima
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class CierreTurno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int idCierre;
    private LocalDateTime fechaHoraApertura;
    private LocalDateTime fechaHoraCierre;
    private double montoInicial;
    private double montoDeclarado;
    private double montoCalculado;
    private double diferencia;
    private int estado;

    @OneToMany
    @JoinColumn(name = "FK_id_cierre_turno")
    private List<Venta> ventas;
}