package com.ing2.blendy.nego;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.ing2.blendy.capaDatos.IUsuarioDatos;
import com.ing2.blendy.capaModelo.Usuario;
import com.ing2.blendy.capaNegocio.JwtService;
import com.ing2.blendy.capaNegocio.UsuarioNegocio;
import com.ing2.blendy.dto.TokenResponse;
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
        String correo = "ariel@blendly.com";
        String passRaw = "password123";
        String passEncoded = "encoded_password_xyz";
        String nombre = "Ariel";
        String apellido = "Perez";
        String telefono = "123456789";
        String estado = "Activo";
        int idRol = 1;

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
    void crearUsuario_CorreoYaRegistrado() {
        // Arrange
        String correoRepetido = "existente@blendly.com";

        // Simulamos que el repositorio dice que el mail SÍ existe
        when(usuarioDatos.existeCorreo(correoRepetido)).thenReturn(true);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            usuarioService.crearUsuario(correoRepetido, "123", "X", "Y", "111", "Activo", 1);
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

    // =========================================================================
    // TESTS: iniciarSesion()
    // =========================================================================

    // --- 1. CAMINOS FELICES (Probando la asignación dinámica de Roles) ---
    @ParameterizedTest(name = "Login Exitoso - Rol ID: {0} debe mapear a {1}")
    @CsvSource({
            "1, Administrador",
            "2, Cliente",
            "3, Vendedor"
    })
    void iniciarSesion_DatosValidos(int idRol, String rolEsperado) {
        // Arrange
        String correo = "ariel@blendly.com";
        String passRaw = "pass123";
        String tokenSimulado = "jwt-token-fake-12345";

        Usuario usuarioSimulado = new Usuario();
        usuarioSimulado.setIdUsuario(10);
        usuarioSimulado.setCorreoElectronico(correo);
        usuarioSimulado.setContrasenia("pass_encriptada");
        usuarioSimulado.setEstado("Activo");
        usuarioSimulado.setIdRol(idRol); // Va cambiando según el CsvSource (1, 2 o 3)

        // Simulamos las respuestas de los componentes internos
        doReturn(usuarioSimulado).when(usuarioService).buscarUsuario(correo);
        when(passwordEncoder.matches(passRaw, "pass_encriptada")).thenReturn(true);
        when(jwtService.generarToken(usuarioSimulado)).thenReturn(tokenSimulado);

        // Act
        TokenResponse respuesta = usuarioService.iniciarSesion(correo, passRaw);

        // Assert
        assertNotNull(respuesta);
        assertEquals(tokenSimulado, respuesta.getToken());
        assertEquals(correo, respuesta.getCorreoElectronico());
        assertEquals(rolEsperado, respuesta.getRol()); // Verificamos que el IF/ELSE de roles funcionó bien
        assertEquals(10, respuesta.getIdUsuario());
    }

    // --- 2. CAMINOS DE ERROR (PARAMETRIZADO) ---
    @ParameterizedTest(name = "Login Fallido - Error esperado: {2}")
    @MethodSource("proveerErroresLogin")
    void iniciarSesion_CasosInvalido(
            String passRaw, Usuario usuarioRetornado, String mensajeErrorEsperado, boolean contraseniaCoincide) {

        String correo = "test@blendly.com";

        // Arrange dinámico
        doReturn(usuarioRetornado).when(usuarioService).buscarUsuario(correo);

        if (usuarioRetornado != null) {
            // Solo configuramos el passwordEncoder si el usuario existía (sino daría NullPointerException antes)
            when(passwordEncoder.matches(passRaw, usuarioRetornado.getContrasenia())).thenReturn(contraseniaCoincide);
        }

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            usuarioService.iniciarSesion(correo, passRaw);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // Verificamos que si tiró error, JAMÁS se generó el token de sesión por seguridad
        verify(jwtService, never()).generarToken(any());
    }

    private static Stream<Arguments> proveerErroresLogin() {
        // Configuramos un usuario con clave mal
        Usuario usuarioClaveInvalida = new Usuario();
        usuarioClaveInvalida.setContrasenia("clave_real");

        // Configuramos un usuario inactivo
        Usuario usuarioInactivo = new Usuario();
        usuarioInactivo.setContrasenia("clave_real");
        usuarioInactivo.setEstado("Inactivo");

        return Stream.of(
                // Caso 1: Contraseña incorrecta (passwordEncoder.matches da false)
                Arguments.of("clave_erronea", usuarioClaveInvalida, "Email o contraseña incorrectos", false),

                // Caso 2: Cuenta dada de baja (Estado es "Inactivo")
                Arguments.of("clave_real", usuarioInactivo, "Cuenta dada de baja!. Contactese con el administrador", true)
        );
    }
}