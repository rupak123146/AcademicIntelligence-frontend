import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUESTION_TYPE, DIFFICULTY_LEVEL } from '../../utils/constants';
import '../styles/FacultyPages.css';

const CreateExam = () => {
  const navigate = useNavigate();
  const [examData, setExamData] = useState({
    title: '',
    description: '',
    duration: 60,
    passingScore: 40,
    totalMarks: 100,
    subject: '',
    class: '',
    instructions: ''
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState({
    text: '',
    type: QUESTION_TYPE.MULTIPLE_CHOICE,
    difficulty: DIFFICULTY_LEVEL.EASY,
    marks: 1,
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: ''
  });
  const [editingQuestionId, setEditingQuestionId] = useState(null);

  const [step, setStep] = useState('exam-details'); // exam-details or questions

  const handleExamChange = (e) => {
    const { name, value } = e.target;
    setExamData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (e) => {
    const { name, value } = e.target;
    setCurrentQuestion(prev => ({ ...prev, [name]: value }));
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...currentQuestion.options];
    newOptions[index] = value;
    setCurrentQuestion(prev => ({ ...prev, options: newOptions }));
  };

  const addQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert('Please enter question text');
      return;
    }

    if (currentQuestion.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      const filledOptions = currentQuestion.options.filter(o => o.trim());
      if (filledOptions.length < 2) {
        alert('Please enter at least 2 options for MCQ');
        return;
      }
    }

    setQuestions([...questions, { ...currentQuestion, id: Date.now() }]);
    setCurrentQuestion({
      text: '',
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      difficulty: DIFFICULTY_LEVEL.EASY,
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const editQuestion = (question) => {
    setEditingQuestionId(question.id);
    setCurrentQuestion({
      text: question.text || '',
      type: question.type || QUESTION_TYPE.MULTIPLE_CHOICE,
      difficulty: question.difficulty || DIFFICULTY_LEVEL.EASY,
      marks: question.marks || 1,
      options: question.options || ['', '', '', ''],
      correctAnswer: typeof question.correctAnswer === 'number' ? question.correctAnswer : 0,
      explanation: question.explanation || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const updateQuestion = () => {
    if (!currentQuestion.text.trim()) {
      alert('Please enter question text');
      return;
    }

    if (currentQuestion.type === QUESTION_TYPE.MULTIPLE_CHOICE) {
      const filledOptions = currentQuestion.options.filter(o => o.trim());
      if (filledOptions.length < 2) {
        alert('Please enter at least 2 options for MCQ');
        return;
      }
    }

    setQuestions(prev => prev.map(q => q.id === editingQuestionId ? { ...q, ...currentQuestion } : q));
    setEditingQuestionId(null);
    setCurrentQuestion({
      text: '',
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      difficulty: DIFFICULTY_LEVEL.EASY,
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const cancelEdit = () => {
    setEditingQuestionId(null);
    setCurrentQuestion({
      text: '',
      type: QUESTION_TYPE.MULTIPLE_CHOICE,
      difficulty: DIFFICULTY_LEVEL.EASY,
      marks: 1,
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    });
  };

  const removeQuestion = (id) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const handleCreateExam = () => {
    if (!examData.title.trim()) {
      alert('Please enter exam title');
      return;
    }

    if (questions.length === 0) {
      alert('Please add at least one question');
      return;
    }

    const exam = {
      id: Date.now(),
      ...examData,
      questions,
      createdAt: new Date().toISOString(),
      status: 'published'
    };

    // Save to localStorage for demo purposes (as object with exam ID as key)
    const examsData = JSON.parse(localStorage.getItem('demoExams') || '{}');
    examsData[exam.id] = exam;
    localStorage.setItem('demoExams', JSON.stringify(examsData));

    alert(`Exam "${examData.title}" created successfully with ${questions.length} questions!`);
    navigate('/faculty/dashboard');
  };

  const totalMarks = questions.reduce((sum, q) => sum + (parseInt(q.marks) || 1), 0);

  return (
    <div className="create-exam-container">
      <div className="create-exam-header">
        <h1>Create Exam</h1>
        <p>Design your exam with questions and set rules</p>
      </div>

      {step === 'exam-details' ? (
        <div className="exam-form">
          <div className="form-section">
            <h2>Exam Details</h2>

            <div className="form-grid">
              <div className="form-group">
                <label>Exam Title *</label>
                <input
                  type="text"
                  name="title"
                  value={examData.title}
                  onChange={handleExamChange}
                  placeholder="e.g., Mathematics Final Exam"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={examData.subject}
                  onChange={handleExamChange}
                  placeholder="e.g., Mathematics"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Class *</label>
                <input
                  type="text"
                  name="class"
                  value={examData.class}
                  onChange={handleExamChange}
                  placeholder="e.g., Class 10A"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Duration (minutes)</label>
                <input
                  type="number"
                  name="duration"
                  value={examData.duration}
                  onChange={handleExamChange}
                  min="5"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Passing Score (%)</label>
                <input
                  type="number"
                  name="passingScore"
                  value={examData.passingScore}
                  onChange={handleExamChange}
                  min="0"
                  max="100"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Total Marks</label>
                <input
                  type="number"
                  name="totalMarks"
                  value={examData.totalMarks}
                  onChange={handleExamChange}
                  min="1"
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={examData.description}
                onChange={handleExamChange}
                placeholder="Add exam description..."
                rows="3"
                className="form-input"
              />
            </div>

            <div className="form-group full-width">
              <label>Instructions for Students</label>
              <textarea
                name="instructions"
                value={examData.instructions}
                onChange={handleExamChange}
                placeholder="Add exam instructions..."
                rows="4"
                className="form-input"
              />
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-primary"
                onClick={() => setStep('questions')}
              >
                Next: Add Questions
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/faculty/dashboard')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="questions-form">
          <div className="form-section">
            <div className="questions-header">
              <h2>Add Questions ({questions.length} added)</h2>
              <p>Total Marks: {totalMarks}</p>
            </div>

            {questions.length > 0 && (
              <div className="questions-list">
                <h3>Added Questions</h3>
                {questions.map((q, idx) => (
                  <div key={q.id} className="question-item">
                    <div className="question-info">
                      <span className="q-number">Q{idx + 1}</span>
                      <div>
                        <p className="q-text">{q.text}</p>
                        <div className="q-meta">
                          <span className="badge badge-type">{q.type}</span>
                          <span className="badge badge-difficulty">{q.difficulty}</span>
                          <span className="badge badge-marks">{q.marks} mark(s)</span>
                        </div>
                      </div>
                    </div>
                    <div className="question-actions">
                      <button
                        className="btn btn-sm btn-outline"
                        onClick={() => editQuestion(q)}
                        title="Edit question"
                      >
                        ✎
                      </button>
                      <button
                        className="btn-remove"
                        onClick={() => removeQuestion(q.id)}
                        title="Remove question"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="add-question-section">
              <h3>Add New Question</h3>

              <div className="form-group">
                <label>Question Text *</label>
                <textarea
                  name="text"
                  value={currentQuestion.text}
                  onChange={handleQuestionChange}
                  placeholder="Enter the question..."
                  rows="3"
                  className="form-input"
                />
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label>Question Type</label>
                  <select
                    name="type"
                    value={currentQuestion.type}
                    onChange={handleQuestionChange}
                    className="form-input"
                  >
                    <option value={QUESTION_TYPE.MULTIPLE_CHOICE}>Multiple Choice</option>
                    <option value={QUESTION_TYPE.TRUE_FALSE}>True/False</option>
                    <option value={QUESTION_TYPE.SHORT_ANSWER}>Short Answer</option>
                    <option value={QUESTION_TYPE.ESSAY}>Essay</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Difficulty Level</label>
                  <select
                    name="difficulty"
                    value={currentQuestion.difficulty}
                    onChange={handleQuestionChange}
                    className="form-input"
                  >
                    <option value={DIFFICULTY_LEVEL.EASY}>Easy</option>
                    <option value={DIFFICULTY_LEVEL.MEDIUM}>Medium</option>
                    <option value={DIFFICULTY_LEVEL.HARD}>Hard</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Marks</label>
                  <input
                    type="number"
                    name="marks"
                    value={currentQuestion.marks}
                    onChange={handleQuestionChange}
                    min="1"
                    max="10"
                    className="form-input"
                  />
                </div>
              </div>

              {currentQuestion.type === QUESTION_TYPE.MULTIPLE_CHOICE && (
                <div className="options-section">
                  <label>Options *</label>
                  {currentQuestion.options.map((option, idx) => (
                    <div key={idx} className="option-input">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === idx}
                        onChange={() =>
                          setCurrentQuestion(prev => ({ ...prev, correctAnswer: idx }))
                        }
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(idx, e.target.value)}
                        placeholder={`Option ${idx + 1}`}
                        className="form-input"
                      />
                    </div>
                  ))}
                </div>
              )}

              {currentQuestion.type === QUESTION_TYPE.TRUE_FALSE && (
                <div className="tf-section">
                  <label>Correct Answer</label>
                  <div className="tf-options">
                    <label>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === 0}
                        onChange={() =>
                          setCurrentQuestion(prev => ({ ...prev, correctAnswer: 0 }))
                        }
                      />
                      True
                    </label>
                    <label>
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={currentQuestion.correctAnswer === 1}
                        onChange={() =>
                          setCurrentQuestion(prev => ({ ...prev, correctAnswer: 1 }))
                        }
                      />
                      False
                    </label>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Explanation (Optional)</label>
                <textarea
                  name="explanation"
                  value={currentQuestion.explanation}
                  onChange={handleQuestionChange}
                  placeholder="Explain the correct answer..."
                  rows="2"
                  className="form-input"
                />
              </div>

              <div className="form-actions">
                {editingQuestionId ? (
                  <>
                    <button 
                      className="btn btn-primary"
                      onClick={updateQuestion}
                    >
                      Update Question
                    </button>
                    <button
                      className="btn btn-secondary"
                      onClick={cancelEdit}
                      style={{ marginLeft: '0.5rem' }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button 
                    className="btn btn-primary"
                    onClick={addQuestion}
                  >
                    Add Question
                  </button>
                )}
              </div>
            </div>

            <div className="form-actions">
              <button 
                className="btn btn-success"
                onClick={handleCreateExam}
                disabled={questions.length === 0}
              >
                Create Exam
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setStep('exam-details')}
              >
                Back
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => navigate('/faculty/dashboard')}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateExam;
