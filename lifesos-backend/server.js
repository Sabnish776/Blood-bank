const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const donorRoutes = require('./routes/donor');
const hospRoutes = require('./routes/hosp');
const sosRoutes = require('./routes/sos');

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/donor', donorRoutes);
app.use('/hosp', hospRoutes);
app.use('/sos', sosRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
