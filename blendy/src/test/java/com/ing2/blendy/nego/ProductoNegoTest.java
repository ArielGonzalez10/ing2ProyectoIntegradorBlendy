package com.ing2.blendy.nego;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

import com.ing2.blendy.capaDatos.IProductoDatos;
import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaNegocio.ProductoNegocio;
import org.junit.jupiter.api.Test;
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
import java.util.List;
import java.util.stream.Stream;

@ExtendWith(MockitoExtension.class)
public class ProductoNegoTest {

    @Mock
    private IProductoDatos productoDatos; // Tu dependencia de datos

    @InjectMocks
    @Spy
    private ProductoNegocio productoService; // Tu lógica de negocio bajo prueba

    // =========================================================================
    // TEST: crearProducto() - CAMINO FELIZ
    // =========================================================================
    @Test
    void crearProducto_DatosValidos() {
        // Arrange
        String desc = "Vino Tinto Francés";
        float precio = 120000.0f;
        int stock = 4;
        int stockMin = 0;
        String estado = "Activo";
        int idCategoria = 1;
        List<String> imagenes = List.of("photo-1584916201218-f4242ceb4809");
        //Decimos que NO existe un producto previo para que pase de largo la validación de duplicado
        doReturn(null).when(productoService).buscarProducto(desc);
        // Simulamos que el repositorio crea el producto y le asigna el ID 99
        Producto productoSimulado = new Producto();
        productoSimulado.setIdProducto(99);

        when(productoDatos.crearProducto(desc, precio, stock, stockMin, estado, idCategoria))
                .thenReturn(productoSimulado);
        // Act
        productoService.crearProducto(desc, precio, stock, stockMin, estado, idCategoria, imagenes);
        // Assert
        verify(productoDatos, times(1)).crearProducto(desc, precio, stock, stockMin, estado, idCategoria);
        verify(productoDatos, times(1)).crearImagen("photo-1584916201218-f4242ceb4809", "Activo", 99);
    }

    // =========================================================================
    // TEST: crearProducto() - CASOS DE ERROR (PARAMETRIZADO)
    // =========================================================================
    @ParameterizedTest(name = "Crear Producto - Error esperado: {7}")
    @MethodSource("proveerErroresCrearProducto")
    void crearProducto_DatosInvalidado(
            String desc, float precio, int stock, int stockMin,
            String estado, int idCategoria, List<String> imagenes, String mensajeErrorEsperado,
            Producto mockBuscarProducto) {

        // Agregamos Mockito.lenient() para que ignore si el mock no llega a usarse en algún caso (como el de imágenes vacías)
        Mockito.lenient().doReturn(mockBuscarProducto).when(productoService).buscarProducto(desc);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            productoService.crearProducto(desc, precio, stock, stockMin, estado, idCategoria, imagenes);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());

