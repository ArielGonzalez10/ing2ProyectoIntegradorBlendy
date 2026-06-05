/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaModelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import jakarta.persistence.*;

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
public class Consulta {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idConsulta;

    private String mensaje;

    private String asunto;

    private String respuesta;

    private String estado;

    @ManyToOne
    @JoinColumn(name = "fk_id_usuario")
    private Usuario usuario;
}
