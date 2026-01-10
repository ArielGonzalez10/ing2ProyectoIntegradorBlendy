/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.model;

import jakarta.persistence.Entity;
import lombok.Getter;
import lombok.Setter;

/**
 *
 * @author ariel
 */
@Getter
@Setter
@Entity
public class Consulta {
    //Atributos
    private int idConsulta;
    private String descripcion;
    private String asunto;
    private String respuesta;
    private int estado;
    private Usuario usuario;
}
