const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const createClass = require('./createClass');
const enrollStudent = require('./enrollStudent');

const router = express.Router();

router.post('/', requireAuth, requireRole(['educator', 'admin']), createClass);
router.post('/:classId/enroll', requireAuth, requireRole(['educator', 'admin']), enrollStudent);

module.exports = router;
