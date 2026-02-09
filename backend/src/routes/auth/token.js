const jwt = require('jsonwebtoken');

function issueToken(user) {
  return jwt.sign(
    { userId: user.id, role: user.role, institutionId: user.institution_id },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );
}

module.exports = { issueToken };
