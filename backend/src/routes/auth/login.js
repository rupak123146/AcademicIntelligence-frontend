const bcrypt = require('bcryptjs');
const { pool } = require('../../db');
const { issueToken } = require('./token');

module.exports = async function login(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const result = await pool.query(
      'select id, role, institution_id, password_hash from users where email = $1',
      [email]
    );

    if (result.rowCount === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];
    const ok = await bcrypt.compare(password, user.password_hash);

    if (!ok) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = issueToken(user);
    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed' });
  }
};
