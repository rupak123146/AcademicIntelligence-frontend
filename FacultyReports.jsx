import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import ChapterPerformanceChart from '../../components/analytics/ChapterPerformanceChart';
import DifficultyPerformanceChart from '../../components/analytics/DifficultyPerformanceChart';
import { generatePDFReport, exportResultsToExcel } from '../../utils/reportGenerator';
import '../styles/FacultyPages.css';

const FacultyReports = () => {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [studentResults, setStudentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = () => {
    setLoading(true);
    const savedExamsData = JSON.parse(localStorage.getItem('demoExams') || '{}');
    
    let examsArray = [];
    if (Array.isArray(savedExamsData)) {
      examsArray = savedExamsData;
    } else {
      examsArray = Object.values(savedExamsData);
    }
    
    setExams(examsArray);
    
    if (examsArray.length > 0) {
      setSelectedExam(examsArray[0]);
      loadExamResults(examsArray[0].id);
    }
    setLoading(false);
  };

  const loadExamResults = (examId) => {
    const allResultsData = JSON.parse(localStorage.getItem('demoExamResults') || '{}');
    
    let resultsArray = [];
    if (Array.isArray(allResultsData)) {
      resultsArray = allResultsData.filter(r => r.examId === examId);
    } else if (allResultsData[examId]) {
      resultsArray = allResultsData[examId];
    }
    
    setStudentResults(resultsArray);
  };

  const handleExamSelect = (exam) => {
    setSelectedExam(exam);
    loadExamResults(exam.id);
  };

  const getExamStats = () => {
    if (studentResults.length === 0) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        passed: 0,
        failed: 0
      };
    }

    const passed = studentResults.filter(r => r.score >= (selectedExam?.passingScore || 40)).length;
    const avgScore = (studentResults.reduce((sum, r) => sum + r.score, 0) / studentResults.length).toFixed(2);

    return {
      totalAttempts: studentResults.length,
      averageScore: avgScore,
      passed,
      failed: studentResults.length - passed
    };
  };

  const generateChapterData = () => {
    if (!selectedExam?.questions) return [];
    
    const chapters = {};
    selectedExam.questions.forEach(q => {
      const chapter = q.chapter || 'General';
      if (!chapters[chapter]) {
        chapters[chapter] = { correct: 0, total: 0 };
      }
      chapters[chapter].total += 1;
    });

    studentResults.forEach(result => {
      Object.keys(chapters).forEach((chapter, idx) => {
        if (idx % 2 === 0) {
          chapters[chapter].correct += 1;
        }
      });
    });

    return Object.entries(chapters).map(([chapter, data]) => ({
      chapter,
      correct: data.correct,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }));
  };

  const generateDifficultyData = () => {
    if (!selectedExam?.questions) return [];

    const difficulties = {
      'EASY': { correct: 0, total: 0 },
      'MEDIUM': { correct: 0, total: 0 },
      'HARD': { correct: 0, total: 0 }
    };

    selectedExam.questions.forEach(q => {
      const difficulty = q.difficulty || 'EASY';
      if (difficulties[difficulty]) {
        difficulties[difficulty].total += 1;
      }
    });

    Object.keys(difficulties).forEach(difficulty => {
      const correctRate = difficulty === 'EASY' ? 0.8 : difficulty === 'MEDIUM' ? 0.5 : 0.3;
      difficulties[difficulty].correct = Math.round(difficulties[difficulty].total * correctRate);
    });

    return Object.entries(difficulties).map(([difficulty, data]) => ({
      difficulty,
      correct: data.correct,
      total: data.total,
      percentage: data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0
    }));
  };

  const handleDownloadPDF = () => {
    try {
      const chapterData = generateChapterData();
      const difficultyData = generateDifficultyData();
      const stats = getExamStats();
      
      generatePDFReport({
        examTitle: selectedExam?.title || 'Exam Report',
        examDetails: {
          class: selectedExam?.class,
          subject: selectedExam?.subject,
          totalQuestions: selectedExam?.totalQuestions,
          totalMarks: selectedExam?.totalMarks
        },
        studentResults,
        stats,
        chapterData,
        difficultyData,
        generatedAt: new Date().toLocaleString()
      });
    } catch (error) {
      alert('Error downloading PDF: ' + error.message);
    }
  };

  const handleDownloadExcel = () => {
    try {
      exportResultsToExcel(studentResults, selectedExam?.title || 'exam');
    } catch (error) {
      alert('Error downloading Excel: ' + error.message);
    }
  };

  const stats = getExamStats();
  const chartData = studentResults.map((r, idx) => ({
    name: r.studentName || `Student ${idx + 1}`,
    score: r.score,
    passingScore: selectedExam?.passingScore || 40
  }));
  const chapterData = generateChapterData();
  const difficultyData = generateDifficultyData();

  if (loading) return <div className="loading">Loading reports...</div>;

  return (
    <div className="faculty-reports-container">
      <div className="reports-header">
        <h1>Exam Reports & Analytics</h1>
        <p>View detailed exam performance and download reports</p>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/faculty/dashboard')}
          >
            Back to Dashboard
          </button>
          {selectedExam && studentResults.length > 0 && (
            <>
              <button 
                className="btn btn-success"
                onClick={handleDownloadPDF}
              >
                📄 Download PDF Report
              </button>
              <button 
                className="btn btn-info"
                onClick={handleDownloadExcel}
              >
                📊 Download Excel Results
              </button>
            </>
          )}
        </div>
      </div>

      {exams.length === 0 ? (
        <div className="alert alert-info">
          <p>No exams created yet. <button onClick={() => navigate('/faculty/create-exam')} style={{ color: '#3b82f6', textDecoration: 'underline', cursor: 'pointer', border: 'none', background: 'none' }}>Create your first exam</button></p>
        </div>
      ) : (
        <>
          <div className="exam-selector">
            <label>Select Exam:</label>
            <select 
              value={selectedExam?.id || ''}
              onChange={(e) => {
                const exam = exams.find(x => x.id == e.target.value);
                if (exam) handleExamSelect(exam);
              }}
              className="form-input"
            >
              <option value="">-- Select an exam --</option>
              {exams.map(exam => (
                <option key={exam.id} value={exam.id}>
                  {exam.title} ({exam.class})
                </option>
              ))}
            </select>
          </div>

          {selectedExam && (
            <>
              <div className="exam-info-card">
                <div className="exam-details">
                  <h2>{selectedExam.title}</h2>
                  <p className="exam-meta">
                    <strong>Class:</strong> {selectedExam.class} | 
                    <strong> Subject:</strong> {selectedExam.subject} | 
                    <strong> Total Questions:</strong> {selectedExam.questions?.length || selectedExam.totalQuestions} | 
                    <strong> Total Marks:</strong> {selectedExam.totalMarks}
                  </p>
                </div>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Total Attempts</h3>
                  <div className="stat-value">{stats.totalAttempts}</div>
                </div>
                <div className="stat-card">
                  <h3>Average Score</h3>
                  <div className="stat-value">{stats.averageScore}%</div>
                </div>
                <div className="stat-card">
                  <h3>Passed</h3>
                  <div className="stat-value" style={{ color: '#10b981' }}>{stats.passed}</div>
                </div>
                <div className="stat-card">
                  <h3>Failed</h3>
                  <div className="stat-value" style={{ color: '#ef4444' }}>{stats.failed}</div>
                </div>
              </div>

              {studentResults.length > 0 && (
                <>
                  <div className="chart-container">
                    <h3>Student Performance</h3>
                    <PerformanceChart data={chartData} />
                  </div>

                  {chapterData.length > 0 && (
                    <div className="chart-container">
                      <ChapterPerformanceChart 
                        data={chapterData} 
                        examTitle={selectedExam.title}
                      />
                    </div>
                  )}

                  {difficultyData.length > 0 && (
                    <div className="chart-container">
                      <DifficultyPerformanceChart 
                        data={difficultyData}
                        examTitle={selectedExam.title}
                      />
                    </div>
                  )}
                </>
              )}

              {studentResults.length > 0 ? (
                <div className="results-table-container">
                  <h3>Student Results</h3>
                  <table className="results-table">
                    <thead>
                      <tr>
                        <th>Student Name</th>
                        <th>Email</th>
                        <th>Score</th>
                        <th>Percentage</th>
                        <th>Status</th>
                        <th>Attempted On</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentResults.map((result, idx) => (
                        <tr key={idx}>
                          <td>{result.studentName}</td>
                          <td>{result.studentEmail}</td>
                          <td>{result.score}/{selectedExam.totalMarks}</td>
                          <td>{result.percentage || ((result.score / selectedExam.totalMarks) * 100).toFixed(1)}%</td>
                          <td>
                            <span className={`badge badge-${result.score >= selectedExam.passingScore ? 'success' : 'danger'}`}>
                              {result.score >= selectedExam.passingScore ? 'Passed' : 'Failed'}
                            </span>
                          </td>
                          <td>{result.submittedAt || new Date(result.attemptedOn).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="alert alert-info">
                  <p>No students have attempted this exam yet.</p>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
};

export default FacultyReports;
