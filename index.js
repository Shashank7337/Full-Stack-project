const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.post('/signup', async (req, res) => {
  const { email, role } = req.body; 
  const result = await pool.query('INSERT INTO users (email, role) VALUES ($1, $2) RETURNING *', [email, role]);
  res.json(result.rows[0]);
});

app.post('/tasks', async (req, res) => {
  const { title, status, admin_email } = req.body;
  const user = await pool.query('SELECT role FROM users WHERE email = $1', [admin_email]);
  
  if (user.rows[0]?.role !== 'ADMIN') return res.status(403).send("Only Admins can create tasks");
  
  const result = await pool.query('INSERT INTO tasks (title, status) VALUES ($1, $2) RETURNING *', [title, status]);
  res.json(result.rows[0]);
});

app.get('/dashboard', async (req, res) => {
  const tasks = await pool.query('SELECT status, count(*) FROM tasks GROUP BY status');
  res.json(tasks.rows);
});

app.get('/', (req, res) => res.send('Project Manager API is Live!'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
