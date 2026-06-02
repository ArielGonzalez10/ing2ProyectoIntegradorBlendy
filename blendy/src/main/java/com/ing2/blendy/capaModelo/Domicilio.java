/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaModelo;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
public class Domicilio {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idDomicilio;

    @Column(name="calle")
    private String calle;

    @Column(name="altura")
    private int altura;

    @Column(name="estado")
    private String estado;

    @Transient
    private String provincia;

    @Transient
    private String localidad;

    @ManyToOne
    @JoinColumn(name = "fk_id_usuario")
    private Usuario usuario;

    @Column(name="fk_id_localidad")
    private int idLocalidad;
}
