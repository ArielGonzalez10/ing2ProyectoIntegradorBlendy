/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Interface.java to edit this template
 */package com.ing2.blendy.capaDatos;

import com.ing2.blendy.capaModelo.Venta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

@Repository
public interface IVentaDatos extends JpaRepository<Venta, Integer> {

    @Query("SELECT e FROM Venta e INNER JOIN e.usuario u WHERE u.correoElectronico = :p_correoElectronico AND e.fecha = :p_fecha")
    List<Venta> listarVentas(@Param("p_correoElectronico") String p_correoElectronico, @Param("p_fecha") LocalDateTime p_fecha);

    @Modifying
    @Query(value = "INSERT INTO Venta_detalle (cantidad, precio_historico, subtotal, fk_id_producto, fk_id_venta) " +
            "VALUES (:cantidad, :precioHistorico, :subtotal, :idProducto, :idVenta)", nativeQuery = true)
    void registrarDetalleVenta(@Param("cantidad") int cantidad,
                               @Param("precioHistorico") double precioHistorico,
                               @Param("subtotal") double subtotal,
                               @Param("idProducto") int idProducto,
                               @Param("idVenta") int idVenta);

    @Procedure(procedureName = "sp_crear_venta")
    int crearVenta(
            @Param("fecha") LocalDateTime fecha,
            @Param("fk_id_usuario") int fkIdUsuario,
            @Param("fecha_despacho") LocalDate fechaDespacho,
            @Param("fecha_recepcion") LocalDate fechaRecepcion,
            @Param("estado_envio") String estadoEnvio,
            @Param("fk_id_metodo_pago") int fkIdMetodoPago,
            @Param("fecha_pago") LocalDate fechaPago
    );

    // 🔨 Query nativa para inyectar el total definitivo en la Venta
    @Modifying
    @Query(value = "UPDATE Venta SET total_venta = :totalVenta WHERE id_venta = :idVenta", nativeQuery = true)
    void actualizarTotalVenta(@Param("totalVenta") double totalVenta, @Param("idVenta") int idVenta);

    // 🔨 Query nativa para inyectar el monto definitivo en el Pago asociado
    @Modifying
    @Query(value = "UPDATE Pago SET monto_pago = :montoPago WHERE id_pago = (SELECT fk_id_pago FROM Venta WHERE id_venta = :idVenta)", nativeQuery = true)
    void actualizarMontoPago(@Param("montoPago") float montoPago, @Param("idVenta") int idVenta);

}