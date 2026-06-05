package com.ing2.blendy.capaModelo;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Caja {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private int idCaja;

    @Column(name="monto_declarado")
    private float montoDeclarado;

    @Column(name="monto_inicial")
    private float montoInicial;

    @Column(name="monto_calculado")
    private float montoCalculado;

    @Column(name="total_venta")
    private float totalVenta;
    @Column(name="diferencia")
    private float diferencia;
    @Column(name="estado")
    private String estado;
    @Column(name="fecha")
    private LocalDate fecha;

    @ManyToOne()
    @JoinColumn(name="fk_id_usuario")
    private Usuario usuario;
}
