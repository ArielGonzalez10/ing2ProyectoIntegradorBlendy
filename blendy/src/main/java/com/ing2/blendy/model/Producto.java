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
public class Producto {
    //Atributos
    private int idProducto;
    private String descripcion;
    private int stock;
    private double precioUnitario;
    private String imgProd;
    private Categoria categoria;
}
