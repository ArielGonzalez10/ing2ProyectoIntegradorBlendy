package com.ing2.blendy.nego;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.ing2.blendy.capaDatos.IUsuarioDatos;
import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaNegocio.JwtService;
import com.ing2.blendy.capaNegocio.UsuarioNegocio;
import com.ing2.blendy.dto.TokenResponse;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.CsvSource;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.stream.Stream;

@ExtendWith(MockitoExtension.class)
public class UsuarioNegoTest {

    @Mock
    private IUsuarioDatos usuarioDatos; // Tu repositorio de usuarios

    @Mock
    private BCryptPasswordEncoder passwordEncoder; // Mockeamos el encoder para que no dependa de Spring Security real
    @Mock
    private JwtService jwtService; // Reemplazalo por el nombre exacto de tu clase de JWT si cambia

    @InjectMocks
    @Spy
    private UsuarioNegocio usuarioService; // Tu lógica de negocio de usuarios

    // =========================================================================
    // TESTS: crearUsuario()
    // =========================================================================

    @Test
    void crearUsuario_DatosValidos() {
        // Arrange
        String correo = "yero@gmail.com";
        String passRaw = "pass12345";
        String passEncoded = "encoded_password_xyz";
        String nombre = "Juana";
        String apellido = "Yero";
        String telefono = "3790110101";
        String estado = "Activo";
        int idRol = 2;

        // 1. Simulamos que el correo NO existe previamente
        when(usuarioDatos.existeCorreo(correo)).thenReturn(false);
        // 2. Simulamos la codificación de la contraseña
        when(passwordEncoder.encode(passRaw)).thenReturn(passEncoded);
        // Act
        usuarioService.crearUsuario(correo, passRaw, nombre, apellido, telefono, estado, idRol);

        // Assert
        // Verificamos que se llamó al SP (Stored Procedure) con la contraseña ya encriptada
        verify(usuarioDatos, times(1)).crearUsuarioSP(
                nombre, apellido, correo, passEncoded, telefono, estado, idRol
        );
    }

    @Test
    @DisplayName("Crear Usuario - Error esperado: Usuario registrado previamente") // <-- Esto se va a ver en la barra de ejecución
    void crearUsuario_CorreoYaRegistrado() {
        // Arrange
        String correoRepetido = "fatimabret@gmail.com";

        // Simulamos que el repositorio dice que el mail SÍ existe
        when(usuarioDatos.existeCorreo(correoRepetido)).thenReturn(true);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            usuarioService.crearUsuario(correoRepetido, "contraseña", "Fatima", "Bret", "3794080080", "Activo", 3);
        });

        assertEquals("Usuario registrado previamente", ex.getMessage());

        // Verificamos que al fallar el IF, NUNCA se intenta encriptar ni guardar nada
        verify(passwordEncoder, never()).encode(anyString());
        verify(usuarioDatos, never()).crearUsuarioSP(any(), any(), any(), any(), any(), any(), anyInt());
    }

    // =========================================================================
    // TESTS: modificarUsuario()
    // =========================================================================

    @Test
    void modificarUsuario_UsuarioExiste() {
        // Arrange
        String correo = "ariel@blendly.com";
        String nombre = "Ariel Modificado";
        String apellido = "Perez";
        String telefono = "987654321";

        // Simulamos el método interno this.buscarUsuario para que devuelva un objeto (Usuario existe)
        Usuario usuarioSimulado = new Usuario();
        doReturn(usuarioSimulado).when(usuarioService).buscarUsuario(correo);

        // Act
        usuarioService.modificarUsuario(correo, nombre, apellido, telefono);

        // Assert
        verify(usuarioDatos, times(1)).modificarUsuario(nombre, apellido, telefono, correo);
    }

    @Test
    void modificarUsuario_UsuarioNoExiste() {
        // Arrange
        String correoInexistente = "no_existe@blendly.com";

        // Simulamos el método interno para que devuelva null (Usuario NO existe)
        doReturn(null).when(usuarioService).buscarUsuario(correoInexistente);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            usuarioService.modificarUsuario(correoInexistente, "A", "B", "111");
        });

        assertEquals("Usuario no encontrado", ex.getMessage());

        // Verificamos que jamás se llamó al repositorio para modificar
        verify(usuarioDatos, never()).modificarUsuario(any(), any(), any(), any());
    }

    @Test
    @DisplayName("Crear Usuario - Error esperado: La contraseña debe tener al menos 8 caracteres")
    void crearUsuario_ContraseniaCorta() {
        // Arrange
        String correoValido = "arielgonzalezr9@gmail.com";
        String contraseniaInvalida = "123"; // Solo 5 caracteres

        // Simulamos que el correo NO existe para que pase el primer IF de largo
        when(usuarioDatos.existeCorreo(correoValido)).thenReturn(false);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            usuarioService.crearUsuario(correoValido, contraseniaInvalida, "Ariel", "Gonzalez", "", "Inactivo", 1);
        });

        assertEquals("La contraseña debe tener al menos 8 caracteres", ex.getMessage());

        // Verificamos que al fallar por la contraseña, NUNCA se intente codificar ni guardar nada
        verify(passwordEncoder, never()).encode(anyString());
        verify(usuarioDatos, never()).crearUsuarioSP(any(), any(), any(), any(), any(), any(), anyInt());
    }
}