import pg from 'pg';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createDatabase = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: 'postgres' // Conectar a la base de datos 'postgres' para crear la nueva base de datos
  });

  try {
    await client.connect();
    await client.query(`CREATE DATABASE ${process.env.DB_NAME}`);
    console.log(`Base de datos "${process.env.DB_NAME}" creada.`);
  } catch (err) {
    if (err.code === '42P04') {
      console.log(`Base de datos "${process.env.DB_NAME}" ya existe.`);
    } else {
      console.error('Error creando la base de datos:', err);
    }
  } finally {
    await client.end();
  }
};

const initDb = async () => {
  const client = new Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    password: process.env.DB_PASS,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME
  });

  try {
    await client.connect();
    const sqlPath = path.join(__dirname, 'init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    await client.query(sql);
    console.log('Tabla "posts" creada o ya existente.');
  } catch (err) {
    console.error('Error inicializando la base de datos:', err);
  } finally {
    await client.end();
  }
};

const ensureDatabase = async () => {
  await createDatabase();

  await new Promise(resolve => setTimeout(resolve, 1000));
  await initDb();
};

await ensureDatabase();

const pool = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASS,
  port: process.env.DB_PORT,
});

pool.connect().catch(err => {
  console.error('Error conectando a la base de datos:', err);
});

export { pool };
