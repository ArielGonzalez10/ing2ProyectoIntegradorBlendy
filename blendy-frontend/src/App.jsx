import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Registro';
import Tienda from './pages/Tienda';
import { CartProvider } from './context/CartContext';
import CarritoLateral from './components/CarritoLateral';
import Carrito from './pages/Carrito';
import Perfil from './pages/Perfil';
import MisPedidos from './pages/MisPedidos';
import Checkout from './pages/Checkout';
import Confirmacion from './pages/Confirmacion';
import NuevaVentaLocal from './pages/NuevaVentaLocal';
import AgregarProducto from './pages/AgregarProducto';
import PanelProductos from './pages/PanelProductos';
import CierreCaja from './pages/CierreCaja';
import AuditoriaCajas from './pages/AuditoriaCajas';

function App() {
  return (
    <CartProvider>
      <Router>
        <div className="App">
          <Navbar />
          <CarritoLateral /> 
          
          <Routes>
            {/* Rutas del Visitante */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/registro" element={<Register />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/carrito" element={<Carrito />} />

            {/* Rutas del Cliente */}
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/confirmacion/:id" element={<Confirmacion />} />
            <Route path="/checkout" element={<Checkout />} />
                    
            {/* Rutas mixtas */}
            <Route path="/pedidos" element={<MisPedidos />} />

            {/* Rutas del Vendedor */}
            <Route path="/panel/cierre-caja" element={<CierreCaja />} />
            <Route path="/panel/nueva-venta" element={<NuevaVentaLocal />} />

            {/* Rutas de Administración */}
            <Route path="/panel/productos" element={<PanelProductos />} />
            <Route path="/panel/productos/nuevo" element={<AgregarProducto />} />
            <Route path="/panel/auditoria-cajas" element={<AuditoriaCajas />} />
          </Routes>
          
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;