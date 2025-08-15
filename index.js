import pool from './config/db.js';

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import usuariosRoutes from './routes/usuarios.routes.js';
import vehiculosRoutes from './routes/vehiculos.routes.js';
import reservasRoutes from './routes/reservas.routes.js';
import authRoutes from './routes/auth.routes.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/usuarios', usuariosRoutes);
app.use('/vehiculos', vehiculosRoutes);
app.use('/reservas', reservasRoutes);
app.use('/auth', authRoutes);

// Endpoint para verificar conexión a DB
app.get('/api/test/db', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT NOW() as tiempo_actual, DATABASE() as database_name');
        
        res.json({
            success: true,
            message: 'Conexión a la base de datos exitosa',
            data: {
                timestamp: rows[0].tiempo_actual,
                database: rows[0].database_name,
                status: 'connected'
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error de conexión a la base de datos',
            error: error.message
        });
    }
});

// Endpoint para obtener información de tablas
app.get('/api/test/tables', async (req, res) => {
    try {
        const [rows] = await pool.query('SHOW TABLES');
        
        res.json({
            success: true,
            message: 'Tablas en la base de datos',
            tables: rows.map(row => Object.values(row)[0])
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error obteniendo tablas',
            error: error.message
        });
    }
});


// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Ruta no encontrada' });
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error('Error no controlado:', err);
  res.status(500).json({ success: false, message: 'Error interno del servidor' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
