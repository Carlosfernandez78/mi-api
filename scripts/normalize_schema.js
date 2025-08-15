import pool from '../config/db.js';

async function getColumns(table) {
	const [rows] = await pool.query(`DESCRIBE \`${table}\``);
	return rows.map(r => r.Field);
}

async function ensureUsuarioContrasenaColumn() {
	const columns = await getColumns('usuarios');
	const hasContrasena = columns.includes('contrasena');
	const hasContraTilde = columns.includes('contraseña');

	if (hasContrasena) {
		console.log('usuarios.contrasena ya existe.');
		return;
	}

	if (hasContraTilde) {
		console.log('Renombrando columna `contraseña` -> `contrasena`...');
		await pool.query('ALTER TABLE `usuarios` CHANGE COLUMN `contraseña` `contrasena` VARCHAR(255) NOT NULL');
		console.log('Renombrada correctamente.');
		return;
	}

	console.log('Agregando columna `contrasena` a `usuarios`...');
	await pool.query('ALTER TABLE `usuarios` ADD COLUMN `contrasena` VARCHAR(255) NOT NULL AFTER `email`');
	console.log('Columna agregada.');
}

async function ensureUsuarioRolColumn() {
	const columns = await getColumns('usuarios');
	if (columns.includes('rol')) {
		console.log('usuarios.rol ya existe.');
		return;
	}
	console.log('Agregando columna `rol` a `usuarios`...');
	await pool.query("ALTER TABLE `usuarios` ADD COLUMN `rol` ENUM('cliente','admin') DEFAULT 'cliente' AFTER `contrasena`");
	console.log('Columna `rol` agregada.');
}

async function dropUsuarioPasswordIfExists() {
	const columns = await getColumns('usuarios');
	if (!columns.includes('password')) {
		console.log('usuarios.password no existe.');
		return;
	}
	console.log('Eliminando columna obsoleta `password` de `usuarios`...');
	await pool.query('ALTER TABLE `usuarios` DROP COLUMN `password`');
	console.log('Columna `password` eliminada.');
}

async function main() {
	try {
		await ensureUsuarioContrasenaColumn();
		await ensureUsuarioRolColumn();
		await dropUsuarioPasswordIfExists();
	} catch (err) {
		console.error('Error normalizando esquema:', err.message);
		process.exitCode = 1;
	} finally {
		await pool.end();
	}
}

await main();


