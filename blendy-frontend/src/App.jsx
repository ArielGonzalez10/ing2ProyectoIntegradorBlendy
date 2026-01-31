import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Register from './pages/Registro'; // Ajusta la ruta según tu carpeta

function App() {
  return (
    <Router>
      <Routes>
        {/* Esto hace que el formulario sea lo primero que veas al entrar */}
        <Route path="/" element={<Register />} /> 
      </Routes>
    </Router>
  );
}

export default App;