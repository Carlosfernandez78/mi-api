import pool from '../config/db.js';

const vehiculos = [
	{ marca: 'Toyota', modelo: 'Yaris', anio: 2019, disponible: true },
	{ marca: 'Toyota', modelo: 'RAV4', anio: 2021, disponible: true },
	{ marca: 'Honda', modelo: 'Civic', anio: 2020, disponible: true },
	{ marca: 'Honda', modelo: 'CR-V', anio: 2018, disponible: true },
	{ marca: 'Ford', modelo: 'Focus', anio: 2017, disponible: true },
	{ marca: 'Ford', modelo: 'Escape', anio: 2022, disponible: true },
	{ marca: 'Chevrolet', modelo: 'Onix', anio: 2020, disponible: true },
	{ marca: 'Chevrolet', modelo: 'Tracker', anio: 2021, disponible: true },
	{ marca: 'Volkswagen', modelo: 'Gol', anio: 2019, disponible: true },
	{ marca: 'Volkswagen', modelo: 'T-Cross', anio: 2022, disponible: true }
];

async function existeVehiculo({ marca, modelo, anio }) {
	const [rows] = await pool.query(
		'SELECT id FROM vehiculos WHERE marca = ? AND modelo = ? AND anio = ? LIMIT 1',
		[marca, modelo, anio]
	);
	return rows.length > 0;
}

async function insertarVehiculo(v) {
	const [result] = await pool.query(
		'INSERT INTO vehiculos (marca, modelo, anio, disponible) VALUES (?, ?, ?, ?)',
		[v.marca, v.modelo, v.anio, v.disponible ? 1 : 0]
	);
	return result.insertId;
}

async function main() {
	let insertados = 0;
	for (const v of vehiculos) {
		// omite si ya existe (idempotente)
		const yaExiste = await existeVehiculo(v);
		if (yaExiste) continue;
		await insertarVehiculo(v);
		insertados++;
	}
	console.log(`Vehículos insertados: ${insertados}`);
	await pool.end();
}

await main();


