import express from 'express';
import { register, login, perfil } from '../controllers/auth.controller.js';
import authMiddleware from '../middleware/authmiddleware.js';
import { body } from 'express-validator';
import validateRequest from '../middleware/validateRequest.js';

const router = express.Router();

router.post(
  '/register',
  [
    body('nombre').notEmpty().withMessage('El nombre es obligatorio'),
    body('email').isEmail().withMessage('Email inválido'),
    body('contrasena').isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Email inválido'),
    body('contrasena').notEmpty().withMessage('La contraseña es obligatoria')
  ],
  validateRequest,
  login
);

router.get('/perfil', authMiddleware, perfil);

export default router;
