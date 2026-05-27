/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */

package com.ing2.blendy.capaModelo;

import jakarta.persistence.*;
import java.time.LocalDateTime;
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

    @ManyToOne
    @JoinColumn(name = "usuario_id_usuario")
    private Usuario usuario;
}