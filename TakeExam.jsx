import React, { useState, useEffect } from 'react';
import { useExam } from '../../context/ExamContext';
import { useAuth } from '../../context/AuthContext';
import examService from '../../services/examService';
import QuestionCard from '../../components/exam/QuestionCard';
import Timer from '../../components/exam/Timer';
import '../../assets/styles/Exam.css';

const TakeExam = ({ examId, onExamEnd }) => {
  const { user } = useAuth();
  const {
    currentExam,
    questions,
    currentQuestionIndex,
    responses,
    updateResponse,
    nextQuestion,
    previousQuestion,
    goToQuestion,
    submitExam
  } = useExam();

  const [loading, setLoading] = useState(false);
  const [showQuestionPalette, setShowQuestionPalette] = useState(false);
  const [markedForReview, setMarkedForReview] = useState(new Set());

  const currentQuestion = questions[currentQuestionIndex];
  const isAnswered = !!responses[currentQuestion?.id]?.answered;
  const userResponse = responses[currentQuestion?.id]?.answer;

  const handleTimeUp = async () => {
    await submitCurrentExam();
  };

  const submitCurrentExam = async () => {
    setLoading(true);
    try {
      // Calculate score and answer counts from responses
      let score = 0;
      let totalMarks = 0;
      const totalQuestions = questions.length;
      let correctAnswers = 0;
      let incorrectAnswers = 0;
      let unanswered = 0;

      questions.forEach((question) => {
        totalMarks += (question.marks || 1);
        const response = responses[question.id];

        if (response && response.answered) {
          const correctAnswer = question.correctAnswer;
          const userAnswer = response.answer;
            // Robust correctness check to handle different formats:
            // - question.correctAnswer may be an index (number), option text, or option id
            // - userAnswer may be index (number) or option text
            const normalize = (val) => String(val ?? '').trim().toLowerCase();

            const isAnswerCorrect = (q, userAns) => {
              const correct = q.correctAnswer;
              // If options exist, try to derive the correct option text
              if (q.options && q.options.length) {
                let correctOptionText = null;

                // If correct is an index (number or numeric string)
                if (typeof correct === 'number' || (!isNaN(correct) && String(correct).trim() !== '')) {
                  const idx = Number(correct);
                  const opt = q.options[idx];
                  correctOptionText = typeof opt === 'string' ? opt : opt?.text;
                } else {
                  // correct might be option text or option id
                  const found = q.options.find(o => {
                    if (typeof o === 'string') return String(o) === String(correct);
                    return String(o.id) === String(correct) || String(o.text) === String(correct);
                  });
                  if (found) correctOptionText = typeof found === 'string' ? found : found.text;
                  else correctOptionText = correct; // fallback
                }

                // Compare normalized texts
                if (normalize(userAns) === normalize(correctOptionText)) return true;
                // Also allow matching by index/id
                if (String(userAns) === String(correct)) return true;
                return false;
              }

              // No options (short answer) - compare normalized
              return normalize(userAns) === normalize(correct);
            };

            const isCorrect = isAnswerCorrect(question, userAnswer);
            // Debug per-question
            console.log('Grade check', { qId: question.id, correctAnswer: question.correctAnswer, userAnswer, isCorrect });
          if (isCorrect) {
            score += (question.marks || 1);
            correctAnswers += 1;
          } else {
            incorrectAnswers += 1;
          }
        } else {
          unanswered += 1;
        }
      });

      // Debug: log grading inputs
      console.log('Submitting exam - grading debug', {
        examId,
        currentExamTitle: currentExam?.title,
        questions,
        responses,
      });

      // Try to submit to backend first
      try {
        const result = await examService.submitExam(examId, responses);
        submitExam(result);
        onExamEnd(result);
      } catch (backendError) {
        // Fallback to localStorage for demo mode
        const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;
        
        // Handle passingScore - could be absolute marks (>50) or percentage (<=50)
        let passingScoreValue = currentExam?.passingScore ?? 50;
        let passingPercentage;
        
        if (passingScoreValue > 50) {
          // Treat as absolute marks, convert to percentage
          passingPercentage = totalMarks > 0 ? Math.round((passingScoreValue / totalMarks) * 100) : 50;
        } else {
          // Treat as percentage
          passingPercentage = passingScoreValue;
        }
        
        const passed = percentage >= passingPercentage;
        
        // Read startTime from the studentResponses storage (set when exam started)
        const storedResponses = JSON.parse(localStorage.getItem('studentResponses') || '{}');
        const startTimeIso = storedResponses.startTime || storedResponses[examId]?.startTime || null;
        const timeSpentSeconds = startTimeIso ? Math.floor((Date.now() - new Date(startTimeIso)) / 1000) : 0;
        const timeTaken = startTimeIso ? `${Math.floor(timeSpentSeconds / 60)}m ${timeSpentSeconds % 60}s` : '0m 0s';

        const result = {
          examId: examId,
          examTitle: currentExam?.title,
          studentName: user?.name || user?.email,
          studentEmail: user?.email,
          score: score,
          totalMarks: totalMarks,
          percentage: percentage,
          passingScore: passingScoreValue,
          passed: passed,
          status: passed ? 'Passed' : 'Failed',
          submittedAt: new Date().toLocaleString(),
          timeTaken: timeTaken,
          timeSpentSeconds: timeSpentSeconds,
          totalQuestions: totalQuestions,
          correctAnswers: correctAnswers,
          incorrectAnswers: incorrectAnswers,
          unanswered: unanswered
        };

        // Debug: show computed grading result
        console.log('Computed result (fallback):', result);

        // Save result to localStorage
        const existingResults = localStorage.getItem('demoExamResults');
        const allResults = existingResults ? JSON.parse(existingResults) : {};

        if (!allResults[examId]) {
          allResults[examId] = [];
        }

        allResults[examId].push(result);
        localStorage.setItem('demoExamResults', JSON.stringify(allResults));

        submitExam(result);
        onExamEnd(result);
      }
    } catch (error) {
      console.error('Error submitting exam:', error);
      alert('Error submitting exam. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleMarkForReview = (questionId) => {
    const newMarked = new Set(markedForReview);
    if (newMarked.has(questionId)) {
      newMarked.delete(questionId);
    } else {
      newMarked.add(questionId);
    }
    setMarkedForReview(newMarked);
  };

  const getQuestionStatus = (index) => {
    const qId = questions[index]?.id;
    if (markedForReview.has(qId)) return 'marked';
    if (responses[qId]?.answered) return 'answered';
    return 'not-answered';
  };

  if (!currentQuestion) {
    return <div className="exam-loading">Loading exam...</div>;
  }

  return (
    <div className="exam-container">
      <div className="exam-header">
        <div className="exam-info">
          <h2>{currentExam?.title}</h2>
          <span>Question {currentQuestionIndex + 1} of {questions.length}</span>
        </div>
        <Timer duration={currentExam?.duration} onTimeUp={handleTimeUp} />
      </div>

      <div className="exam-body">
        <div className="exam-main">
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            isAnswered={isAnswered}
            onAnswerChange={updateResponse}
            userResponse={userResponse}
          />

          <div className="exam-actions">
            <button
              onClick={() => previousQuestion()}
              disabled={currentQuestionIndex === 0}
              className="btn btn-secondary"
            >
              Previous
            </button>

            <button
              onClick={() => toggleMarkForReview(currentQuestion.id)}
              className={`btn btn-outline ${markedForReview.has(currentQuestion.id) ? 'marked' : ''}`}
            >
              {markedForReview.has(currentQuestion.id) ? 'Unmark' : 'Mark'} for Review
            </button>

            <button
              onClick={() => nextQuestion()}
              disabled={currentQuestionIndex === questions.length - 1}
              className="btn btn-secondary"
            >
              Next
            </button>

            <button
              onClick={() => setShowQuestionPalette(!showQuestionPalette)}
              className="btn btn-outline"
            >
              Question Palette
            </button>

            <button
              onClick={submitCurrentExam}
              disabled={loading}
              className="btn btn-primary btn-submit"
            >
              {loading ? 'Submitting...' : 'Submit Exam'}
            </button>
          </div>
        </div>

        {showQuestionPalette && (
          <div className="question-palette">
            <h3>Question Palette</h3>
            <div className="palette-grid">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => {
                    goToQuestion(index);
                    setShowQuestionPalette(false);
                  }}
                  className={`palette-item palette-${getQuestionStatus(index)} ${
                    currentQuestionIndex === index ? 'current' : ''
                  }`}
                  title={`Question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="palette-legend">
              <div><span className="legend-answered"></span> Answered</div>
              <div><span className="legend-not-answered"></span> Not Answered</div>
              <div><span className="legend-marked"></span> Marked for Review</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TakeExam;
