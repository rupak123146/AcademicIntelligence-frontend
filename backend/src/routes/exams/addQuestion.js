const { pool } = require('../../db');

module.exports = async function addQuestion(req, res) {
  const { examId } = req.params;
  const { questionText, difficulty, options, correctIndex, marks, negativeMarks } = req.body;
  const { userId, institutionId } = req.user;

  if (!questionText || !difficulty || !Array.isArray(options) || options.length < 2) {
    return res.status(400).json({ error: 'Invalid question payload' });
  }

  const client = await pool.connect();
  try {
    // Transaction ensures question + options + exam linkage are consistent.
    await client.query('begin');

    const questionResult = await client.query(
      `insert into questions (institution_id, created_by, question_text, difficulty)
       values ($1, $2, $3, $4)
       returning id`,
      [institutionId, userId, questionText, difficulty]
    );

    const questionId = questionResult.rows[0].id;

    for (let i = 0; i < options.length; i += 1) {
      await client.query(
        `insert into question_options (question_id, option_text, is_correct)
         values ($1, $2, $3)`,
        [questionId, options[i], i === correctIndex]
      );
    }

    await client.query(
      `insert into exam_questions (exam_id, question_id, marks, negative_marks, order_index)
       values ($1, $2, $3, $4, $5)`,
      [examId, questionId, marks || 1, negativeMarks || 0, 0]
    );

    await client.query('commit');
    return res.status(201).json({ questionId });
  } catch (err) {
    await client.query('rollback');
    return res.status(500).json({ error: 'Failed to add question' });
  } finally {
    client.release();
  }
};
