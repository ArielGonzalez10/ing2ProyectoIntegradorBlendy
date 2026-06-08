package com.ing2.blendy.nego;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.ing2.blendy.capaDatos.IVentaDatos;
import com.ing2.blendy.capaNegocio.IProductoNegocio; // Asegúrate de usar la interfaz correcta
import com.ing2.blendy.capaNegocio.VentaNegocio;
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

import com.ing2.blendy.capaModelo.*;
import java.time.LocalDate;

@ExtendWith(MockitoExtension.class)
public class VentaNegoTest {

    @Mock
    private IVentaDatos ventaDatos;

    @InjectMocks
    private VentaNegocio ventaNegocio;

    @Mock
    private IProductoNegocio productoNego; // Cambiado a la interfaz para que coincida con el @Autowired de tu servicio

    // =========================================================================
    // ESCENARIO 1: Venta que incluye ENVÍO (No hay caja abierta)
    // =========================================================================
    @Test
    void crearVenta_ConEnvio() {
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
        caja.setIdCaja(10);

        Venta venta = new Venta();
        venta.setFecha(LocalDate.of(2026, 6, 7));
        venta.setUsuario(usuario);
        venta.setPago(pago);
        venta.setEnvio(envio);
        venta.setCaja(caja);

        when(ventaDatos.crearVenta(
                venta.getFecha(),
                5,
                envio.getFechaDespacho(),
                envio.getFechaRecepcion(),
                "En camino",
                1,
                pago.getFechaPago(),
                null
        )).thenReturn(100);

        int idVentaGenerada = ventaNegocio.crearVenta(venta);

        assertEquals(100, idVentaGenerada);
        verify(ventaDatos, times(1)).crearVenta(
                venta.getFecha(), 5, envio.getFechaDespacho(), envio.getFechaRecepcion(), "En camino", 1, pago.getFechaPago(), null
        );
    }

    // =========================================================================
    // ESCENARIO 2: Venta en local sin envío (Con CAJA, datos de envío en NULL)
    // =========================================================================
    @Test
    void crearVenta_SinEnvioConCaja() {
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
        venta.setEnvio(null);
        venta.setCaja(caja);

        when(ventaDatos.crearVenta(
                venta.getFecha(),
                3,
                null,
                null,
                null,
                2,
                pago.getFechaPago(),
                8
        )).thenReturn(101);

        int idVentaGenerada = ventaNegocio.crearVenta(venta);

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
    void procesarVenta_CasosInvalidos(
            Venta ventaInvalida, String descripcionCaso, String mensajeErrorEsperado) {

        // Si la venta tiene productos, significa que va a pasar la primera validación
        // y llegará a intentar crear la cabecera e intentar modificar el stock
        if (ventaInvalida.getProductos() != null && !ventaInvalida.getProductos().isEmpty()) {

            // Simulamos que la creación inicial de la venta en la BD funciona correctamente y devuelve ID 1
            lenient().when(ventaDatos.crearVenta(any(), anyInt(), any(), any(), any(), anyInt(), any(), any()))
                    .thenReturn(1);

            // Forzamos la excepción en la capa que tú definiste para simular la falta de stock
            when(productoNego.modificarStock(any(Producto.class)))
                    .thenThrow(new RuntimeException("Stock insuficiente"));
        }

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            ventaNegocio.procesarVenta(ventaInvalida);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // Verificamos rigurosamente que jamás se impactó el cierre económico de la venta en la base de datos
        verify(ventaDatos, never()).actualizarTotalVenta(anyDouble(), anyInt());
        verify(ventaDatos, never()).actualizarMontoPago(anyFloat(), anyInt());
    }

    private static Stream<Arguments> proveerErroresProcesarVenta() {

        Usuario usuarioSimulado = new Usuario();
        usuarioSimulado.setIdUsuario(1);

        Pago pagoSimulado = new Pago();
        pagoSimulado.setIdMetodoPago(1);
        pagoSimulado.setFechaPago(LocalDate.now());

        // Caso A: Venta vacía (Lanza el error en la primera línea de procesarVenta)
        Venta ventaVacia = new Venta();
        ventaVacia.setUsuario(usuarioSimulado);
        ventaVacia.setPago(pagoSimulado);
        ventaVacia.setProductos(Collections.emptyList());

        // Caso B: Venta con un producto (Pasará a procesarDetalleVenta y lanzará el error ahí)
        Producto productoSinStock = new Producto();
        productoSinStock.setIdProducto(123);
        productoSinStock.setStock(6);

        Venta ventaSinStock = new Venta();
        ventaSinStock.setFecha(LocalDate.now());
        ventaSinStock.setUsuario(usuarioSimulado);
        ventaSinStock.setPago(pagoSimulado);
        ventaSinStock.setProductos(List.of(productoSinStock));

        return Stream.of(
                Arguments.of(ventaVacia, "Venta sin productos", "Debe agregar al menos un producto"),
                // Corregido: Se quitó el espacio en blanco al final de "Stock insuficiente"
                Arguments.of(ventaSinStock, "Falta de stock", "Stock insuficiente")
        );
    }
}