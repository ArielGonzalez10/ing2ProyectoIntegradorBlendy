/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaModelo;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
public class VentaCabecera {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idVentaCabecera;
    private LocalDate fecha;
    private double totalVenta;
    private int estado;

    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(name = "usuario_id_usuario")
    private Usuario usuario;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "envio_id_envio")
    private Envio envio;

    @OneToMany(mappedBy = "ventaCabecera", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<VentaDetalle> listaVentaDetalle;

    @ManyToOne
    @JoinColumn(name = "cierre_turno_id_cierre")
    private CierreTurno cierreTurno;
}
