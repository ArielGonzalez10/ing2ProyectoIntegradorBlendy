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

import java.util.List;

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
public class Usuario {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idUsuario;

    @Column(name="nombre")
    private String nombre;

    @Column(name="apellido")
    private String apellido;

    @Column(name="correo_electronico")
    private String correoElectronico;

    @Column(name="contrasenia")
    private String contrasenia;

    @Column(name="estado")
    private String estado;

    private String telefono;
    //Mapped by indica que la relación ya fue mapeado por domicilios y cascade crea el domicilio
    @OneToMany(mappedBy = "usuario", cascade = CascadeType.ALL)
    @JsonIgnoreProperties("usuario")
    private List<Domicilio> domicilios;

    @Transient
    private String rol;

    @Column(name="fk_id_rol")
    private int idRol;
}
