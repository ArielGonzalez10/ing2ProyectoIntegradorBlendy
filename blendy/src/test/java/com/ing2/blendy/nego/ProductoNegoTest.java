package com.ing2.blendy.nego;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.ing2.blendy.capaDatos.IProductoDatos;
import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaNegocio.IProductoNegocio;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.Arguments;
import org.junit.jupiter.params.provider.MethodSource;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Spy;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;
import java.util.stream.Stream;

@ExtendWith(MockitoExtension.class)
public class ProductoNegoTest {

    @Mock
    private IProductoDatos productoDatos; // Tu dependencia de datos

    @InjectMocks
    @Spy
    private IProductoNegocio productoService; // Tu lógica de negocio bajo prueba

    // =========================================================================
    // TEST: crearProducto() - CAMINO FELIZ
    // =========================================================================
    @Test
    void crearProducto_DatosValidos_DeberiaGuardarProductoEImagenes() {
        // Arrange
        String desc = "Perfume Blendly Elegance";
        float precio = 4500.0f;
        int stock = 20;
        int stockMin = 5;
        String estado = "Activo";
        int idCategoria = 2;
        List<String> imagenes = List.of("url_imagen1.jpg", "url_imagen2.jpg");

        // Simulamos que el repositorio crea el producto y le asigna el ID 99
        Producto productoSimulado = new Producto();
        productoSimulado.setIdProducto(99); // Importante para el bucle de imágenes

        when(productoDatos.crearProducto(desc, precio, stock, stockMin, estado, idCategoria))
                .thenReturn(productoSimulado);

        // Act
        productoService.crearProducto(desc, precio, stock, stockMin, estado, idCategoria, imagenes);

        // Assert
        // Verificamos que se llamó al repositorio para crear el producto exacto 1 vez
        verify(productoDatos, times(1)).crearProducto(desc, precio, stock, stockMin, estado, idCategoria);

        // Verificamos que se llamó a crear cada una de las 2 imágenes asociadas al ID 99
        verify(productoDatos, times(1)).crearImagen("url_imagen1.jpg", "Activo", 99);
        verify(productoDatos, times(1)).crearImagen("url_imagen2.jpg", "Activo", 99);
    }

