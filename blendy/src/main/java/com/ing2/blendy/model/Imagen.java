package com.ing2.blendy.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Imagen {
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY)
    private int idImagen;
    private String descripcion;
    private int estado;
    @ManyToOne
    private Producto producto;
}
