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
    @Transactional
    public Venta procesarVenta(Venta p_venta) {
        // Inicializar la fecha y el estado del pago
        registrarFechaVenta(p_venta);

        int idVenta = this.crearVenta(p_venta);
        //Se obtiene el id de la venta
        p_venta.setIdVenta(idVenta);

        //Se hace el calculo de el total de la venta
        float totalSubtotales = procesarDetalleVenta(p_venta.getProductos(), idVenta);

        //Se registra el total de la venta
        registrarTotalVenta(p_venta, totalSubtotales);

        //Se actualizan los datos en la bd
        ventaDatos.actualizarTotalVenta(p_venta.getTotalVenta(), idVenta);
        ventaDatos.actualizarMontoPago((float) p_venta.getTotalVenta(), idVenta);

        return p_venta;
    }

    @Override
    public int crearVenta(Venta p_venta) {
        //En el Caso de que se venta de mostrador, no hay envio por lo tanto envio se setea a null
        LocalDate fechaDespacho = null;
        LocalDate fechaRecepcion = null;
        String estadoEnvio = null;

        if (p_venta.getEnvio() != null) {
            fechaDespacho = p_venta.getEnvio().getFechaDespacho();
            fechaRecepcion = p_venta.getEnvio().getFechaRecepcion();
            estadoEnvio = p_venta.getEnvio().getEstado();
        }

        //Se crea la venta
        return ventaDatos.crearVenta(
                p_venta.getFecha(),
                p_venta.getUsuario().getIdUsuario(),
                fechaDespacho,
                fechaRecepcion,
                estadoEnvio,
                p_venta.getPago().getIdMetodoPago(),
                p_venta.getPago().getFechaPago()
        );
    }

    @Override
    public void registrarFechaVenta(Venta p_venta) {
        if (p_venta.getFecha() == null) {
            p_venta.setFecha(LocalDate.now());
        }

        if (p_venta.getPago() != null) {
            p_venta.getPago().setFechaPago(p_venta.getFecha());
        }
    }

    @Override
    public float procesarDetalleVenta(List<Producto> p_productos, int p_id_venta) {
        //Se inicializa en 0 los subtotales
        float acumuladorSubtotales = 0;
        if (p_productos == null) {
            return acumuladorSubtotales;
        }

        //Se recorre la lista de productos que solicito el cliente
        for (Producto producto : p_productos) {
            //Se obtiene el producto de la bd
            Producto productoReal = productoNego.modificarStock(producto);

            //La cantidad del producto solicitado por el cliente
            int cantidadPedida = producto.getStock();
            //El precio del producto en ese momento
            double precioHistorico = productoReal.getPrecioUnitario();
            //El costo del producto por la cantidad solicitada
            double subtotalItem = cantidadPedida * precioHistorico;
            //se acumula los valores
            acumuladorSubtotales += subtotalItem;
            //se crea el detalle venta
            ventaDatos.registrarDetalleVenta(
                    cantidadPedida,
                    precioHistorico,
                    subtotalItem,
                    productoReal.getIdProducto(),
                    p_id_venta
            );
        }
        //se retorna la sumatoria de la venta
        return acumuladorSubtotales;
    }

    @Override
    public void registrarTotalVenta(Venta p_venta, float p_subtotales) {
        //Si no hay envio, no se suma el costo del envio
        float costoEnvio = (p_venta.getEnvio() != null) ? 2500 : 0;
        float totalFinal = p_subtotales + costoEnvio;

        //Se guarda el total de la venta
        p_venta.setTotalVenta(totalFinal);
        if (p_venta.getPago() != null) {
            //Se guarda el monto del pago y la fecha del pago
            p_venta.getPago().setMontoPago((float) totalFinal);
            p_venta.getPago().setFechaPago(p_venta.getFecha());
        }
    }

    @Override
    public Venta buscarVenta(int p_id_venta) {
        return ventaDatos.findById(p_id_venta).orElse(null);
    }

    //Retorna las ventas por usuario y por fecha
    @Override
    public List<Venta> listarVenta(String p_correoElectronico, LocalDate p_fecha) {
        return ventaDatos.listarVentas(p_correoElectronico, p_fecha);
    }
}