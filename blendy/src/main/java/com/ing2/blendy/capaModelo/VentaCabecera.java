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
    // En tu archivo VentaCabecera.java

    @ManyToOne(cascade = CascadeType.MERGE) // <-- AGREGA ESTO
    @JoinColumn(name = "usuario_id_usuario") // Asegurate que el nombre coincida con tu BD
    private Usuario usuario;
    //Indica que atributo es el dueño de la relación e indica que tabla va a tener la FK
    @OneToMany(mappedBy = "ventaCabecera", cascade = CascadeType.ALL)
    @JsonManagedReference
    private List<VentaDetalle> listaVentaDetalle;
}
