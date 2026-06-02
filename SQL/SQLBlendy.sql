CREATE DATABASE blendy;
USE blendy;




UPDATE producto 
SET precio_unitario = 75000 -- administrador
WHERE descripcion = 'Licor de Hierbas Italiano';

UPDATE producto 
SET stock = 1 -- administrador
WHERE descripcion = 'Vino Tinto Francés';

UPDATE producto 
SET stock_min = 0 -- administrador
WHERE stock_min = 1;

