import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Registro';
import Footer from './components/Footer';
import Perfil from './pages/Perfil';
import PanelProductos from './pages/PanelProductos';
import AgregarProducto from './pages/AgregarProducto';
import Tienda from './pages/Tienda';
import MisPedidos from './pages/MisPedidos';
import CierreCaja from './pages/CierreCaja';

function App() {
  return (
    <Router>
      <Navbar />

      <Routes>
        {/* Rutas del Visitante */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/tienda" element={<Tienda />} />

        {/* Rutas del Cliente */}
        <Route path="/perfil" element={<Perfil />} />
        
        {/* Rutas mixtas */}
        <Route path="/pedidos" element={<MisPedidos />} />

        {/* Rutas del Vendedor */}
        <Route path="/panel/cierre-caja" element={<CierreCaja />} />

        {/* Rutas del Administración */}
        <Route path="/panel/productos" element={<PanelProductos />} />
        <Route path="/panel/productos/nuevo" element={<AgregarProducto />} />
      </Routes>
      
      <Footer />
    </Router>
  );
}

export default App;