    // =========================================================================
    // TEST: crearProducto() - CASOS DE ERROR (PARAMETRIZADO)
    // =========================================================================
    @ParameterizedTest(name = "Crear Producto - Error esperado: {7}")
    @MethodSource("proveerErroresCrearProducto")
    void crearProducto_DatosInvalidados_DeberiaLanzarException(
            String desc, float precio, int stock, int stockMin,
            String estado, int idCategoria, List<String> imagenes, String mensajeErrorEsperado) {

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            productoService.crearProducto(desc, precio, stock, stockMin, estado, idCategoria, imagenes);
        });

        // Verificamos que el mensaje del throw sea el correcto
        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // Verificamos que NUNCA se llegó a guardar nada en la base de datos por culpa del error
        verify(productoDatos, never()).crearProducto(anyString(), anyFloat(), anyInt(), anyInt(), anyString(), anyInt());
    }

    // Tu "Script" o banco de datos de prueba para ir variando los parámetros
    private static Stream<Arguments> proveerErroresCrearProducto() {
        List<String> imagenesValidas = List.of("foto.jpg");

        return Stream.of(
                // Caso 1: Lista de imágenes vacía
                Arguments.of("Perfume", 100f, 10, 2, "Activo", 1, Collections.emptyList(), "Ingrese por lo menos 1 imagen del Producto"),

                // Caso 2: Descripción vacía
                Arguments.of("", 100f, 10, 2, "Activo", 1, imagenesValidas, "No se puede registrar un producto sin nombre"),

                // Caso 3: Precio igual o menor a 0
                Arguments.of("Perfume", 0f, 10, 2, "Activo", 1, imagenesValidas, "El stock o el precio no pueden ser menor o igual a 0"),

                // Caso 4: Stock igual o menor a 0
                Arguments.of("Perfume", 150f, -5, 2, "Activo", 1, imagenesValidas, "El stock o el precio no pueden ser menor o igual a 0"),

                // Caso 5: Categoría inválida (0 o negativa)
                Arguments.of("Perfume", 150f, 10, 2, "Activo", 0, imagenesValidas, "Ingrese una categoria valida")
        );
    }
    // =========================================================================
    // TESTS: eliminarProducto()
    // =========================================================================

    // --- CAMINO FELIZ ---
    @Test
    void eliminarProducto_DatosValidos_DeberiaCambiarEstado() {
        // Arrange
        int idProducto = 1;
        String nuevoEstado = "Inactivo";

        // Simulamos que al buscarlo por ID, el producto SÍ existe (retorna un objeto vacío)
        // Pero usamos una lógica que no choque con tus ifs de error
        // Como tu primer if pide (nuevoEstado.equals("Activo") && buscar != null) -> va a dar false (porque pasamos "Inactivo")
        // Tu segundo if pide (nuevoEstado.equals("Inactivo") && buscar != null) -> ¡Acá saltaría el error si da distinto de null!
        // Ojo: Según tu lógica actual, si el producto EXISTE, el método SIEMPRE tira excepción.
        // Simulamos que NO existe en la BD para que pase de largo los ifs y ejecute el cambio:
        doReturn(null).when(productoService).buscarProductoPorId(idProducto);

        // Act
        productoService.eliminarProducto(idProducto, nuevoEstado);

        // Assert
        verify(productoDatos, times(1)).cambiarEstadoProducto(idProducto, nuevoEstado);
    }

    // --- CASOS DE ERROR (PARAMETRIZADO) ---
    @ParameterizedTest(name = "Eliminar Producto - Error esperado: {2}")
    @MethodSource("proveerErroresEliminarProducto")
    void eliminarProducto_DatosInvalidados_DeberiaLanzarException(
            int idProducto, String nuevoEstado, String mensajeErrorEsperado, Producto mockRetorno) {

        // Arrange dinámico para simular el método interno buscarProductoPorId
        doReturn(mockRetorno).when(productoService).buscarProductoPorId(idProducto);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            productoService.eliminarProducto(idProducto, nuevoEstado);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // Verificamos que jamás se llamó al repositorio para impactar el cambio
        verify(productoDatos, never()).cambiarEstadoProducto(anyInt(), anyString());
    }

    private static Stream<Arguments> proveerErroresEliminarProducto() {
        Producto productoExiste = new Producto();

        return Stream.of(
                // Caso 1: Querés poner "Activo" pero el producto ya existe y está activo
                Arguments.of(1, "Activo", "Producto existente y activo", productoExiste),

                // Caso 2: Querés poner "Inactivo" pero el producto ya fue dado de baja (ya existe como inactivo)
                Arguments.of(1, "Inactivo", "Producto ya dado de baja previamente", productoExiste),

                // Caso 3: Estado viene vacío
                Arguments.of(1, "", "Ingrese datos en los campos", null)
        );
    }
    // =========================================================================
    // TESTS: modificarProducto()
    // =========================================================================

    // --- CAMINO FELIZ ---
    @Test
    void modificarProducto_DatosValidos_DeberiaModificarExitosamente() {
        // Arrange
        int id = 1;
        String desc = "Perfume Importado";
        int stock = 15;
        float precio = 3500.0f;
        String estado = "Activo";

        // Simulamos que el producto SÍ existe para que pase el primer IF (this.buscarProducto != null)
        Producto productoSimulado = new Producto();
        doReturn(productoSimulado).when(productoService).buscarProducto(desc);

        // Act
        productoService.modificarProducto(id, desc, stock, precio, estado);

        // Assert
        verify(productoDatos, times(1)).modificarProducto(id, desc, stock, precio, estado);
    }

    // --- CASOS DE ERROR (PARAMETRIZADO) ---
    @ParameterizedTest(name = "Modificar Producto - Error esperado: {4}")
    @MethodSource("proveerErroresModificarProducto")
    void modificarProducto_DatosInvalidados_DeberiaLanzarException(
            String desc, int stock, float precio, String estado, String mensajeErrorEsperado, Producto mockRetorno) {

        // Arrange dinámico para el método interno buscarProducto
        doReturn(mockRetorno).when(productoService).buscarProducto(desc);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            productoService.modificarProducto(1, desc, stock, precio, estado);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());
        verify(productoDatos, never()).modificarProducto(anyInt(), anyString(), anyInt(), anyFloat(), anyString());
    }

    private static Stream<Arguments> proveerErroresModificarProducto() {
        Producto productoExiste = new Producto();

        return Stream.of(
                // Caso 1: Producto no encontrado (buscarProducto devuelve null)
                Arguments.of("Inexistente", 10, 100f, "Activo", "Producto no encontrado", null),

                // Caso 2: Stock negativo
                Arguments.of("Perfume", -5, 100f, "Activo", "No se puede ingresar un numero negativo", productoExiste),

                // Caso 3: Precio menor a cero
                Arguments.of("Perfume", 10, -50f, "Activo", "El valor del producto no puede ser menor a 0", productoExiste),

                // Caso 4: Descripción vacía
                Arguments.of("", 10, 100f, "Activo", "Ingrese un nombre valido", productoExiste),

                // Caso 5: Descripción son solo números (ej: "12345")
                Arguments.of("12345", 10, 100f, "Activo", "Ingrese un nombre valido", productoExiste),

                // Caso 6: Estado inválido (ni Activo ni Inactivo)
                Arguments.of("Perfume", 10, 100f, "Borrador", "Ingrese un estado valido", productoExiste)
        );
    }
}