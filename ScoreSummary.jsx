import React from 'react';
import '../../pages/styles/Result.css';

const ScoreSummary = ({ result }) => {
  if (!result) return null;

  const { score = 0, totalMarks = 0, correctAnswers = 0, incorrectAnswers = 0, totalQuestions = 0, percentage = 0 } = result;

  const correctPct = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  const incorrectPct = totalQuestions > 0 ? Math.round((incorrectAnswers / totalQuestions) * 100) : 0;

  return (
    <div className="score-summary-card">
      <div className="score-top">
        <div className="score-main">
          <div className="score-label">Total Score</div>
          <div className="score-number">{score} / {totalMarks}</div>
        </div>

        <div className="accuracy">
          <div className="accuracy-label">Accuracy</div>
          <div className="accuracy-number">{percentage}%</div>
        </div>
      </div>

      <div className="correct-wrong">
        <div className="cw-label">Correct vs Wrong</div>
        <div className="cw-bar">
          <div className="cw-correct" style={{ width: `${correctPct}%` }} />
          <div className="cw-incorrect" style={{ width: `${incorrectPct}%` }} />
        </div>
        <div className="cw-legend">
          <span className="legend-item"><span className="dot correct-dot"/> {correctAnswers} correct</span>
          <span className="legend-item"><span className="dot incorrect-dot"/> {incorrectAnswers} wrong</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreSummary;
