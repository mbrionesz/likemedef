import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { pool } from './database/config.js'; // Importa el pool de configuración
import morgan from 'morgan';


const app = express();
const port = process.env.PORT || 3001;

// Habilitar CORS
app.use(cors());
app.use(bodyParser.json());

// Middleware para el logging
app.use(morgan('combined'));

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend para Like Me');
});

// Ruta para obtener todos los posts
app.get('/posts', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM posts');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

// Ruta para agregar un nuevo post
app.post('/posts', async (req, res) => {
  const { titulo, img, descripcion } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO posts (titulo, img, descripcion, likes) VALUES ($1, $2, $3, 0) RETURNING *',
      [titulo, img, descripcion]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error en el servidor');
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
