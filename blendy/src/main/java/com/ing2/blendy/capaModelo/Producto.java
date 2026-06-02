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

import java.util.ArrayList;
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
public class Producto {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name="id_producto")
    private int idProducto;

    private String descripcion;

    private int stock;

    private String estado;

    @Column(name="stock_min")
    private int stockMin;

    @Column(name="precio_unitario")
    private float precioUnitario;

    @Transient
    private List<String> imagenes = new ArrayList<>();
    @Transient
    private String categoria;

    @Column(name="fk_id_categoria")
    private int idCategoria;

}
