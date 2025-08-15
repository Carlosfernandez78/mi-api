import express from 'express';
import { obtenerUsuarios, crearUsuario } from "../controllers/usuarios.controller.js";
import authMiddleware from '../middleware/authmiddleware.js';
import verificarAdmin from '../middleware/admin.js';
const router = express.Router();

router.get('/', authMiddleware, verificarAdmin, obtenerUsuarios);
router.post('/', crearUsuario);

export default router;
