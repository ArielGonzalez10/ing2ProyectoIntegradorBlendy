import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { crearProducto, cargarCategorias } from "../api/products";
import "../styles/panel.css";

const AgregarProducto = () => {
  const navigate = useNavigate();
  const [imagenes, setImagenes] = useState([]);
  const [categorias, setCategorias] = useState([]); // Almacenará el array de strings: ["Perfumes", "Licores"]
  const [producto, setProducto] = useState({
    descripcion: "",
    categoria: "", // Guardará el string de la categoría seleccionada
    precioUnitario: "",
    stock: "",
    estado: "Activo",
  });

  // Carga de categorías al montar el componente
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const response = await cargarCategorias();
        const data = response.data || response;
        setCategorias(data);
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Redimensiona y convierte a Base64
  const fileToBase64 = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 500;
          const scaleSize = MAX_WIDTH / img.width;
          canvas.width = MAX_WIDTH;
          canvas.height = img.height * scaleSize;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          const dataUrl = canvas.toDataURL("image/jpeg", 0.6);
          const base64String = dataUrl.split(",")[1];
          resolve(base64String);
        };
      };
    });
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let valorFinal = value;

    if (type === "number") {
      const numValue = parseFloat(value);
      if (numValue < 0) {
        valorFinal = 0;
      }
    }

    setProducto({
      ...producto,
      [name]: valorFinal,
    });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const nuevasImagenes = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));
    setImagenes([...imagenes, ...nuevasImagenes]);
  };

  const quitarImagen = (index) => {
    const filtradas = imagenes.filter((_, i) => i !== index);
    setImagenes(filtradas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (parseFloat(producto.precioUnitario) <= 0) {
      alert("El precio debe ser mayor a 0");
      return;
    }

    try {
      const promesasImagenes = imagenes.map((img) => fileToBase64(img.file));
      const base64Array = await Promise.all(promesasImagenes); // Array de Strings limpios

      const nombreCategoriaSeleccionada = producto.categoria;
      const indiceEncontrado = categorias.indexOf(nombreCategoriaSeleccionada);
      const idNumericoCalculado =
        indiceEncontrado !== -1 ? indiceEncontrado + 1 : 0;

      // 🟢 ELIMINAMOS la constante 'imagenesParaEnviar' que armaba objetos.

      const dataAEnviar = {
        descripcion: producto.descripcion,
        precioUnitario: parseFloat(producto.precioUnitario),
        stock: parseInt(producto.stock),
        stockMin: 0,
        estado: "Activo",
        categoria: nombreCategoriaSeleccionada,
        idCategoria: idNumericoCalculado,
        // 🟢 PASAMOS DIRECTAMENTE EL ARRAY DE STRINGS
        imagenes: base64Array,
      };

      console.log(
        "Data preparada para Blendly (Formato String Puro):",
        dataAEnviar
      );

      await crearProducto(dataAEnviar);

      alert("Producto e imágenes registrados con éxito en Blendly");
      navigate("/panel/productos");
    } catch (error) {
      console.error(
        "Error al enviar los datos:",
        error.response?.data || error
      );
      alert("Hubo un error en el servidor. Revisá la consola de Spring Boot.");
    }
  };

  const ajustarValor = (campo, incremento) => {
    const valorActual = parseFloat(producto[campo]) || 0;
    const paso = campo === "stock" ? 1 : 1000;
    const nuevoValor = Math.max(0, valorActual + (incremento ? paso : -paso));
    setProducto({ ...producto, [campo]: nuevoValor });
  };

  return (
    <div className="admin-page">
      <div className="admin-container" style={{ maxWidth: "800px" }}>
        <div className="admin-title" style={{ marginBottom: "30px" }}>
          <h1>Nuevo Producto</h1>
          <p>
            Completa los datos para integrar la bebida al catálogo de Blendly.
          </p>
        </div>

        <form className="form-container" onSubmit={handleSubmit}>
          <div className="perfil-form-group" style={{ marginBottom: "20px" }}>
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
                name="categoria"
                value={producto.categoria}
                onChange={handleChange}
                required
              >
                <option value="" disabled>
                  Selecciona una categoría
                </option>
                {categorias.map((cat, index) => (
                  // Al ser strings puros, 'cat' es el texto de la categoría
                  <option key={index} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="perfil-form-row" style={{ marginTop: "20px" }}>
            <div className="perfil-form-group">
              <label>Precio Unitario ($) *</label>
              <div className="custom-number-wrapper">
                <button
                  type="button"
                  className="btn-number-control"
                  onClick={() => ajustarValor("precioUnitario", false)}
                >
                  -
                </button>
                <input
                  type="number"
                  name="precioUnitario"
                  min="0"
                  placeholder="0.00"
                  value={producto.precioUnitario}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn-number-control"
                  onClick={() => ajustarValor("precioUnitario", true)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="perfil-form-group">
              <label>Stock Inicial *</label>
              <div className="custom-number-wrapper">
                <button
                  type="button"
                  className="btn-number-control"
                  onClick={() => ajustarValor("stock", false)}
                >
                  -
                </button>
                <input
                  type="number"
                  name="stock"
                  min="0"
                  placeholder="0"
                  value={producto.stock}
                  onChange={handleChange}
                  required
                />
                <button
                  type="button"
                  className="btn-number-control"
                  onClick={() => ajustarValor("stock", true)}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="perfil-seccion" style={{ marginTop: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "10px",
                fontWeight: "bold",
              }}
            >
              Imágenes del Producto
            </label>
            <div
              className="image-upload-zone"
              onClick={() => document.getElementById("fileInput").click()}
            >
              <p>Haz clic para seleccionar imágenes o arrástralas aquí</p>
              <span
                style={{ fontSize: "0.8rem", color: "var(--color-subtitulos)" }}
              >
                Puedes subir más de una foto
              </span>
              <input
                id="fileInput"
                type="file"
                multiple
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </div>

            <div className="preview-gallery">
              {imagenes.map((img, index) => (
                <div key={index} className="preview-item">
                  <img src={img.preview} alt="Vista previa" />
                  <button
                    type="button"
                    className="btn-remove-img"
                    onClick={() => quitarImagen(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="perfil-acciones">
            <button
              type="button"
              className="btn-blendy btn-secundario"
              onClick={() => navigate("/panel/productos")}
            >
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
