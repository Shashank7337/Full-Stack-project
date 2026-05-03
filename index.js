const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

app.get('/', (req, res) => res.send('Server is LIVE and Running!'));

app.listen(process.env.PORT || 3000, () => console.log('Server started'));
