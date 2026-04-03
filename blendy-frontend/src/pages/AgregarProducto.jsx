import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/panel.css';

const AgregarProducto = () => {
    const navigate = useNavigate();
    const [imagenes, setImagenes] = useState([]);
    const [producto, setProducto] = useState({
        descripcion: '',
        idCategoria: '',
        precioUnitario: '',
        stock: '',
        estado: 1
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        let valorFinal = value;

        // Si el campo es de tipo número (precio o stock)
        if (type === 'number') {
            // Convertimos a número y verificamos si es negativo
            const numValue = parseFloat(value);
            if (numValue < 0) {
                valorFinal = 0; // Auto-completa a 0 si es negativo
            }
        }

        setProducto({ 
            ...producto, 
            [name]: valorFinal 
        });
    };

    // Carga de imágenes múltiples
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        const nuevasImagenes = files.map(file => ({
            file,
            preview: URL.createObjectURL(file)
        }));
        setImagenes([...imagenes, ...nuevasImagenes]);
    };

    const quitarImagen = (index) => {
        const filtradas = imagenes.filter((_, i) => i !== index);
        setImagenes(filtradas);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Validación de seguridad
        if (parseFloat(producto.precioUnitario) <= 0) {
            alert("El precio debe ser mayor a 0");
            return;
        }
        console.log("Datos a enviar al backend:", producto, imagenes);
        alert("Producto registrado con éxito (Simulación)");
        navigate('/panel/productos');
    };

    const ajustarValor = (campo, incremento) => {
        const valorActual = parseFloat(producto[campo]) || 0;
        
        // El stock sube de a 1, el precio sube de a 1000 para que sea más ágil
        const paso = campo === 'stock' ? 1 : 1000; 
        
        // Calculamos el nuevo valor y nos aseguramos de que nunca baje de 0
        const nuevoValor = Math.max(0, valorActual + (incremento ? paso : -paso));
        
        setProducto({ ...producto, [campo]: nuevoValor });
    };

    return (
        <div className="admin-page">
            <div className="admin-container" style={{ maxWidth: '800px' }}>
                <div className="admin-title" style={{ marginBottom: '30px' }}>
                    <h1>Nuevo Producto</h1>
                    <p>Completa los datos para integrar la bebida al catálogo de Blendly.</p>
                </div>

                <form className="form-container" onSubmit={handleSubmit}>
                    <div className="perfil-form-group" style={{ marginBottom: '20px' }}>
                        <label>Descripción del Producto *</label>
                        <input 
                            type="text" 
                            name="descripcion"
                            placeholder="Ej: Vino Tinto Malbec 750ml"
                            value={producto.descripcion}
                            onChange={handleChange}
                            required 
                        />
                    </div>

                    <div className="perfil-form-row">
                        <div className="perfil-form-group">
                            <label>Categoría *</label>
                            <select 
                                name="idCategoria" 
                                value={producto.idCategoria} 
                                onChange={handleChange} 
                                required
                            >
                                <option value="" disabled>Selecciona una categoría</option>
                                <option value="1">Vinos</option>
                                <option value="2">Licores</option>
                                <option value="3">Refrescos</option>
                                <option value="4">Energéticas</option>
                            </select>
                        </div>
                    </div>

                    <div className="perfil-form-row" style={{ marginTop: '20px' }}>
                        
                        {/* PRECIO */}
                        <div className="perfil-form-group">
                            <label>Precio Unitario ($) *</label>
                            <div className="custom-number-wrapper">
                                <button type="button" className="btn-number-control" onClick={() => ajustarValor('precioUnitario', false)}>-</button>
                                <input 
                                    type="number" 
                                    name="precioUnitario"
                                    min="0"
                                    placeholder="0.00"
                                    value={producto.precioUnitario}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" className="btn-number-control" onClick={() => ajustarValor('precioUnitario', true)}>+</button>
                            </div>
                        </div>

                        {/* STOCK */}
                        <div className="perfil-form-group">
                            <label>Stock Inicial *</label>
                            <div className="custom-number-wrapper">
                                <button type="button" className="btn-number-control" onClick={() => ajustarValor('stock', false)}>-</button>
                                <input 
                                    type="number" 
                                    name="stock"
                                    min="0"
                                    placeholder="0"
                                    value={producto.stock}
                                    onChange={handleChange}
                                    required
                                />
                                <button type="button" className="btn-number-control" onClick={() => ajustarValor('stock', true)}>+</button>
                            </div>
                        </div>

                    </div>

                    <div className="perfil-seccion" style={{ marginTop: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
                            Imágenes del Producto
                        </label>
                        <div className="image-upload-zone" onClick={() => document.getElementById('fileInput').click()}>
                            <p>Haz clic para seleccionar imágenes o arrástralas aquí</p>
                            <span style={{ fontSize: '0.8rem', color: 'var(--color-subtitulos)' }}>Puedes subir más de una foto</span>
                            <input 
                                id="fileInput"
                                type="file" 
                                multiple 
                                accept="image/*" 
                                style={{ display: 'none' }} 
                                onChange={handleImageChange}
                            />
                        </div>

                        <div className="preview-gallery">
                            {imagenes.map((img, index) => (
                                <div key={index} className="preview-item">
                                    <img src={img.preview} alt="Vista previa" />
                                    <button type="button" className="btn-remove-img" onClick={() => quitarImagen(index)}>X</button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="perfil-acciones">
                        <button type="button" className="btn-blendy btn-secundario" onClick={() => navigate('/panel/productos')}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-blendy btn-enfasis">
                            Guardar Producto
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AgregarProducto;