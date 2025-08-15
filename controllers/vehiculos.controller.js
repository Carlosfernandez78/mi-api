import { pool } from "../config/db.js";
import { obtenerVehiculos, crearVehiculo as crearVehiculoModelo } from "../models/vehiculos.model.js";

// Listar todos los vehículos
export const listarVehiculos = async (req, res) => {
  try {
    const {
      marca,
      modelo,
      anio,
      disponible,
      page = 1,
      limit = 20,
      sortBy = 'id',
      sortDir = 'asc'
    } = req.query;

    const allowedSortBy = new Set(['id','marca','modelo','anio','disponible']);
    const orderByColumn = allowedSortBy.has(String(sortBy)) ? String(sortBy) : 'id';
    const orderDirection = String(sortDir).toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    const numericLimit = Math.min(Math.max(parseInt(limit, 10) || 20, 1), 100);
    const numericPage = Math.max(parseInt(page, 10) || 1, 1);
    const offset = (numericPage - 1) * numericLimit;

    const whereParts = [];
    const whereParams = [];

    if (marca) {
      whereParts.push('marca LIKE ?');
      whereParams.push(`%${marca}%`);
    }
    if (modelo) {
      whereParts.push('modelo LIKE ?');
      whereParams.push(`%${modelo}%`);
    }
    if (anio) {
      whereParts.push('anio = ?');
      whereParams.push(parseInt(anio, 10));
    }
    if (typeof disponible !== 'undefined') {
      const dispo = (String(disponible) === 'true' || String(disponible) === '1') ? 1 : 0;
      whereParts.push('disponible = ?');
      whereParams.push(dispo);
    }

    const whereClause = whereParts.length ? `WHERE ${whereParts.join(' AND ')}` : '';

    // Total para paginación
    const [countRows] = await pool.query(
      `SELECT COUNT(*) AS total FROM vehiculos ${whereClause}`,
      whereParams
    );
    const total = countRows[0]?.total || 0;

    // Datos paginados
    const [rows] = await pool.query(
      `SELECT *
       FROM vehiculos
       ${whereClause}
       ORDER BY ${orderByColumn} ${orderDirection}
       LIMIT ? OFFSET ?`,
      [...whereParams, numericLimit, offset]
    );

    const totalPages = Math.ceil(total / numericLimit) || 1;

    res.json({
      data: rows,
      pagination: {
        total,
        page: numericPage,
        limit: numericLimit,
        totalPages
      }
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener vehículos" });
  }
};

// Ver un vehículo por ID
export const verVehiculo = async (req, res) => {
  try {
    const id = req.params.id;
    const [vehiculo] = await pool.query("SELECT * FROM vehiculos WHERE id = ?", [id]);
    if (vehiculo.length === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json(vehiculo[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener el vehículo" });
  }
};

// Crear un vehículo
export const crearVehiculo = async (req, res) => {
  try {
    const id = await crearVehiculoModelo(req.body);
    res.status(201).json({ id, ...req.body });
  } catch (error) {
    res.status(500).json({ error: "Error al crear vehículo" });
  }
};

// Actualizar un vehículo
export const actualizarVehiculo = async (req, res) => {
  try {
    const id = req.params.id;
    const { marca, modelo, anio, disponible } = req.body;
    const [result] = await pool.query(
      "UPDATE vehiculos SET marca = ?, modelo = ?, anio = ?, disponible = ? WHERE id = ?",
      [marca, modelo, anio, disponible, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Vehículo no encontrado" });
    }
    res.json({ mensaje: "Vehículo actualizado" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar vehículo" });
  }
};

// Eliminar un vehículo
export const eliminarVehiculo = async (req, res) => {
  try {
    const id = req.params.id;
    
    // Verificar si el vehículo existe antes de eliminarlo
    const [vehiculoExistente] = await pool.query("SELECT * FROM vehiculos WHERE id = ?", [id]);
    
    if (vehiculoExistente.length === 0) {
      return res.status(404).json({ 
        success: false,
        error: "Vehículo no encontrado" 
      });
    }

    // Eliminar el vehículo
    const [result] = await pool.query("DELETE FROM vehiculos WHERE id = ?", [id]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ 
        success: false,
        error: "No se pudo eliminar el vehículo" 
      });
    }

    res.json({ 
      success: true,
      mensaje: "Vehículo eliminado correctamente",
      vehiculoEliminado: vehiculoExistente[0]
    });
    
  } catch (error) {
    console.error('Error al eliminar vehículo:', error);
    res.status(500).json({ 
      success: false,
      error: "Error al eliminar vehículo" 
    });
  }
};

// Vehículos disponibles (lógica pendiente)
export const vehiculosDisponibles = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;

    // Si no hay rango de fechas, devolver por flag 'disponible'
    if (!fecha_inicio || !fecha_fin) {
      const [rows] = await pool.query("SELECT * FROM vehiculos WHERE disponible = 1");
      return res.json(rows);
    }

    // Consulta que excluye solapamientos con reservas no canceladas
    const [rows] = await pool.query(
      `SELECT v.*
       FROM vehiculos v
       WHERE v.disponible = 1
         AND NOT EXISTS (
           SELECT 1
           FROM reservas r
           WHERE r.vehiculo_id = v.id
             AND r.estado <> 'cancelada'
             AND NOT (r.fecha_fin < ? OR r.fecha_inicio > ?)
         )`,
      [fecha_inicio, fecha_fin]
    );
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener vehículos disponibles" });
  }
};