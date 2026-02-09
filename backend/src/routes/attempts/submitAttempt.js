const { pool } = require('../../db');

module.exports = async function submitAttempt(req, res) {
  const { examId } = req.params;
  const { answers } = req.body;
  const { userId } = req.user;

  if (!Array.isArray(answers) || answers.length === 0) {
    return res.status(400).json({ error: 'Answers are required' });
  }

  const client = await pool.connect();
  try {
    // Transaction keeps scoring and answers in sync.
    await client.query('begin');

    const correctOptionsResult = await client.query(
      `select eq.question_id, eq.marks, eq.negative_marks, qo.id as correct_option_id
       from exam_questions eq
       join question_options qo on qo.question_id = eq.question_id and qo.is_correct = true
       where eq.exam_id = $1`,
      [examId]
    );

    const correctByQuestionId = new Map();
    let maxScore = 0;
    for (const row of correctOptionsResult.rows) {
      correctByQuestionId.set(row.question_id, {
        correctOptionId: row.correct_option_id,
        marks: row.marks,
        negativeMarks: row.negative_marks
      });
      maxScore += row.marks;
    }

    const attemptResult = await client.query(
      `insert into attempts (exam_id, student_id, max_score)
       values ($1, $2, $3)
       returning id`,
      [examId, userId, maxScore]
    );

    const attemptId = attemptResult.rows[0].id;

    let score = 0;
    let correctCount = 0;

    for (const answer of answers) {
      const config = correctByQuestionId.get(answer.questionId);
      if (!config) {
        continue;
      }

      const isCorrect = answer.selectedOptionId === config.correctOptionId;
      if (isCorrect) {
        score += config.marks;
        correctCount += 1;
      } else {
        score -= config.negativeMarks;
      }

      await client.query(
        `insert into attempt_answers (attempt_id, question_id, selected_option_id, is_correct, time_spent_sec)
         values ($1, $2, $3, $4, $5)`,
        [attemptId, answer.questionId, answer.selectedOptionId || null, isCorrect, answer.timeSpentSec || 0]
      );
    }

    const accuracy = answers.length > 0 ? (100 * correctCount) / answers.length : 0;

    await client.query(
      `update attempts
       set submitted_at = now(), score = $1, accuracy = $2
       where id = $3`,
      [score, accuracy.toFixed(2), attemptId]
    );

    await client.query('commit');
    return res.json({ attemptId, score, maxScore, accuracy: Number(accuracy.toFixed(2)) });
  } catch (err) {
    await client.query('rollback');
    return res.status(500).json({ error: 'Submission failed' });
  } finally {
    client.release();
  }
};
