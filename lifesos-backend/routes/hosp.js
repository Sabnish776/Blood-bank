const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /hosp/login (demo)
router.post('/login', async (req, res) => {
  const { phone, auth_key } = req.body;
  try {
    const hosp = await db.query(
      `SELECT * FROM hospitals WHERE phone=$1 AND auth_key=$2`,
      [phone, auth_key]
    );
    if (hosp.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ hospital: hosp.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
});

module.exports = router;
