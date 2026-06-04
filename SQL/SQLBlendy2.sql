CREATE DATABASE blendy;
USE blendy;
/*SELECTS*/
SELECT * FROM localidad;
SELECT * FROM provincia;

SELECT * FROM categoria;
SELECT * FROM rol;
SELECT * FROM domicilio;
SELECT * FROM usuario;
SELECT * FROM producto;
SELECT * FROM venta;
SELECT * FROM venta_detalle;
SELECT * FROM pago;
SELECT * from envio;
SELECT * FROM metodo_pago;
SELECT * FROM cierre_turno;


/*CREACIÓN DE TABLAS*/
CREATE TABLE Categoria
(
  id_categoria INT NOT NULL IDENTITY,
  descripcion VARCHAR(30) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_categoria)
);

CREATE TABLE Producto
(
  id_producto INT NOT NULL IDENTITY,
  descripcion VARCHAR(100) NOT NULL,
  stock INT NOT NULL,
  precio_unitario FLOAT NOT NULL,
  estado VARCHAR(20) NOT NULL,
  stock_min INT NOT NULL,
  fk_id_categoria INT NOT NULL,
  PRIMARY KEY (id_producto),
  FOREIGN KEY (fk_id_categoria) REFERENCES Categoria(id_categoria)
);

CREATE TABLE Rol
(
  idRol INT NOT NULL IDENTITY,
  descripcion VARCHAR(30) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  PRIMARY KEY (idRol)
);

CREATE TABLE Usuario
(
  id_usuario INT NOT NULL IDENTITY,
  nombre VARCHAR(100) NOT NULL,
  apellido VARCHAR(100) NOT NULL,
  correo_electronico VARCHAR(100) NOT NULL,
  contrasenia VARCHAR(100) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  telefono VARCHAR(100) NOT NULL,
  fk_id_rol INT NOT NULL,
  PRIMARY KEY (id_usuario),
  FOREIGN KEY (fk_id_rol) REFERENCES Rol(idRol)
);

CREATE TABLE Metodo_pago
(
  id_metodo_pago INT NOT NULL IDENTITY,
  descripcion VARCHAR(30) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_metodo_pago)
);

CREATE TABLE Pago
(
  monto_pago FLOAT NOT NULL,
  id_pago INT NOT NULL IDENTITY,
  fecha_pago DATE NOT NULL,
  fk_id_metodo_pago INT NOT NULL,
  PRIMARY KEY (id_pago),
  FOREIGN KEY (fk_id_metodo_pago) REFERENCES Metodo_pago(id_metodo_pago)
);

CREATE TABLE Envio
(
  id_envio INT NOT NULL IDENTITY,
  fecha_despacho DATE NOT NULL,
  fecha_recepcion DATE NOT NULL,
  estado VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_envio)
);

CREATE TABLE Venta
(
  id_venta INT NOT NULL IDENTITY,
  fecha DATETIME2 NOT NULL,
  total_venta FLOAT NOT NULL,
  fk_id_usuario INT NOT NULL,
  fk_id_pago INT NOT NULL,
  fk_id_envio INT NULL,
  PRIMARY KEY (id_venta),
  FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario),
  FOREIGN KEY (fk_id_pago) REFERENCES Pago(id_pago),
  FOREIGN KEY (fk_id_envio) REFERENCES Envio(id_envio)
);

CREATE TABLE Venta_detalle
(
  id_venta_detalle INT NOT NULL IDENTITY,
  cantidad INT NOT NULL,
  precio_historico FLOAT NOT NULL,
  subtotal FLOAT NOT NULL,
  fk_id_producto INT NOT NULL,
  fk_id_venta INT NOT NULL,
  PRIMARY KEY (id_venta_detalle),
  FOREIGN KEY (fk_id_producto) REFERENCES Producto(id_producto),
  FOREIGN KEY (fk_id_venta) REFERENCES Venta(id_venta)
);

