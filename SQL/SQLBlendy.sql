CREATE DATABASE blendy;
USE blendy;

-- TABLAS INDEPENDIENTES
CREATE TABLE provincia (
    id_provincia INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(255),
    codigo_postal INT, -- Cambiado a INT por tu clase Java
    estado INT NOT NULL
);

CREATE TABLE rol (
    id_rol INT PRIMARY KEY IDENTITY(1,1),
    descripcion VARCHAR(255),
    estado INT NOT NULL
);

CREATE TABLE categoria (
    id_categoria INT PRIMARY KEY IDENTITY(1,1),
    descripcion VARCHAR(255),
    estado INT NOT NULL
);

CREATE TABLE metodo_pago (
    id_metodo_pago INT PRIMARY KEY IDENTITY(1,1),
    descripcion VARCHAR(255),
    estado INT NOT NULL
);

CREATE TABLE consulta (
    id_consulta INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(255),
    correo_electronico VARCHAR(255),
    descripcion VARCHAR(MAX),
    asunto VARCHAR(255),
    respuesta VARCHAR(MAX),
    estado INT NOT NULL
);

-- TABLAS CON RELACIONES
CREATE TABLE localidad (
    id_localidad INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(255),
    estado INT NOT NULL,
    provincia_id_provincia INT, -- Hibernate buscará este nombre por defecto para 'Provincia provincia'
    CONSTRAINT FK_localidad_provincia FOREIGN KEY (provincia_id_provincia) REFERENCES provincia(id_provincia)
);

CREATE TABLE usuario (
    id_usuario INT PRIMARY KEY IDENTITY(1,1),
    nombre VARCHAR(255),
    apellido VARCHAR(255),
    correo_electronico VARCHAR(255),
    contrasenia VARCHAR(255),
    telefono VARCHAR(50),
    estado INT NOT NULL,
    rol_id_rol INT,
    CONSTRAINT FK_usuario_rol FOREIGN KEY (rol_id_rol) REFERENCES rol(id_rol)
);

CREATE TABLE domicilio (
    id_domicilio INT PRIMARY KEY IDENTITY(1,1),
    calle VARCHAR(255),
    altura INT, -- Cambiado a INT por tu clase Java
    localidad_id_localidad INT,
    usuario_id_usuario INT,
    CONSTRAINT FK_domicilio_localidad FOREIGN KEY (localidad_id_localidad) REFERENCES localidad(id_localidad),
    CONSTRAINT FK_domicilio_usuario FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE producto (
    id_producto INT PRIMARY KEY IDENTITY(1,1),
    descripcion VARCHAR(255),
    stock INT,
	stockMin INT,
    precio_unitario FLOAT, -- double en Java mapea mejor a FLOAT o DECIMAL
    estado INT NOT NULL,
    categoria_id_categoria INT,
    CONSTRAINT FK_producto_categoria FOREIGN KEY (categoria_id_categoria) REFERENCES categoria(id_categoria)
);

CREATE TABLE imagen (
    id_imagen INT PRIMARY KEY IDENTITY(1,1),
    descripcion VARCHAR(255),
    estado INT NOT NULL,
    producto_id_producto INT,
    CONSTRAINT FK_imagen_producto FOREIGN KEY (producto_id_producto) REFERENCES producto(id_producto)
);

CREATE TABLE venta_cabecera (
    id_venta_cabecera INT PRIMARY KEY IDENTITY(1,1),
    fecha DATE, -- LocalDate mapea a DATE
    total_venta FLOAT,
    usuario_id_usuario INT,
    CONSTRAINT FK_cabecera_usuario FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario)
);

CREATE TABLE venta_detalle (
    id_venta_detalle INT PRIMARY KEY IDENTITY(1,1),
    cantidad INT,
    total FLOAT,
    id_producto INT,
    id_venta_cabecera INT,
    CONSTRAINT FK_detalle_producto FOREIGN KEY (id_producto) REFERENCES producto(id_producto),
    CONSTRAINT FK_detalle_cabecera FOREIGN KEY (id_venta_cabecera) REFERENCES venta_cabecera(id_venta_cabecera)
);

CREATE TABLE pago (
    id_pago INT PRIMARY KEY IDENTITY(1,1),
    monto_pago FLOAT,
    venta_cabecera_id_venta_cabecera INT,
    metodo_pago_id_metodo_pago INT,
    CONSTRAINT FK_pago_cabecera FOREIGN KEY (venta_cabecera_id_venta_cabecera) REFERENCES venta_cabecera(id_venta_cabecera),
    CONSTRAINT FK_pago_metodo FOREIGN KEY (metodo_pago_id_metodo_pago) REFERENCES metodo_pago(id_metodo_pago)
);

CREATE TABLE envio (
    id_envio INT PRIMARY KEY IDENTITY(1,1),
    fecha_despacho DATE,
    fecha_recepcion DATE,
    usuario_id_usuario INT,
    domicilio_id_domicilio INT,
    CONSTRAINT FK_envio_usuario FOREIGN KEY (usuario_id_usuario) REFERENCES usuario(id_usuario),
    CONSTRAINT FK_envio_domicilio FOREIGN KEY (domicilio_id_domicilio) REFERENCES domicilio(id_domicilio)
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