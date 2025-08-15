-- Normaliza nombres de columnas (evita caracteres especiales)
-- Ejecutar en la base seleccionada (usa: USE mi_api;)

-- Usuarios: contraseña -> contrasena
ALTER TABLE usuarios
  CHANGE COLUMN `contraseña` `contrasena` VARCHAR(255) NOT NULL;

-- Vehiculos: año -> anio
ALTER TABLE vehiculos
  CHANGE COLUMN `año` `anio` INT NOT NULL;

-- Opcional (recomendado): asegurarse que email no sea NULL
-- Nota: si tienes filas con email NULL, corrígelas antes de ejecutar esto
-- ALTER TABLE usuarios MODIFY COLUMN email VARCHAR(100) NOT NULL UNIQUE;