CREATE TABLE Consulta
(
  id_consulta INT NOT NULL IDENTITY,
  mensaje VARCHAR(250) NOT NULL,
  asunto VARCHAR(100) NOT NULL,
  respuesta VARCHAR(250) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  fk_id_usuario INT NOT NULL,
  PRIMARY KEY (id_consulta),
  FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Provincia
(
  id_provincia INT NOT NULL IDENTITY,
  nombre VARCHAR(100) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  PRIMARY KEY (id_provincia)
);

CREATE TABLE Localidad
(
  id_localidad INT NOT NULL IDENTITY,
  nombre VARCHAR(30) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  codigo_postal INT NOT NULL,
  fk_id_provincia INT NOT NULL,
  PRIMARY KEY (id_localidad),
  FOREIGN KEY (fk_id_provincia) REFERENCES Provincia(id_provincia)
);

CREATE TABLE Domicilio
(
  id_domicilio INT NOT NULL IDENTITY,
  calle VARCHAR(255) NOT NULL,
  altura INT NOT NULL,
  estado VARCHAR(20) NOT NULL,
  fk_id_localidad INT NOT NULL,
  fk_id_usuario INT NOT NULL,
  PRIMARY KEY (id_domicilio),
  FOREIGN KEY (fk_id_localidad) REFERENCES Localidad(id_localidad),
  FOREIGN KEY (fk_id_usuario) REFERENCES Usuario(id_usuario)
);

CREATE TABLE Imagen
(
  id_imagen INT NOT NULL IDENTITY,
  descripcion VARCHAR(MAX) NOT NULL,
  estado VARCHAR(20) NOT NULL,
  fk_id_producto INT NOT NULL,
  PRIMARY KEY (id_imagen),
  FOREIGN KEY (fk_id_producto) REFERENCES Producto(id_producto)
);

CREATE TABLE Cierre_turno
(
  id_cierre_turno INT NOT NULL IDENTITY,
  estado VARCHAR(20) NOT NULL,
  fecha DATE NOT NULL,
  total_venta FLOAT NOT NULL,
  monto_calculado INT NOT NULL,
  diferencia INT NOT NULL,
  monto_declarado INT NOT NULL,
  monto_inicial INT NOT NULL,
  id_usuario INT NOT NULL,
  PRIMARY KEY (id_cierre_turno),
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

/*INSERTS*/
INSERT INTO metodo_pago(descripcion,estado) VALUES ('Efectivo','Activo');
INSERT INTO metodo_pago(descripcion,estado) VALUES ('Tarjeta de Debito','Activo');
INSERT INTO metodo_pago(descripcion,estado) VALUES ('Tarjeta de Credito','Activo');
INSERT INTO metodo_pago(descripcion,estado) VALUES ('Transferencia','Activo');

INSERT INTO provincia (nombre, estado) VALUES
('Buenos Aires', 'Activo'),
('Ciudad Autónoma de Buenos Aires', 'Activo'),
('Catamarca', 'Activo'),
('Chaco', 'Activo'),
('Chubut', 'Activo'),
('Córdoba', 'Activo'),
('Corrientes', 'Activo'),
('Entre Ríos', 'Activo'),
('Formosa', 'Activo'),
('Jujuy', 'Activo'),
('La Pampa', 'Activo'),
('La Rioja', 'Activo'),
('Mendoza', 'Activo'),
('Misiones', 'Activo'),
('Neuquén', 'Activo'),
('Río Negro', 'Activo'),
('Salta', 'Activo'),
('San Juan', 'Activo'),
('San Luis', 'Activo'),
('Santa Cruz', 'Activo'),
('Santa Fe', 'Activo'),
('Santiago del Estero', 'Activo'),
('Tierra del Fuego', 'Activo'),
('Tucumán', 'Activo');
INSERT INTO localidad (nombre, codigo_postal, estado, fk_id_provincia) VALUES
-- Buenos Aires (ID 1)
('La Plata', 1900, 'Activo', 1), ('Mar del Plata', 7600, 'Activo', 1), ('Bahía Blanca', 8000, 'Activo', 1),
-- CABA (ID 2)
('Retiro', 1000, 'Activo', 2), ('Palermo', 1425, 'Activo', 2), ('Recoleta', 1113, 'Activo', 2),
-- Catamarca (ID 3)
('San Fernando del Valle', 4700, 'Activo', 3),
-- Chaco (ID 4)
('Resistencia', 3500, 'Activo', 4),
-- Chubut (ID 5)
('Rawson', 9103, 'Activo', 5), ('Puerto Madryn', 9120, 'Activo', 5),
-- Córdoba (ID 6)
('Córdoba Capital', 5000, 'Activo', 6), ('Villa Carlos Paz', 5152, 'Activo', 6), ('Río Cuarto', 5800, 'Activo', 6),
-- Corrientes (ID 7)
('Corrientes Capital', 3400, 'Activo', 7), ('Paso de los Libres', 3230, 'Activo', 7),
-- Entre Ríos (ID 8)
('Paraná', 3100, 'Activo', 8), ('Gualeguaychú', 2820, 'Activo', 8),
-- Formosa (ID 9)
('Formosa Capital', 3600, 'Activo', 9),
-- Jujuy (ID 10)
('San Salvador de Jujuy', 4600, 'Activo', 10),
-- La Pampa (ID 11)
('Santa Rosa', 6300, 'Activo', 11),
-- La Rioja (ID 12)
('La Rioja Capital', 5300, 'Activo', 12),
-- Mendoza (ID 13)
('Mendoza Capital', 5500, 'Activo', 13), ('San Rafael', 5600, 'Activo', 13),
-- Misiones (ID 14)
('Posadas', 3300, 'Activo', 14), ('Puerto Iguazú', 3370, 'Activo', 14),
-- Neuquén (ID 15)
('Neuquén Capital', 8300, 'Activo', 15),
-- Río Negro (ID 16)
('Viedma', 8500, 'Activo', 16), ('San Carlos de Bariloche', 8400, 'Activo', 16),
-- Salta (ID 17)
('Salta Capital', 4400, 'Activo', 17), ('Cafayate', 4427, 'Activo', 17),
-- San Juan (ID 18)
('San Juan Capital', 5400, 'Activo', 18),
-- San Luis (ID 19)
('San Luis Capital', 5700, 'Activo', 19), ('Villa Mercedes', 5730, 'Activo', 19),
-- Santa Cruz (ID 20)
('Río Gallegos', 9400, 'Activo', 20), ('El Calafate', 9405, 'Activo', 20),
-- Santa Fe (ID 21)
('Santa Fe Capital', 3000, 'Activo', 21), ('Rosario', 2000, 'Activo', 21), ('Rafaela', 2300, 'Activo', 21),
-- Santiago del Estero (ID 22)
('Santiago del Estero Capital', 4200, 'Activo', 22), ('La Banda', 4300, 'Activo', 22),
-- Tierra del Fuego (ID 23)
('Ushuaia', 9410, 'Activo', 23), ('Río Grande', 9420, 'Activo', 23),
-- Tucumán (ID 24)
('San Miguel de Tucumán', 4000, 'Activo', 24), ('Yerba Buena', 4107, 'Activo', 24);
INSERT INTO categoria (descripcion, estado) VALUES 
('Vinos', 'Activo'),
('Licores', 'Activo'),
('Refrescos', 'Activo'),
('Energeticos', 'Activo');

INSERT INTO rol (descripcion,estado) VALUES ('Administrador','Activo');
INSERT INTO rol (descripcion,estado) VALUES ('Cliente','Activo');
INSERT INTO rol (descripcion,estado) VALUES ('Vendedor','Activo');


/*FUNCIONES ALMACENADAS*/
CREATE PROCEDURE sp_crear_usuario
    @p_apellido VARCHAR(255),
    @p_contrasenia VARCHAR(255),
    @p_correoElectronico VARCHAR(255),
    @p_estado VARCHAR(20),
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
        fk_id_rol
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
        fk_id_provincia 
    FROM localidad 
    WHERE fk_id_provincia = @p_id_provincia;
END
GO

CREATE PROCEDURE sp_crearDomicilio
    @calle VARCHAR(255),
    @altura INT,
    @estado VARCHAR(50),
    @nombre_localidad VARCHAR(255),
    @id_usuario INT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @id_localidad INT;

    -- Buscamos el ID de la localidad haciendo match con el nombre que viene del Front
    SELECT @id_localidad = id_localidad 
    FROM localidad 
    WHERE nombre = @nombre_localidad;

    -- Si la localidad existe, procedemos a registrar el domicilio
    IF @id_localidad IS NOT NULL
    BEGIN
        INSERT INTO domicilio (calle, altura, estado, fk_id_localidad, fk_id_usuario)
        VALUES (@calle, @altura, @estado, @id_localidad, @id_usuario);
    END
    ELSE
    BEGIN
        -- En caso de que no encuentre la localidad por el nombre, lanzamos un error
        RAISERROR('Error: La localidad especificada no existe en la base de datos.', 16, 1);
    END
END;

CREATE PROCEDURE sp_crear_venta
    @fecha DATETIME2,
    @fk_id_usuario INT,
    @fecha_despacho DATE,
    @fecha_recepcion DATE,
    @estado_envio VARCHAR(20),
    @fk_id_metodo_pago INT,
    @fecha_pago DATE,
    @id_venta_generado INT OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Arranca en NULL. Si es mostrador, se queda así y se inserta directo en la Venta.
    DECLARE @generated_id_envio INT = NULL; 
    DECLARE @generated_id_pago INT;

    BEGIN TRANSACTION;
    BEGIN TRY
        
        
        IF (@estado_envio IS NOT NULL AND @estado_envio <> '')
        BEGIN
            INSERT INTO Envio (fecha_despacho, fecha_recepcion, estado)
            VALUES (@fecha_despacho, @fecha_recepcion, @estado_envio);
            
            -- Guardamos el ID real generado
            SET @generated_id_envio = SCOPE_IDENTITY();
        END
        -- Si no entra al IF (Venta Mostrador), @generated_id_envio sigue valiendo NULL.

        -- 2. Insertamos el Pago con un monto inicial provisorio (0.0)
        INSERT INTO Pago (monto_pago, fecha_pago, fk_id_metodo_pago)
        VALUES (0.0, @fecha_pago, @fk_id_metodo_pago);
        
        SET @generated_id_pago = SCOPE_IDENTITY();

        -- 3. Insertamos la Venta
        -- Si es mostrador, fk_id_envio se guardará como NULL de forma impecable.
        INSERT INTO Venta (fecha, total_venta, fk_id_usuario, fk_id_pago, fk_id_envio)
        VALUES (@fecha, 0.0, @fk_id_usuario, @generated_id_pago, @generated_id_envio);

        -- 4. Capturamos el ID de la Venta para devolverlo a Java
        SET @id_venta_generado = SCOPE_IDENTITY();

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH
END;
GO

/*UPDATES*/
UPDATE USUARIO 
SET fk_id_rol = 3 -- Vendedor
WHERE correo_electronico = 'fatimabret@gmail.com';

UPDATE USUARIO 
SET fk_id_rol = 1  -- Administrador
WHERE correo_electronico = 'arielgonzalezr9@gmail.com';

UPDATE cierre_turno 
SET estado = 'Inactivo'  -- Administrador
WHERE estado = 'Activo';