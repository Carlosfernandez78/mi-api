// controllers/usuariosController.js
import { pool } from "../config/db.js";

export const listarUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre, email, rol FROM usuarios");
    res.json(rows);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener usuarios", error: error.message });
  }
};

export const crearUsuario = async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;

  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    // Evitar duplicados por email
    const [existentes] = await pool.query("SELECT id FROM usuarios WHERE email = ?", [email]);
    if (existentes.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado' });
    }

    // Hash de contraseña
    const bcrypt = await import('bcryptjs');
    const hashed = await bcrypt.default.hash(contrasena, 10);

    const [resultado] = await pool.query(
      "INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashed, rol || 'cliente']
    );

    res.status(201).json({
      id: resultado.insertId,
      nombre,
      email,
      rol: rol || 'cliente',
      mensaje: "Usuario creado exitosamente"
    });
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};