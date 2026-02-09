const { pool } = require('../../db');

module.exports = async function publishExam(req, res) {
  const { examId } = req.params;

  try {
    await pool.query(
      "update exams set status = 'published' where id = $1",
      [examId]
    );

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to publish exam' });
  }
};
