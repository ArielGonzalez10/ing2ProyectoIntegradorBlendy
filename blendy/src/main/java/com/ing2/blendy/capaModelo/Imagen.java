package com.ing2.blendy.capaModelo;

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
    @Lob
    private String descripcion;
    private int estado;
    @ManyToOne
    @JoinColumn(name = "producto_id_producto")
    private Producto producto;
}
