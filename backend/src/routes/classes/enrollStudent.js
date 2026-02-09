const { pool } = require('../../db');

module.exports = async function enrollStudent(req, res) {
  const { classId } = req.params;
  const { studentId } = req.body;
  const { institutionId } = req.user;

  if (!studentId) {
    return res.status(400).json({ error: 'studentId is required' });
  }

  try {
    const classResult = await pool.query(
      'select id from classes where id = $1 and institution_id = $2',
      [classId, institutionId]
    );

    if (classResult.rowCount === 0) {
      return res.status(404).json({ error: 'Class not found' });
    }

    const studentResult = await pool.query(
      `select id from users
       where id = $1 and institution_id = $2 and role = 'student'`,
      [studentId, institutionId]
    );

    if (studentResult.rowCount === 0) {
      return res.status(404).json({ error: 'Student not found' });
    }

    await pool.query(
      `insert into class_memberships (class_id, student_id)
       values ($1, $2)
       on conflict do nothing`,
      [classId, studentId]
    );

    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to enroll student' });
  }
};
