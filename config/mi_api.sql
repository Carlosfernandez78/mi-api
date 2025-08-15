CREATE TABLE usuarios (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nombre VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NULL,
  contrasena VARCHAR(255) NOT NULL,
  rol ENUM('cliente', 'admin') DEFAULT 'cliente'
);

CREATE TABLE vehiculos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  marca VARCHAR(50) NOT NULL,
  modelo VARCHAR(50) NOT NULL,
  anio INT NOT NULL,
  disponible BOOLEAN DEFAULT TRUE
);

CREATE TABLE reservas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  usuario_id INT NOT NULL,
  vehiculo_id INT NOT NULL,
  fecha_inicio DATE NOT NULL,
  fecha_fin DATE NOT NULL,
  estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
  FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
  FOREIGN KEY (vehiculo_id) REFERENCES vehiculos(id)
);

