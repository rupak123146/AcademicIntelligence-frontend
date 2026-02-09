const express = require('express');
const { requireAuth, requireRole } = require('../../middleware/auth');
const addQuestion = require('./addQuestion');
const assignExam = require('./assignExam');
const createExam = require('./createExam');
const publishExam = require('./publishExam');

const router = express.Router();

router.post('/', requireAuth, requireRole(['educator', 'admin']), createExam);
router.post('/:examId/questions', requireAuth, requireRole(['educator', 'admin']), addQuestion);
router.post('/:examId/publish', requireAuth, requireRole(['educator', 'admin']), publishExam);
router.post('/:examId/assign', requireAuth, requireRole(['educator', 'admin']), assignExam);

module.exports = router;
