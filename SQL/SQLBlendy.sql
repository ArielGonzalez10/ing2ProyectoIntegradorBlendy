CREATE DATABASE blendy;
USE blendy;
CREATE TABLE Categoria
(
  idCategoria INT NOT NULL,
  descripcion VARCHAR(30) NOT NULL,
  estado INT NOT NULL,
  PRIMARY KEY (idCategoria)
);

CREATE TABLE Producto
(
  idProducto INT NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  stock INT NOT NULL,
  precioUnitario FLOAT NOT NULL,
  estado INT NOT NULL,
  idCategoria INT NOT NULL,
  PRIMARY KEY (idProducto),
  FOREIGN KEY (idCategoria) REFERENCES Categoria(idCategoria)
);

CREATE TABLE Rol
(
  idRol INT NOT NULL,
  descripcion VARCHAR(30) NOT NULL,
  estado INT NOT NULL,
  PRIMARY KEY (idRol)
);

CREATE TABLE Usuario
(
  idUsuario INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correoElectronico VARCHAR(100) NOT NULL,
  contrasenia VARCHAR(100) NOT NULL,
  estado INT NOT NULL,
  idRol INT NOT NULL,
  PRIMARY KEY (idUsuario),
  FOREIGN KEY (idRol) REFERENCES Rol(idRol)
);

CREATE TABLE Provincia
(
  idProvincia INT NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  codigoPostal INT NOT NULL,
  estado INT NOT NULL,
  PRIMARY KEY (idProvincia)
);

CREATE TABLE Localidad
(
  idLocalidad INT NOT NULL,
  nombre VARCHAR(30) NOT NULL,
  estado INT NOT NULL,
  idProvincia INT NOT NULL,
  PRIMARY KEY (idLocalidad),
  FOREIGN KEY (idProvincia) REFERENCES Provincia(idProvincia)
);

CREATE TABLE Domicilio
(
  idDomicilio INT NOT NULL,
  calle INT NOT NULL,
  altura INT NOT NULL,
  idLocalidad INT NOT NULL,
  idUsuario INT NOT NULL,
  PRIMARY KEY (idDomicilio),
  FOREIGN KEY (idLocalidad) REFERENCES Localidad(idLocalidad),
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario)
);

CREATE TABLE VentaCabecera
(
  idVentaCabecera INT NOT NULL,
  fecha DATE NOT NULL,
  totalVenta INT NOT NULL,
  idUsuario INT NOT NULL,
  idDomicilio INT NOT NULL,
  PRIMARY KEY (idVentaCabecera),
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
  FOREIGN KEY (idDomicilio) REFERENCES Domicilio(idDomicilio)
);

CREATE TABLE VentaDetalle
(
  idVentaDetalle INT NOT NULL,
  cantidad INT NOT NULL,
  total INT NOT NULL,
  idProducto INT NOT NULL,
  idVentaCabecera INT NOT NULL,
  FOREIGN KEY (idProducto) REFERENCES Producto(idProducto),
  FOREIGN KEY (idVentaCabecera) REFERENCES VentaCabecera(idVentaCabecera)
);

CREATE TABLE MetodoPago
(
  idMetodoPago INT NOT NULL,
  descripcion VARCHAR(30) NOT NULL,
  estado INT NOT NULL,
  PRIMARY KEY (idMetodoPago)
);

CREATE TABLE Pago
(
  montoPago INT NOT NULL,
  idVentaCabecera INT NOT NULL,
  idMetodoPago INT NOT NULL,
  PRIMARY KEY (idVentaCabecera, idMetodoPago),
  FOREIGN KEY (idVentaCabecera) REFERENCES VentaCabecera(idVentaCabecera),
  FOREIGN KEY (idMetodoPago) REFERENCES MetodoPago(idMetodoPago)
);

