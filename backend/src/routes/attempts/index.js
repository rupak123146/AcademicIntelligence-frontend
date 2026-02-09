const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const submitAttempt = require('./submitAttempt');

const router = express.Router();

router.post('/:examId/submit', requireAuth, requireRole(['student']), submitAttempt);

module.exports = router;
