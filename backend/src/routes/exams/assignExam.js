const { pool } = require('../../db');

module.exports = async function assignExam(req, res) {
  const { examId } = req.params;
  const { classId } = req.body;
  const { institutionId } = req.user;

  if (!classId) {
    return res.status(400).json({ error: 'classId is required' });
  }

  try {
    const examResult = await pool.query(
      'select id from exams where id = $1 and institution_id = $2',
      [examId, institutionId]
    );

    if (examResult.rowCount === 0) {
      return res.status(404).json({ error: 'Exam not found' });
    }

    const classResult = await pool.query(
      'select id from classes where id = $1 and institution_id = $2',
      [classId, institutionId]
    );

    if (classResult.rowCount === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    await pool.query(
      `insert into exam_assignments (exam_id, class_id)
       values ($1, $2)
       on conflict do nothing`,
      [examId, classId]
    );

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to assign exam' });
  }
};
