import express from "express";
import {
  listarReservas,
  reservasPorUsuario,
  crearReserva,
  actualizarReserva,
  eliminarReserva
} from "../controllers/reservas.controller.js";

import authMiddleware from "../middleware/authmiddleware.js";
import { body } from "express-validator";
import validateRequest from "../middleware/validateRequest.js";

const router = express.Router();

router.get("/", authMiddleware, listarReservas);
router.get("/usuario/:id", authMiddleware, reservasPorUsuario);
router.post(
  "/",
  authMiddleware,
  [
    body('usuario_id').isInt(),
    body('vehiculo_id').isInt(),
    body('fecha_inicio').isISO8601(),
    body('fecha_fin').isISO8601(),
    body('estado').optional().isIn(['pendiente','confirmada','cancelada'])
  ],
  validateRequest,
  crearReserva
);
router.put(
  "/:id",
  authMiddleware,
  [
    body('usuario_id').optional().isInt(),
    body('vehiculo_id').optional().isInt(),
    body('fecha_inicio').optional().isISO8601(),
    body('fecha_fin').optional().isISO8601(),
    body('estado').optional().isIn(['pendiente','confirmada','cancelada'])
  ],
  validateRequest,
  actualizarReserva
);
router.delete("/:id", authMiddleware, eliminarReserva);

export default router;
