import pkg from 'pg';
const { Client } = pkg;

export async function queryJobs(query) {
  const client = new Client({
    host: process.env.DB_HOST || 'your-db-host.yourdomain.com',
    port: parseInt(process.env.DB_PORT || '5432'),
    database: process.env.DB_NAME || 'your_database_name',
    user: process.env.DB_USER || 'your_db_user',
    password: process.env.DB_PASSWORD || 'your_db_password',
    ssl: {
      rejectUnauthorized: false,
    },
  });

  try {
    await client.connect();
    const res = await client.query(query);
    return res.rows;
  } catch (err) {
    console.error('DB Error:', err);
    throw err;
  } finally {
    await client.end();
  }
}
