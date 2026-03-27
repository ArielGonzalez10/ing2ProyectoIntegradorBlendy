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

import java.util.List;

/**
 *
 * @author ariel
 */
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Usuario {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idUsuario;
    private String nombre;
    private String apellido;
    private String correoElectronico;
    private String contrasenia;
    private int estado;
    private String telefono;
    //Mapped by indica que la relación ya fue mapeado por domicilios y cascade crea el domicilio
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    private List<Domicilio> domicilios;
    @ManyToOne
    private Rol rol;
}
