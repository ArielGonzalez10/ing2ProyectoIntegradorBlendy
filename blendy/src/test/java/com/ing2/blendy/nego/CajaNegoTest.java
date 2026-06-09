package com.ing2.blendy.nego;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.ing2.blendy.capaDatos.ICajaDatos;
import com.ing2.blendy.capaNegocio.CajaNegocio;
import com.ing2.blendy.capaNegocio.IVentaNegocio;
import com.ing2.blendy.capaNegocio.IUsuarioNegocio;
import com.ing2.blendy.capaModelo.Usuario;
import org.junit.jupiter.api.Test; // 🌟 Importante para el test individual
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.Collections;
import java.util.stream.Stream;

@ExtendWith(MockitoExtension.class)
public class CajaNegoTest {

    @Mock
    private ICajaDatos cajaDatos;

    @Mock
    private IVentaNegocio ventaNego;

    @Mock
    private IUsuarioNegocio usuarioNego;

    @InjectMocks
    @Spy
    private CajaNegocio cajaService;

    // =========================================================================
    // TEST: cerrarCaja() - CAMINO FELIZ (Fila 1 de tu tabla)
    // =========================================================================
    @Test
    @DisplayName("Cierre de Turno - Camino Feliz: Datos Válidos")
    void cerrarCaja_DatosValidos() {
        // Arrange (Fila 1: fatimabret@gmail.com, monto 1000, id caja 1)
        String correo = "fatimabret@gmail.com";
        float montoDeclarado = 1000f;
        int idCaja = 1;

        // Simulamos el comportamiento de las dependencias para que el flujo termine con éxito
        when(ventaNego.listarVenta(anyString(), any()))
                .thenReturn(Collections.emptyList()); // Sin ventas simuladas

        Usuario usuarioSimulado = new Usuario();
        usuarioSimulado.setIdUsuario(1);
        when(usuarioNego.buscarUsuario(correo)).thenReturn(usuarioSimulado);

        // Simulamos que el monto inicial en la base de datos es 0f
        doReturn(0f).when(cajaService).buscarMontoInicial(idCaja);

        // Act
        cajaService.cerrarCaja(correo, montoDeclarado, idCaja);

        // Assert
        // Verificamos que al ser datos válidos, SÍ se llama al método para guardar el cierre en la base de datos
        verify(cajaDatos, times(1)).cerrarTurno(
                eq(idCaja),
                anyFloat(),
                anyFloat(),
                anyFloat(),
                eq(montoDeclarado),
                eq("Inactivo"),
                eq(usuarioSimulado.getIdUsuario())
        );
    }

    // =========================================================================
    // TESTS: cerrarCaja() - CASOS DE ERROR (PARAMETRIZADO)
    // =========================================================================
    @ParameterizedTest(name = "Cierre de Turno - Error esperado: {4}")
    @MethodSource("proveerErroresCierreCaja")
    void cerrarCaja_DatosInvalidos(
            String correo, float montoDeclarado, int idCaja, String descripcionCaso, String mensajeErrorEsperado) {

        // Evitamos NullPointerExceptions simulando las capas externas de consulta
        Mockito.lenient()
                .when(ventaNego.listarVenta(anyString(), any()))
                .thenReturn(Collections.emptyList());

        Usuario usuarioSimulado = new Usuario();
        usuarioSimulado.setIdUsuario(1);

        Mockito.lenient()
                .when(usuarioNego.buscarUsuario(anyString()))
                .thenReturn(usuarioSimulado);

        Mockito.lenient().doReturn(0f).when(cajaService).buscarMontoInicial(anyInt());

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            cajaService.cerrarCaja(correo, montoDeclarado, idCaja);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // Verificamos que no se impacte el cierre en la base de datos al ser un caso de error
        verify(cajaDatos, never()).cerrarTurno(anyInt(), anyFloat(), anyFloat(), anyFloat(), anyFloat(), anyString(), anyInt());
    }

    private static Stream<Arguments> proveerErroresCierreCaja() {
        String errorMontoInvalido = "El monto que ingresó no puede ser menor o igual a 0";
        String errorCorreoInvalido = "El formato del correo ingresado es inválido o no contiene letras";

        return Stream.of(
                // Fila 2 de la imagen
                Arguments.of("fatimabret@gmail.com", 0f, 1,
                        "Inicio de turno sin fondo fijo", errorMontoInvalido),

                // Fila 3 de la imagen
                Arguments.of("fatimabret", 1000f, 1,
                        "correo en formato incorrecto", errorCorreoInvalido),

                // Fila 4 de la imagen
                Arguments.of("fatimabret@gmail.com", 0f, 1,
                        "Intento de no registrar el monto inicial de la caja.", errorMontoInvalido)
        );
    }
}