CREATE TABLE Consulta
(
  idConsulta INT NOT NULL,
  descripcion VARCHAR(100) NOT NULL,
  asunto VARCHAR(100) NOT NULL,
  respuesta VARCHAR(100) NOT NULL,
  nombre VARCHAR(100) NOT NULL,
  correoElectronico VARCHAR(100) NOT NULL,
  estado INT NOT NULL,
  PRIMARY KEY (idConsulta)
);

CREATE TABLE Envio
(
  idEnvio INT NOT NULL,
  fechaDespacho DATE NOT NULL,
  fechaRecepcion DATE NOT NULL,
  idUsuario INT NOT NULL,
  idDomicilio INT NOT NULL,
  PRIMARY KEY (idEnvio),
  FOREIGN KEY (idUsuario) REFERENCES Usuario(idUsuario),
  FOREIGN KEY (idDomicilio) REFERENCES Domicilio(idDomicilio)
);

CREATE TABLE Imagen
(
  idImagen INT NOT NULL,
  descripcion INT NOT NULL,
  estado INT NOT NULL,
  idProducto INT NOT NULL,
  PRIMARY KEY (idImagen),
  FOREIGN KEY (idProducto) REFERENCES Producto(idProducto)
);

INSERT INTO rol (descripcion,estado) VALUES ('Administrador',1);
INSERT INTO rol (descripcion,estado) VALUES ('Cliente',1);

INSERT INTO domicilio (calle, altura, localidad_id_localidad, usuario_id_usuario) 
VALUES ('La paz 27', 2400, 14, 1);

SELECT * FROM localidad;
SELECT * FROM provincia;
SELECT * FROM domicilio;

SELECT * FROM imagen;
SELECT * FROM producto;
SELECT * FROM categoria;


SELECT * FROM usuario;
SELECT * FROM rol;

SELECT * FROM metodo_pago;
SELECT * FROM venta_cabecera;
SELECT * FROM venta_detalle;

INSERT INTO metodo_pago(descripcion,estado) VALUES ('Tarjeta de Debito',1);
INSERT INTO metodo_pago(descripcion,estado) VALUES ('Tarjeta de Credito',1);
INSERT INTO metodo_pago(descripcion,estado) VALUES ('Transferencia',1);

INSERT INTO provincia (nombre, estado) VALUES
('Buenos Aires', 1),
('Ciudad Autónoma de Buenos Aires', 1),
('Catamarca', 1),
('Chaco', 1),
('Chubut', 1),
('Córdoba', 1),
('Corrientes', 1),
('Entre Ríos', 1),
('Formosa', 1),
('Jujuy', 1),
('La Pampa', 1),
('La Rioja', 1),
('Mendoza', 1),
('Misiones', 1),
('Neuquén', 1),
('Río Negro', 1),
('Salta', 1),
('San Juan', 1),
('San Luis', 1),
('Santa Cruz', 1),
('Santa Fe', 1),
('Santiago del Estero', 1),
('Tierra del Fuego', 1),
('Tucumán', 1);

