package com.ing2.blendy.nego;

import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.ing2.blendy.capaDatos.ICajaDatos;
import com.ing2.blendy.capaNegocio.CajaNegocio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import java.util.stream.Stream;

@ExtendWith(MockitoExtension.class)
public class CajaNegoTest {

    @Mock
    private ICajaDatos cajaDatos;

    @InjectMocks
    private CajaNegocio cajaService;

    @ParameterizedTest(name = "Cierre de Turno - Error esperado: {3}")
    @MethodSource("proveerErroresCierreCaja")
    void cerrarCaja_DatosInvalidos_DeberiaLanzarException(
            String correo, Float montoDeclarado, int idCaja, String mensajeErrorEsperado) {

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            cajaService.cerrarCaja(correo, montoDeclarado, idCaja);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // verify(cajaDatos, never()).cerrarCaja(anyString(), anyFloat(), anyInt());
    }

    private static Stream<Arguments> proveerErroresCierreCaja() {
        return Stream.of(
                // Inicio de turno sin fondo fijo (Monto 0)
                Arguments.of("fatimabret@gmail.com", 0f, 1, "El monto declarado no puede ser cero"),

                // Intento de ingreso de monto negativo
                Arguments.of("fatimabret@gmail.com", -5f, 1, "El monto declarado no puede ser negativo"),

                // Intento de no registrar el monto inicial (null)
                Arguments.of("fatimabret@gmail.com", null, 1, "Debe ingresar el monto de la caja")
        );
    }
}