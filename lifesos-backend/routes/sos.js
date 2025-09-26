const express = require('express');
const db = require('../db');
const router = express.Router();

// POST /sos/create
router.post('/create', async (req, res) => {
  const { hospital_id, blood_type, units, lat, lng, radius_km } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO sos_requests (hospital_id, blood_type, units, lat, lng, radius_km)
       VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [hospital_id, blood_type, units, lat, lng, radius_km]
    );

    // Find matching donors
    const donors = await db.query(`
      SELECT * FROM donors
      WHERE blood_type=$1 AND opt_in=true
      AND (last_donation_date IS NULL OR last_donation_date <= NOW() - INTERVAL '90 days')
    `,[blood_type]);

    res.json({ sos: result.rows[0], notified: donors.rowCount });
  } catch (err) {
    res.status(500).json({ error: 'SOS creation failed' });
  }
});

// POST /sos/verify-donation
router.post('/verify-donation', async (req, res) => {
  const { donor_id, hospital_id } = req.body;
  try {
    await db.query(
      `UPDATE donors SET last_donation_date=NOW(), points=points+100 WHERE id=$1`,
      [donor_id]
    );
    await db.query(
      `INSERT INTO donation_logs (donor_id, hospital_id, date, verified, donation_type)
       VALUES ($1,$2,NOW(),true,'whole blood')`,
      [donor_id, hospital_id]
    );
    res.json({ message: 'Donation verified' });
  } catch (err) {
    res.status(500).json({ error: 'Verification failed' });
  }
});

module.exports = router;
