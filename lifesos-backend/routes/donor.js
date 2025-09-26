const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /donor/optin
router.post('/optin', async (req, res) => {
  const { donor_id, lat, lng, opt_in_radius_km } = req.body;
  try {
    await db.query(
      `UPDATE donors SET lat=$1, lng=$2, opt_in_radius_km=$3, opt_in=true WHERE id=$4`,
      [lat, lng, opt_in_radius_km, donor_id]
    );
    res.json({ message: 'Opt-in updated' });
  } catch (err) {
    res.status(500).json({ error: 'Opt-in failed' });
  }
});

// POST /donor/respond
router.post('/respond', async (req, res) => {
  const { sos_id, donor_id } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO responses (sos_id, donor_id, status) VALUES ($1,$2,'accepted') RETURNING *`,
      [sos_id, donor_id]
    );
    res.json({ response: result.rows[0] });
  } catch (err) {
    res.status(500).json({ error: 'Response failed' });
  }
});

module.exports = router;
