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

INSERT INTO provincia (nombre, codigo_postal, estado) VALUES
('Buenos Aires', 1900, 1),
('Ciudad Autónoma de Buenos Aires', 1000, 1),
('Catamarca', 4700, 1),
('Chaco', 3500, 1),
('Chubut', 9103, 1),
('Córdoba', 5000, 1),
('Corrientes', 3400, 1),
('Entre Ríos', 3100, 1),
('Formosa', 3600, 1),
('Jujuy', 4600, 1),
('La Pampa', 6300, 1),
('La Rioja', 5300, 1),
('Mendoza', 5500, 1),
('Misiones', 3300, 1),
('Neuquén', 8300, 1),
('Río Negro', 8500, 1),
('Salta', 4400, 1),
('San Juan', 5400, 1),
('San Luis', 5700, 1),
('Santa Cruz', 9400, 1),
('Santa Fe', 3000, 1),
('Santiago del Estero', 4200, 1),
('Tierra del Fuego', 9410, 1),
('Tucumán', 4000, 1);

INSERT INTO localidad (nombre, estado, provincia_id_provincia) VALUES
-- Buenos Aires (ID 1)
('La Plata', 1, 1), ('Mar del Plata', 1, 1), ('Bahía Blanca', 1, 1),
-- CABA (ID 2)
('Retiro', 1, 2), ('Palermo', 1, 2), ('Recoleta', 1, 2),
-- Catamarca (ID 3)
('San Fernando del Valle', 1, 3),
-- Chaco (ID 4)
('Resistencia', 1, 4),
-- Chubut (ID 5)
('Rawson', 1, 5), ('Puerto Madryn', 1, 5),
-- Córdoba (ID 6)
('Córdoba Capital', 1, 6), ('Villa Carlos Paz', 1, 6), ('Río Cuarto', 1, 6),
-- Corrientes (ID 7)
('Corrientes Capital', 1, 7), ('Paso de los Libres', 1, 7),
-- Entre Ríos (ID 8)
('Paraná', 1, 8), ('Gualeguaychú', 1, 8),
-- Formosa (ID 9)
('Formosa Capital', 1, 9),
-- Jujuy (ID 10)
('San Salvador de Jujuy', 1, 10),
-- La Pampa (ID 11)
('Santa Rosa', 1, 11),
-- La Rioja (ID 12)
('La Rioja Capital', 1, 12),
-- Mendoza (ID 13)
('Mendoza Capital', 1, 13), ('San Rafael', 1, 13),
-- Misiones (ID 14)
('Posadas', 1, 14), ('Puerto Iguazú', 1, 14),
-- Neuquén (ID 15)
('Neuquén Capital', 1, 15),
-- Río Negro (ID 16)
('Viedma', 1, 16), ('San Carlos de Bariloche', 1, 16),
-- Salta (ID 17)
('Salta Capital', 1, 17), ('Cafayate', 1, 17),
-- San Juan (ID 18)
('San Juan Capital', 1, 18),
-- San Luis (ID 19)
('San Luis Capital', 1, 19), ('Villa Mercedes', 1, 19),
-- Santa Cruz (ID 20)
('Río Gallegos', 1, 20), ('El Calafate', 1, 20),
-- Santa Fe (ID 21)
('Santa Fe Capital', 1, 21), ('Rosario', 1, 21), ('Rafaela', 1, 21),
-- Santiago del Estero (ID 22)
('Santiago del Estero Capital', 1, 22), ('La Banda', 1, 22),
-- Tierra del Fuego (ID 23)
('Ushuaia', 1, 23), ('Río Grande', 1, 23),
-- Tucumán (ID 24)
('San Miguel de Tucumán', 1, 24), ('Yerba Buena', 1, 24);

SELECT * FROM localidad;
SELECT * FROM provincia;
SELECT * FROM rol;
select * from usuario;
select * from domicilio;
