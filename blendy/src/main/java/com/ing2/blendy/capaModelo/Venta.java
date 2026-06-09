/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.ing2.blendy.capaModelo;
import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

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
public class Venta {
    //Atributos
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idVenta;

    @Column(name="fecha")
    private LocalDate fecha;

    @Column(name="total_venta")
    private float totalVenta;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "fk_id_usuario", insertable = true, updatable = false)
    private Usuario usuario;

    @JsonBackReference
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_id_envio")
    private Envio envio;

    @Transient
    private List<Producto> productos = new ArrayList<>();

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "fk_id_pago")
    private Pago pago;

    @ManyToOne(cascade = CascadeType.DETACH)
    @JoinColumn(name = "fk_id_caja")
    private Caja caja;
}