INSERT INTO localidad (nombre, codigo_postal, estado, provincia_id_provincia) VALUES
-- Buenos Aires (ID 1)
('La Plata', 1900, 1, 1), ('Mar del Plata', 7600, 1, 1), ('Bahía Blanca', 8000, 1, 1),
-- CABA (ID 2)
('Retiro', 1000, 1, 2), ('Palermo', 1425, 1, 2), ('Recoleta', 1113, 1, 2),
-- Catamarca (ID 3)
('San Fernando del Valle', 4700, 1, 3),
-- Chaco (ID 4)
('Resistencia', 3500, 1, 4),
-- Chubut (ID 5)
('Rawson', 9103, 1, 5), ('Puerto Madryn', 9120, 1, 5),
-- Córdoba (ID 6)
('Córdoba Capital', 5000, 1, 6), ('Villa Carlos Paz', 5152, 1, 6), ('Río Cuarto', 5800, 1, 6),
-- Corrientes (ID 7)
('Corrientes Capital', 3400, 1, 7), ('Paso de los Libres', 3230, 1, 7),
-- Entre Ríos (ID 8)
('Paraná', 3100, 1, 8), ('Gualeguaychú', 2820, 1, 8),
-- Formosa (ID 9)
('Formosa Capital', 3600, 1, 9),
-- Jujuy (ID 10)
('San Salvador de Jujuy', 4600, 1, 10),
-- La Pampa (ID 11)
('Santa Rosa', 6300, 1, 11),
-- La Rioja (ID 12)
('La Rioja Capital', 5300, 1, 12),
-- Mendoza (ID 13)
('Mendoza Capital', 5500, 1, 13), ('San Rafael', 5600, 1, 13),
-- Misiones (ID 14)
('Posadas', 3300, 1, 14), ('Puerto Iguazú', 3370, 1, 14),
-- Neuquén (ID 15)
('Neuquén Capital', 8300, 1, 15),
-- Río Negro (ID 16)
('Viedma', 8500, 1, 16), ('San Carlos de Bariloche', 8400, 1, 16),
-- Salta (ID 17)
('Salta Capital', 4400, 1, 17), ('Cafayate', 4427, 1, 17),
-- San Juan (ID 18)
('San Juan Capital', 5400, 1, 18),
-- San Luis (ID 19)
('San Luis Capital', 5700, 1, 19), ('Villa Mercedes', 5730, 1, 19),
-- Santa Cruz (ID 20)
('Río Gallegos', 9400, 1, 20), ('El Calafate', 9405, 1, 20),
-- Santa Fe (ID 21)
('Santa Fe Capital', 3000, 1, 21), ('Rosario', 2000, 1, 21), ('Rafaela', 2300, 1, 21),
-- Santiago del Estero (ID 22)
('Santiago del Estero Capital', 4200, 1, 22), ('La Banda', 4300, 1, 22),
-- Tierra del Fuego (ID 23)
('Ushuaia', 9410, 1, 23), ('Río Grande', 9420, 1, 23),
-- Tucumán (ID 24)
('San Miguel de Tucumán', 4000, 1, 24), ('Yerba Buena', 4107, 1, 24);

INSERT INTO categoria (descripcion, estado) VALUES 
('Vinos', 1),
('Licores', 1),
('Refrescos', 1),
('Energeticos', 1);

ALTER TABLE Imagen 
ALTER COLUMN descripcion VARCHAR(MAX);

UPDATE usuario 
SET rol_id_rol = 1
WHERE correo_electronico = 'arielgonzalezr9@gmail.com';


-- 1. REFRESCOS (id_categoria = 1)
UPDATE producto SET descripcion = 'Pepsi Black 1.5L', estado = 1 WHERE id_producto = 1;
UPDATE producto SET descripcion = 'Fanta Naranja Original 2L', estado = 1 WHERE id_producto = 2;

-- 2. LICORES (id_categoria = 2) 
-- (Cambiamos las cervezas por licores más fuertes)
UPDATE producto SET descripcion = 'Fernet Branca 750ml' WHERE id_producto = 3;
UPDATE producto SET descripcion = 'Vodka Absolut Blue 1L' WHERE id_producto = 4;

-- 3. VINOS (id_categoria = 3)
UPDATE producto SET descripcion = 'Vino Cabernet Sauvignon Premium' WHERE id_producto = 5;

-- 4. ENERGÉTICAS (id_categoria = 4)
-- (Cambiamos el agua y jugo por bebidas energizantes)
UPDATE producto SET descripcion = 'Monster Energy Original 473ml' WHERE id_producto = 6;
UPDATE producto SET descripcion = 'Red Bull Sugar Free 250ml' WHERE id_producto = 7;

SELECT * FROM Usuario WHERE correo_electronico = 'arielgonzalezr10@gmail.com';