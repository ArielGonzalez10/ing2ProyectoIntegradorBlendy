package com.ing2.blendy.capaNegocio;

import com.ing2.blendy.capaModelo.Producto;
import com.ing2.blendy.capaModelo.Venta;
import com.ing2.blendy.capaDatos.IVentaDatos;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;

import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class VentaNegocio implements IVentaNegocio {

    @Autowired
    private IVentaDatos ventaDatos;

    @Autowired
    private IProductoNegocio productoNego;

    @Override
    @Transactional // Si falla la inserción de un detalle de producto, el rollback limpia las tablas automáticamente
    public Venta crearVenta(Venta p_venta) {
        // 1. Inicializar la fecha y el estado del pago en memoria
        registrarFechaVenta(p_venta);
        if (p_venta.getPago() != null) {
            p_venta.getPago().setFechaPago(p_venta.getFecha().toLocalDate());
        }

        LocalDate fechaDespacho = null;
        LocalDate fechaRecepcion = null;
        String estadoEnvio = null;

        if (p_venta.getEnvio() != null) {
            fechaDespacho = p_venta.getEnvio().getFechaDespacho();
            fechaRecepcion = p_venta.getEnvio().getFechaRecepcion();
            estadoEnvio = p_venta.getEnvio().getEstado();
        }

        // 2. Invocar al Stored Procedure pasándole las variables (que pueden ser null)
        int idVenta = ventaDatos.crearVenta(
                p_venta.getFecha(),
                p_venta.getUsuario().getIdUsuario(),
                fechaDespacho,
                fechaRecepcion,
                estadoEnvio,
                p_venta.getPago().getIdMetodoPago(),
                p_venta.getPago().getFechaPago()
        );

        // Asignamos el ID autoincremental capturado a nuestra entidad en memoria
        p_venta.setIdVenta(idVenta);

        // 3. Procesar los productos transient (descontar stock e insertar físicamente en Venta_detalle)
        double totalSubtotales = procesarDetalleVenta(p_venta.getProductos(), idVenta);

        // 4. Calcular el total final (subtotales + costo de envío)
        registrarTotalVenta(p_venta, totalSubtotales);

        // 5. 🔥 IMPACTO DIRECTO: Consolidamos los montos definitivos saltando el motor de Hibernate
        ventaDatos.actualizarTotalVenta(p_venta.getTotalVenta(), idVenta);
        ventaDatos.actualizarMontoPago((float) p_venta.getTotalVenta(), idVenta);

        // Retornamos el objeto listo para que viaje al Front
        return p_venta;
    }

    @Override
    public void registrarFechaVenta(Venta p_venta) {
        if (p_venta.getFecha() == null) {
            p_venta.setFecha(LocalDateTime.now());
        }
    }

    private double procesarDetalleVenta(List<Producto> productos, int idVenta) {
        double acumuladorSubtotales = 0;
        if (productos == null) {
            return acumuladorSubtotales;
        }

        for (Producto producto : productos) {
            Producto productoReal = productoNego.modificarStock(producto);

            int cantidadPedida = producto.getStock();
            double precioHistorico = productoReal.getPrecioUnitario();
            double subtotalItem = cantidadPedida * precioHistorico;

            acumuladorSubtotales += subtotalItem;

            ventaDatos.registrarDetalleVenta(
                    cantidadPedida,
                    precioHistorico,
                    subtotalItem,
                    productoReal.getIdProducto(),
                    idVenta
            );
        }
        return acumuladorSubtotales;
    }

    private void registrarTotalVenta(Venta venta, double totalSubtotales) {
        double costoEnvio = (venta.getEnvio() != null) ? 2500 : 0;
        double totalFinal = totalSubtotales + costoEnvio;

        venta.setTotalVenta(totalFinal);
        if (venta.getPago() != null) {
            venta.getPago().setMontoPago((float) totalFinal);
            venta.getPago().setFechaPago(venta.getFecha().toLocalDate());
        }
    }

    @Override
    public Venta buscarVenta(int p_id_ventaCabecera) {
        throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public List<Venta> listarVenta(String p_correoElectronico, Date p_fecha) {
        return ventaDatos.listarVentas(p_correoElectronico, p_fecha);
    }
}