import pool from '../config/db.js';

const tablasPermitidas = new Set(['usuarios', 'vehiculos', 'reservas']);

async function obtenerTablas() {
  const [rows] = await pool.query('SHOW TABLES');
  return rows.map(row => Object.values(row)[0]);
}

async function eliminarTablasNoPermitidas() {
  const tablas = await obtenerTablas();
  const aEliminar = tablas.filter(t => !tablasPermitidas.has(t));

  if (aEliminar.length === 0) {
    console.log('No hay tablas extra para eliminar.');
    return;
  }

  console.log('Eliminando tablas no permitidas:', aEliminar.join(', '));
  for (const tabla of aEliminar) {
    try {
      await pool.query(`DROP TABLE IF EXISTS \`${tabla}\``);
      console.log(`Eliminada: ${tabla}`);
    } catch (err) {
      console.error(`Error eliminando ${tabla}:`, err.message);
      throw err;
    }
  }
}

async function main() {
  try {
    await eliminarTablasNoPermitidas();
  } catch (err) {
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

await main();


