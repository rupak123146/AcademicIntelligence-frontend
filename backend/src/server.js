require('dotenv').config();
const express = require('express');
const authRoutes = require('./routes/auth');
const examRoutes = require('./routes/exams');
const attemptRoutes = require('./routes/attempts');
const classRoutes = require('./routes/classes');

const app = express();
const port = Number(process.env.PORT || 4000);

app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.use('/api/auth', authRoutes);
app.use('/api/exams', examRoutes);
app.use('/api/exams', attemptRoutes);
app.use('/api/classes', classRoutes);

app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
