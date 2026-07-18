const express = require('express');
const cors = require('cors');
const path = require('path');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/members', require('./routes/member'));
app.use('/api/trainers', require('./routes/trainer'));
app.use('/api/workouts', require('./routes/workout'));
app.use('/api/diets', require('./routes/diet'));
app.use('/api/equipment', require('./routes/equipment'));
app.use('/api/attendance', require('./routes/attendance'));
app.use('/api/messages', require('./routes/message'));
app.use('/api/notifications', require('./routes/notification'));
app.use('/api/dashboard', require('./routes/dashboard'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use(errorHandler);

module.exports = app;
