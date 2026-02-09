const { pool } = require('../../db');

module.exports = async function createClass(req, res) {
  const { name, academicYear } = req.body;
  const { institutionId } = req.user;

  if (!name) {
    return res.status(400).json({ error: 'name is required' });
  }

  try {
    const result = await pool.query(
      `insert into classes (institution_id, name, academic_year)
       values ($1, $2, $3)
       returning id`,
      [institutionId, name, academicYear || null]
    );

    return res.status(201).json({ classId: result.rows[0].id });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create class' });
  }
};
