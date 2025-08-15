import { pool } from "../config/db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { validationResult } from 'express-validator';

// Registro de usuario
export const register = async (req, res) => {
  const { nombre, email, contrasena, rol } = req.body;
  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }
  try {
    const hashedPassword = await bcrypt.hash(contrasena, 10);
    const [result] = await pool.query(
      "INSERT INTO usuarios (nombre, email, contrasena, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol || "cliente"]
    );
    res.status(201).json({ id: result.insertId, nombre, email, rol: rol || "cliente" });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al registrar usuario", error: error.message });
  }
};

// Login de usuario
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errores: errors.array() });
  }
  const { email, contrasena } = req.body;
  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: "Faltan datos obligatorios" });
  }
  try {
    const [rows] = await pool.query("SELECT * FROM usuarios WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ mensaje: "Usuario no encontrado" });

    const usuario = rows[0];
    const passwordOk = await bcrypt.compare(contrasena, usuario.contrasena);
    if (!passwordOk) return res.status(401).json({ mensaje: "Contraseña incorrecta" });

    const token = jwt.sign(
      { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ mensaje: "Error al iniciar sesión", error: error.message });
  }
};

// Perfil del usuario autenticado
export const perfil = async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, nombre, email, rol FROM usuarios WHERE id = ?", [req.user.id]);
    if (rows.length === 0) return res.status(404).json({ mensaje: "Usuario no encontrado" });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ mensaje: "Error al obtener perfil", error: error.message });
  }
};
