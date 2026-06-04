import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';
import pool from './db/connection';

async function testConnection() {
  try {
    const conn = await pool.getConnection();

    const [rows] = await conn.query('SELECT NOW()');

    console.log('DB Connected', rows);

    conn.release();
  } catch (err) {
    console.error('DB Error', err);
  }
}

testConnection();

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routes);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
