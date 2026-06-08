package com.ing2.blendy.nego;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.ing2.blendy.capaDatos.IVentaDatos;
import com.ing2.blendy.capaNegocio.IProductoNegocio;
import com.ing2.blendy.capaNegocio.IVentaNegocio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import java.util.stream.Stream;
import java.util.Collections;
import java.util.List;

import com.ing2.blendy.capaModelo.*; // Asegurate de usar tu import real de modelos
import java.time.LocalDate;

@ExtendWith(MockitoExtension.class)
public class VentaNegoTest {

    @Mock
    private IVentaDatos ventaDatos; // El repositorio que invoca la query nativa

    @InjectMocks
    private IVentaNegocio ventaService; // Tu lógica de negocio de ventas

    @Mock
    private IProductoNegocio productoNego;

    // =========================================================================
    // ESCENARIO 1: Venta que incluye ENVÍO (Caja debería ser forzada a NULL)
    // =========================================================================
    @Test
    void crearVenta_ConEnvio_DeberiaMapearDatosDeEnvioYIdCajaNull() {
        // 1. Arrange: Armamos toda la estructura del objeto Venta con Envío
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(5);

        Pago pago = new Pago();
        pago.setIdMetodoPago(1);
        pago.setFechaPago(LocalDate.of(2026, 6, 7));

        Envio envio = new Envio();
        envio.setFechaDespacho(LocalDate.of(2026, 6, 8));
        envio.setFechaRecepcion(LocalDate.of(2026, 6, 12));
        envio.setEstado("En camino");

        Caja caja = new Caja();
        caja.setIdCaja(10); // Aunque tenga caja, tu lógica dice que si hay envío, idCaja es null

        Venta venta = new Venta();
        venta.setFecha(LocalDate.of(2026, 6, 7));
        venta.setUsuario(usuario);
        venta.setPago(pago);
        venta.setEnvio(envio);
        venta.setCaja(caja);

        // Simulamos que el repositorio guarda con éxito y devuelve el ID de la venta generada (ej: 100)
        when(ventaDatos.crearVenta(
                venta.getFecha(),
                5,
                envio.getFechaDespacho(),
                envio.getFechaRecepcion(),
                "En camino",
                1,
                pago.getFechaPago(),
                null // Esperamos explícitamente null acá por el operador ternario
        )).thenReturn(100);

        // 2. Act
        int idVentaGenerada = ventaService.crearVenta(venta);

        // 3. Assert
        assertEquals(100, idVentaGenerada);
        verify(ventaDatos, times(1)).crearVenta(
                venta.getFecha(), 5, envio.getFechaDespacho(), envio.getFechaRecepcion(), "En camino", 1, pago.getFechaPago(), null
        );
    }

    // =========================================================================
    // ESCENARIO 2: Venta en local sin envío (Con CAJA, datos de envío en NULL)
    // =========================================================================
    @Test
    void crearVenta_SinEnvioConCaja_DeberiaMapearIdCajaYDatosEnvioNull() {
        // 1. Arrange: Armamos la estructura de Venta sin Envío pero con Caja
        Usuario usuario = new Usuario();
        usuario.setIdUsuario(3);

        Pago pago = new Pago();
        pago.setIdMetodoPago(2);
        pago.setFechaPago(LocalDate.of(2026, 6, 7));

        Caja caja = new Caja();
        caja.setIdCaja(8);

        Venta venta = new Venta();
        venta.setFecha(LocalDate.of(2026, 6, 7));
        venta.setUsuario(usuario);
        venta.setPago(pago);
        venta.setEnvio(null); // Sin envío
        venta.setCaja(caja);

        // Simulamos que el repositorio guarda y devuelve ID 101
        when(ventaDatos.crearVenta(
                venta.getFecha(),
                3,
                null, // fechaDespacho esperado null
                null, // fechaRecepcion esperado null
                null, // estadoEnvio esperado null
                2,
                pago.getFechaPago(),
                8    // idCaja esperado 8
        )).thenReturn(101);

        // 2. Act
        int idVentaGenerada = ventaService.crearVenta(venta);

        // 3. Assert
        assertEquals(101, idVentaGenerada);
        verify(ventaDatos, times(1)).crearVenta(
                venta.getFecha(), 3, null, null, null, 2, pago.getFechaPago(), 8
        );
    }

    // =========================================================================
    // ESCENARIO 3: CASOS DE ERROR AL COMPRAR (Según Tabla 4.2.8)
    // =========================================================================

    @ParameterizedTest(name = "Comprar - Error esperado: {2}")
    @MethodSource("proveerErroresProcesarVenta")
    void procesarVenta_CasosInvalidos_DeberiaLanzarException(
            Venta ventaInvalida, String descripcionCaso, String mensajeErrorEsperado) {

        // Simulamos que el validador de stock lanza error si intentamos comprar más de lo que hay
        if (ventaInvalida.getProductos() != null && !ventaInvalida.getProductos().isEmpty()) {
            when(productoNego.modificarStock(any(Producto.class)))
                    .thenThrow(new RuntimeException("Stock insuficiente para el producto seleccionado"));
        }

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            // Cambiamos crearVenta por procesarVenta, que es el método real de entrada
            ventaService.procesarVenta(ventaInvalida);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // Verificamos que jamás se llegó a impactar el total de la venta en la BD
        verify(ventaDatos, never()).actualizarTotalVenta(anyDouble(), anyInt());
    }

    private static Stream<Arguments> proveerErroresProcesarVenta() {
        // 1. Simulamos una venta sin productos (lista vacía)
        Venta ventaVacia = new Venta();
        ventaVacia.setProductos(Collections.emptyList());

        // 2. Simulamos una venta con un producto que pide 6 unidades
        // (Usamos setStock(6) porque tu lógica usa getStock() como cantidad pedida)
        Producto productoSinStock = new Producto();
        productoSinStock.setStock(6);

        Venta ventaSinStock = new Venta();
        ventaSinStock.setProductos(List.of(productoSinStock));

        return Stream.of(
                Arguments.of(ventaVacia, "Venta sin productos", "Debe agregar al menos un producto a la venta"),
                Arguments.of(ventaSinStock, "Falta de stock", "Stock insuficiente para el producto seleccionado")
        );
    }
}