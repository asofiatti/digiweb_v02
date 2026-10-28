import { Pool } from 'pg';

// O Pool gerencia as conexões com o banco de dados PostgreSQL de forma segura e eficiente
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Necessário para conexões seguras com o Supabase na nuvem
  }
});

export async function query(text: string, params?: any[]) {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
}