        // Verificamos que NUNCA se llegó a guardar nada en los datos
        verify(productoDatos, never()).crearProducto(anyString(), anyFloat(), anyInt(), anyInt(), anyString(), anyInt());
    }

    // Tu banco de datos se mantiene igual, estructurado correctamente
    private static Stream<Arguments> proveerErroresCrearProducto() {
        List<String> imagenesValidas = List.of("foto.jpg");
        Producto productoExistente = new Producto();

        return Stream.of(
                // Caso 2: Sin imagenes para el producto
                Arguments.of("Sake Premium Japónes", 9500f, 4, 0, "Activo", 4, Collections.emptyList(), "Ingrese por lo menos 1 imagen del Producto", null),

                // Caso 3: Producto duplicado
                Arguments.of("Licor de hierbas Italiano", 750000.0f, 0, 0, "Activo", 1, imagenesValidas, "Producto creado previamente", productoExistente),

                // Caso 4: Descripción vacía
                Arguments.of("", 100f, 10, 2, "Activo", 1, imagenesValidas, "No se puede registrar un producto sin nombre", null),

                // Caso 5: Precio igual o menor a 0
                Arguments.of("Vino Tinto Francés", -5f, 10, 2, "Activo", 1, imagenesValidas, "El stock o el precio no pueden ser menor o igual a 0", null)
        );
    }
    // =========================================================================
    // TESTS: eliminarProducto()
    // =========================================================================

    // --- CAMINO FELIZ ---
    @Test
    void eliminarProducto_DatosValidos() {
        // Arrange
        int idProducto = 1;
        String nuevoEstado = "Activo"; // <-- Probamos el camino que ahora sí hace algo

        // Ahora SÍ necesitamos que simule que el producto existe para que el IF dé TRUE
        Producto productoSimulado = new Producto();
        productoSimulado.setEstado("Inactivo");
        doReturn(productoSimulado).when(productoService).buscarProductoPorId(idProducto);


        // Act
        productoService.eliminarProducto(idProducto, nuevoEstado);

        // Assert
        // Ahora sí se tiene que haber ejecutado la línea dentro del primer IF
        verify(productoDatos, times(1)).cambiarEstadoProducto(idProducto, nuevoEstado);
    }

    // --- CASOS DE ERROR (PARAMETRIZADO) ---
    @ParameterizedTest(name = "Eliminar Producto - Error esperado: {2}")
    @MethodSource("proveerErroresEliminarProducto")
    void eliminarProducto_DatosInvalidados(int idProducto, String nuevoEstado, String mensajeErrorEsperado, Producto mockRetorno) {

        Mockito.lenient().doReturn(mockRetorno).when(productoService).buscarProductoPorId(idProducto);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            productoService.eliminarProducto(idProducto, nuevoEstado);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());
        verify(productoDatos, never()).cambiarEstadoProducto(anyInt(), anyString());
    }

    private static Stream<Arguments> proveerErroresEliminarProducto() {
        Producto productoActivo = new Producto();
        productoActivo.setIdProducto(1);
        productoActivo.setEstado("Activo");
        Producto productoInactivo = new Producto();
        productoInactivo.setIdProducto(2);
        productoInactivo.setEstado("Inactivo");


        return Stream.of(
                // Caso 1: Querés poner "Activo" pero el producto ya existe y está activo
                Arguments.of(1, "Activo", "Producto existente y activo", productoActivo),

                //Caso 2: El producto no existe en el sistema
                Arguments.of(99, "Activo", "El producto no fue registrado antes", null),

                // Caso 3: Producto inactivo
                Arguments.of(2, "Inactivo", "Producto ya dado de baja previamente", productoInactivo)


        );
    }
// =========================================================================
    // TESTS: modificarProducto()
    // =========================================================================

    // =========================================================================
    // TESTS: modificarProducto()
    // =========================================================================

    // --- CAMINO FELIZ ---
    @Test
    void modificarProducto_DatosValidos() {
        // Arrange
        int id = 1;
        String desc = "Vino Tinto Francés";
        int stock = 4;
        float precio = 120000.0f;
        String estado = "Activo";

        // CORRECCIÓN: Tu código de negocio busca por ID, así que mockeamos buscarProductoPorId
        Producto productoSimulado = new Producto();
        doReturn(productoSimulado).when(productoService).buscarProductoPorId(anyInt());

        // Act
        productoService.modificarProducto(id, desc, stock, precio, estado);

        // Assert
        verify(productoDatos, times(1)).modificarProducto(id, desc, stock, precio, estado);
    }

    // --- CASOS DE ERROR (PARAMETRIZADO) ---
    @ParameterizedTest(name = "Modificar Producto - Error esperado: {5}")
    @MethodSource("proveerErroresModificarProducto")
    void modificarProducto_DatosInvalidados(
            int id, String desc, int stock, float precio, String estado, String mensajeErrorEsperado, Producto mockRetorno) {

        //busca el producto pasándole el id
        Mockito.lenient().doReturn(mockRetorno).when(productoService).buscarProductoPorId(id);

        // Act & Assert
        RuntimeException ex = assertThrows(RuntimeException.class, () -> {
            productoService.modificarProducto(id, desc, stock, precio, estado);
        });

        assertEquals(mensajeErrorEsperado, ex.getMessage());
        verify(productoDatos, never()).modificarProducto(anyInt(), anyString(), anyInt(), anyFloat(), anyString());
    }

    private static Stream<Arguments> proveerErroresModificarProducto() {
        Producto productoExiste = new Producto();

        return Stream.of(
                // Caso 1: Producto no encontrado
                Arguments.of(3, "Licor de Hierbas Italiano", 5, 7500f, "Inactivo", "Producto no encontrado", null),

                // Caso 2: Stock negativo (ID 1, devuelve productoExiste para que pase el IF del ID)
                Arguments.of(4, "Whisky Los Criadores", -5, 8000f, "Activo", "No se puede ingresar un numero negativo", productoExiste),

                // Caso 3: Precio menor a cero
                Arguments.of(5, "Monster Clasico 750Ml", 7, -4000f, "Inactivo", "El valor del producto no puede ser menor a 0", productoExiste)
        );
    }
}