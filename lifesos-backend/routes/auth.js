const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /auth/donor/signup
router.post('/donor/signup', async (req, res) => {
  const { name, phone, blood_type, gender } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO donors (name, phone, blood_type, gender)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [name, phone, blood_type, gender]
    );
    res.json({ donor: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Signup failed' });
  }
});

module.exports = router;
