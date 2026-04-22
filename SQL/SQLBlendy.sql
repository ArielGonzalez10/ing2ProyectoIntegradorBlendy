CREATE DATABASE blendy;
USE blendy;

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

INSERT INTO rol (descripcion,estado) VALUES ('Administrador',1);
INSERT INTO rol (descripcion,estado) VALUES ('Cliente',1);
INSERT INTO rol (descripcion,estado) VALUES ('Vendedor',1);


UPDATE USUARIO 
SET rol_id_rol = 1 -- administrador
WHERE correo_electronico = 'fatimabret@gmail.com';

UPDATE USUARIO 
SET rol_id_rol = 3  -- vendedor
WHERE correo_electronico = 'arielgonzalezr9@gmail.com';


SELECT * FROM localidad;
SELECT * FROM provincia;
SELECT * FROM rol;
SELECT * FROM imagen;
SELECT * FROM categoria;
SELECT * FROM domicilio;
SELECT * FROM usuario;
SELECT * FROM venta_cabecera;
SELECT * FROM venta_detalle;
SELECT * FROM producto;
SELECT * FROM pago;
SELECT * from envio;
SELECT * FROM metodo_pago;


CREATE PROCEDURE sp_crear_usuario
    @p_apellido VARCHAR(255),
    @p_contrasenia VARCHAR(255),
    @p_correoElectronico VARCHAR(255),
    @p_estado INT,
    @p_nombre VARCHAR(255),
    @p_telefono VARCHAR(255),
    @p_rolId INT
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO usuario (
        apellido, 
        contrasenia, 
        correo_electronico, 
        estado, 
        nombre, 
        telefono, 
        rol_id_rol
    )
    VALUES (
        @p_apellido, 
        @p_contrasenia, 
        @p_correoElectronico, 
        @p_estado, 
        @p_nombre, 
        @p_telefono, 
        @p_rolId
    );
END
GO

CREATE PROCEDURE sp_listar_provincias
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id_provincia, estado, nombre 
    FROM provincia;
END
GO

CREATE PROCEDURE sp_listar_localidades_por_provincia
    @p_id_provincia INT
AS
BEGIN
    SET NOCOUNT ON;
    -- Filtramos por la columna exacta de tu captura de pantalla
    SELECT 
        id_localidad, 
        codigo_postal, 
        estado, 
        nombre, 
        provincia_id_provincia 
    FROM localidad 
    WHERE provincia_id_provincia = @p_id_provincia;
END
GO