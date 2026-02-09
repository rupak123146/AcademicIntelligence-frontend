const bcrypt = require('bcryptjs');
const { pool } = require('../../db');
const { issueToken } = require('./token');

module.exports = async function register(req, res) {
  const { institutionId, role, fullName, email, password } = req.body;

  if (!institutionId || !role || !fullName || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);

    const result = await pool.query(
      `insert into users (institution_id, role, full_name, email, password_hash)
       values ($1, $2, $3, $4, $5)
       returning id, role, institution_id`,
      [institutionId, role, fullName, email, passwordHash]
    );

    const user = result.rows[0];
    const token = issueToken(user);

    return res.status(201).json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Registration failed' });
  }
};
