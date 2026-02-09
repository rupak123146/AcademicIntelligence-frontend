import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useExam } from '../../context/ExamContext';
import examService from '../../services/examService';
import analyticsService from '../../services/analyticsService';
import ExamInstructions from '../../components/exam/ExamInstructions';
import TakeExam from './TakeExam';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import '../styles/StudentPages.css';

const ExamList = () => {
  const { user } = useAuth();
  const { startExam } = useExam();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedExam, setSelectedExam] = useState(null);
  const [submittedExamIds, setSubmittedExamIds] = useState(new Set());
  const [showInstructions, setShowInstructions] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    setLoading(true);
    try {
      // Try to load from backend first
      try {
        const data = await examService.getAllExams({ role: 'student' });
        const normalizedExams = (data.exams || []).map(exam => ({
          ...exam,
          totalQuestions: exam.totalQuestions || exam.questions?.length || 0
        }));
        setExams(normalizedExams);
      } catch (backendError) {
        // Fallback to localStorage for demo mode
        const storedExams = localStorage.getItem('demoExams');
        if (storedExams) {
          const allExams = JSON.parse(storedExams);
          // Handle both array and object formats
          let publishedExams = [];
          if (Array.isArray(allExams)) {
            publishedExams = allExams.filter(exam => exam.status === 'published');
          } else {
            publishedExams = Object.values(allExams).filter(exam => exam.status === 'published');
          }
          // Normalize exams to ensure totalQuestions is set
          const normalizedExams = publishedExams.map(exam => ({
            ...exam,
            totalQuestions: exam.totalQuestions || exam.questions?.length || 0
          }));
          setExams(normalizedExams);
        } else {
          setExams([]);
        }
      }
      // Determine which exams the current user already submitted (demo/localStorage fallback)
      try {
        const demoResults = JSON.parse(localStorage.getItem('demoExamResults') || '{}');
        const submitted = new Set();
        Object.keys(demoResults).forEach(exId => {
          const results = demoResults[exId] || [];
          if (results.some(r => r.studentEmail === user?.email)) {
            submitted.add(Number(exId) || exId);
          }
        });
        setSubmittedExamIds(submitted);
      } catch (e) {
        setSubmittedExamIds(new Set());
      }

      setError(null);
    } catch (err) {
      setError('Failed to load exams');
      console.error(err);
      setExams([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStartExam = async (exam) => {
    setSelectedExam(exam);
    setShowInstructions(true);
  };

  const handleExamStart = async () => {
    try {
      // If exam already has questions (from localStorage), use them directly
      if (selectedExam && selectedExam.questions && selectedExam.questions.length > 0) {
        startExam(selectedExam, selectedExam.questions);
        setShowInstructions(false);
        setExamStarted(true);
        setError(null);
        return;
      }

      // Otherwise try to get from backend
      try {
        const questionsData = await examService.getExamQuestions(selectedExam.id);
        startExam(selectedExam, questionsData.questions);
        setShowInstructions(false);
        setExamStarted(true);
        setError(null);
      } catch (backendError) {
        throw new Error('Exam questions not found');
      }
    } catch (err) {
      setError('Failed to start exam');
      console.error(err);
    }
  };

  const handleExamEnd = (result) => {
    setExamStarted(false);
    navigate(`/student/result/${selectedExam.id}`, { state: { result } });
  };

  if (loading) return <div className="loading">Loading exams...</div>;

  if (examStarted && selectedExam) {
    return <TakeExam examId={selectedExam.id} onExamEnd={handleExamEnd} />;
  }

  return (
    <div className="exam-list-container">
      {error && <div className="alert alert-error">{error}</div>}

      {showInstructions && selectedExam && (
        <ExamInstructions
          exam={selectedExam}
          onStartExam={handleExamStart}
          onCancel={() => setShowInstructions(false)}
        />
      )}

      <div className="page-header">
        <h1>Available Exams</h1>
        <p>Select an exam to begin</p>
      </div>

      {exams.length === 0 ? (
        <div className="empty-state">
          <p>No exams available at this time</p>
        </div>
      ) : (
        <div className="exam-grid">
          {exams.map(exam => (
            <div key={exam.id} className="exam-card">
              <div className="exam-card-header">
                <h3>{exam.title}</h3>
                <span className={`exam-status status-${exam.status}`}>{exam.status}</span>
              </div>

              <div className="exam-card-body">
                <p className="exam-description">{exam.description}</p>

                <div className="exam-stats">
                  <div className="stat">
                    <span className="stat-label">Duration</span>
                    <span className="stat-value">{exam.duration} min</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Questions</span>
                    <span className="stat-value">{exam.totalQuestions || exam.questions?.length || 0}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Marks</span>
                    <span className="stat-value">{exam.totalMarks}</span>
                  </div>
                  <div className="stat">
                    <span className="stat-label">Passing</span>
                    <span className="stat-value">{exam.passingScore}</span>
                  </div>
                </div>

                {exam.subject && (
                  <p className="exam-subject">
                    <strong>Subject:</strong> {exam.subject}
                  </p>
                )}
              </div>

              <div className="exam-card-footer">
                {submittedExamIds.has(exam.id) ? (
                  <button className="btn btn-outline" disabled>
                    Completed
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartExam(exam)}
                    className="btn btn-primary"
                  >
                    Start Exam
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;
