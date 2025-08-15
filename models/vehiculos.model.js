import { pool } from "../config/db.js";

// Obtener todos los vehículos
export const obtenerVehiculos = async () => {
  const [rows] = await pool.query("SELECT * FROM vehiculos");
  return rows;
};

// Crear un vehículo
export const crearVehiculo = async ({ marca, modelo, anio, disponible }) => {
  const [result] = await pool.query(
    "INSERT INTO vehiculos (marca, modelo, anio, disponible) VALUES (?, ?, ?, ?)",
    [marca, modelo, anio, disponible]
  );
  return result.insertId;
};

// Obtener un vehículo por ID
export const obtenerVehiculoPorId = async (id) => {
  const [rows] = await pool.query("SELECT * FROM vehiculos WHERE id = ?", [id]);
  return rows[0];
};

// Actualizar un vehículo
export const actualizarVehiculoPorId = async (id, { marca, modelo, anio, disponible }) => {
  const [result] = await pool.query(
    "UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, disponible = ? WHERE id = ?",
    [marca, modelo, anio, disponible, id]
  );
  return result.affectedRows;
};

