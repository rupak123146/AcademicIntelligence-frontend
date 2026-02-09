const { pool } = require('../../db');

module.exports = async function createExam(req, res) {
  const { title, description, totalMarks, durationMinutes } = req.body;
  const { userId, institutionId } = req.user;

  if (!title) {
    return res.status(400).json({ error: 'Title is required' });
  }

  try {
    const result = await pool.query(
      `insert into exams (institution_id, created_by, title, description, total_marks, duration_minutes)
       values ($1, $2, $3, $4, $5, $6)
       returning id`,
      [institutionId, userId, title, description || null, totalMarks || 0, durationMinutes || 0]
    );

    return res.status(201).json({ examId: result.rows[0].id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create exam' });
  }
};
