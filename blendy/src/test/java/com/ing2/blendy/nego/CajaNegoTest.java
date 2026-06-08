package com.ing2.blendy.nego;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import com.ing2.blendy.capaDatos.ICajaDatos;
import com.ing2.blendy.capaNegocio.CajaNegocio;
import com.ing2.blendy.capaNegocio.IVentaNegocio;
import com.ing2.blendy.capaNegocio.IUsuarioNegocio;
import com.ing2.blendy.capaModelo.Usuario;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.Spy; // 🌟 Importante para interceptar métodos internos
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
    @Spy // 🌟 Agregamos @Spy para poder controlar métodos de la misma clase (como buscarMontoInicial)
    private CajaNegocio cajaService;

    @ParameterizedTest(name = "Cierre de Turno - Error esperado: {3}")
    @MethodSource("proveerErroresCierreCaja")
    void cerrarCaja_DatosInvalidos(
            String correo, float montoDeclarado, int idCaja, String mensajeErrorEsperado) {

        // Configuramos las dependencias externas para que no tiren NullPointerException
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
    }

    private static Stream<Arguments> proveerErroresCierreCaja() {
        String errorMonto = "El monto que ingresó no puede ser menor o igual a 0";
        String errorCorreo = "El formato del correo ingresado es inválido o no contiene letras";

        return Stream.of(
                // --- Bloque 1: Errores del Monto (Monto inválido, Correo bien formado) ---
                Arguments.of("fatimabret@gmail.com", 0f, 1, errorMonto),
                Arguments.of("fatimabret@gmail.com", -5f, 1, errorMonto),

                // --- Bloque 2: Errores del Correo (Monto válido de 1500f, Correo mal formado) ---
                Arguments.of("correoSinArroba.com", 1500f, 1, errorCorreo),
                Arguments.of("1234567@12345.com", 1500f, 1, errorCorreo),
                Arguments.of("", 1500f, 1, errorCorreo)
        );
    }
}