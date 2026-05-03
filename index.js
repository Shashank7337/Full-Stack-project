const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(express.static('public'));
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/signup', async (req, res) => {
  try {
    const { email, role } = req.body;
    const result = await pool.query(
      'INSERT INTO users (email, role) VALUES ($1, $2) ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role RETURNING *',
      [email, role || 'MEMBER']
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/all-users', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, email, role FROM users ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/tasks', async (req, res) => {
  try {
    const { title, status, admin_email } = req.body;
    const userCheck = await pool.query('SELECT role FROM users WHERE email = $1', [admin_email]);
    if (userCheck.rows.length === 0 || userCheck.rows[0].role !== 'ADMIN') {
      return res.status(403).json({ error: "Access Denied" });
    }
    const result = await pool.query('INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *', [title, status]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/dashboard-stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT COUNT(*) as total,
      COUNT(*) FILTER (WHERE status = 'TODO') as pending,
      COUNT(*) FILTER (WHERE status = 'DONE') as completed
      FROM tasks
    `);
    res.json(stats.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
