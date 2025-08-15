import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from '../config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readSqlFile(relativePath) {
	const absolutePath = path.resolve(__dirname, '..', relativePath);
	const content = await fs.readFile(absolutePath, 'utf8');
	return content;
}

function normalizeCreateTableStatements(sql) {
	// Asegura que los CREATE TABLE usen IF NOT EXISTS (case-insensitive)
	return sql.replace(/CREATE\s+TABLE\s+(?!IF\s+NOT\s+EXISTS)/gi, 'CREATE TABLE IF NOT EXISTS ');
}

function splitSqlStatements(sql) {
	// Divide por ';' respetando que nuestro SQL es simple (sin procedimientos)
	return sql
		.split(';')
		.map(stmt => stmt.trim())
		.filter(stmt => stmt.length > 0);
}

async function executeStatements(statements) {
	for (const statement of statements) {
		try {
			await pool.query(statement);
			console.log(`[OK] ${statement.substring(0, 60)}${statement.length > 60 ? '...' : ''}`);
		} catch (error) {
			console.error(`[ERROR] Ejecutando: ${statement}`);
			console.error(error.message);
			throw error;
		}
	}
}

async function main() {
	try {
		const rawSql = await readSqlFile('config/mi_api.sql');
		const normalizedSql = normalizeCreateTableStatements(rawSql);
		const statements = splitSqlStatements(normalizedSql);
		if (statements.length === 0) {
			console.log('No se encontraron sentencias SQL para ejecutar.');
			return;
		}
		console.log(`Ejecutando ${statements.length} sentencias SQL...`);
		await executeStatements(statements);
		console.log('Aplicación de SQL finalizada.');
	} catch (error) {
		console.error('Fallo aplicando SQL:', error.message);
		process.exitCode = 1;
	} finally {
		await pool.end();
	}
}

await main();


