import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import examService from '../../services/examService';
import analyticsService from '../../services/analyticsService';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import ChapterPerformanceChart from '../../components/analytics/ChapterPerformanceChart';
import DifficultyPerformanceChart from '../../components/analytics/DifficultyPerformanceChart';
import StrengthWeaknessCard from '../../components/analytics/StrengthWeaknessCard';
import { generatePDFReport } from '../../utils/reportGenerator';
import '../styles/StudentPages.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalExams: 0,
    averageScore: 0,
    passedExams: 0,
    recentExams: []
  });
  const [analytics, setAnalytics] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [chapterData, setChapterData] = useState([]);
  const [difficultyData, setDifficultyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch exam results
      const results = await examService.getAllExams({ studentId: user?.id });
      
      // Fetch analytics
      const analyticsData = await analyticsService.getStudentAnalytics(user?.id);
      
      // Calculate stats
      const passCount = results.exams?.filter(e => e.score >= e.passingScore).length || 0;
      const avgScore = results.exams?.length > 0
        ? (results.exams.reduce((sum, e) => sum + e.score, 0) / results.exams.length).toFixed(2)
        : 0;

      setStats({
        totalExams: results.exams?.length || 0,
        averageScore: avgScore,
        passedExams: passCount,
        recentExams: results.exams?.slice(0, 5) || []
      });

      setAnalytics(analyticsData);

      // Prepare chart data
      if (results.exams?.length > 0) {
        setChartData({
          labels: results.exams.map((e, i) => `Exam ${i + 1}`),
          scores: results.exams.map(e => e.score)
        });
      }

      // Generate sample chapter and difficulty data
      generatePerformanceData(results.exams || []);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Generate chapter and difficulty performance data
  const generatePerformanceData = (exams) => {
    // Sample chapter data
    const chapters = [
      { chapter: 'Concepts & Fundamentals', correct: 8, total: 10, percentage: 80 },
      { chapter: 'Application & Analysis', correct: 6, total: 10, percentage: 60 },
      { chapter: 'Problem Solving', correct: 7, total: 10, percentage: 70 }
    ];
    setChapterData(chapters);

    // Sample difficulty data
    const difficulties = [
      { difficulty: 'Easy', correct: 12, total: 15, percentage: 80 },
      { difficulty: 'Medium', correct: 8, total: 16, percentage: 50 },
      { difficulty: 'Hard', correct: 2, total: 9, percentage: 22 }
    ];
    setDifficultyData(difficulties);
  };

  const handleDownloadReport = () => {
    try {
      generatePDFReport({
        examTitle: 'My Academic Performance Report',
        examDetails: {
          student: user?.name || 'Student',
          email: user?.email
        },
        studentResults: stats.recentExams.map((exam, idx) => ({
          studentName: user?.name || 'Student',
          studentEmail: user?.email,
          examTitle: exam.title,
          score: exam.score,
          totalMarks: exam.totalMarks || 100,
          percentage: exam.percentage || 0,
          passed: exam.score >= exam.passingScore,
          submittedAt: exam.date || new Date().toLocaleString()
        })),
        stats: {
          totalAttempts: stats.totalExams,
          averageScore: stats.averageScore,
          passed: stats.passedExams,
          failed: stats.totalExams - stats.passedExams
        },
        chapterData,
        difficultyData,
        generatedAt: new Date().toLocaleString()
      });
    } catch (error) {
      alert('Error downloading report: ' + error.message);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.firstName || user?.name}!</h1>
        <p>Here's your academic performance overview</p>
        {stats.totalExams > 0 && (
          <button className="btn btn-success" onClick={handleDownloadReport} style={{ marginTop: '1rem' }}>
            📥 Download My Report
          </button>
        )}
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Guide Section */}
      <div className="dashboard-guide">
        <div className="guide-card">
          <div className="guide-icon">📊</div>
          <h3>View your overall performance statistics</h3>
          <p>Track your exam attempts, average scores, and pass rate to understand your academic progress</p>
        </div>
        <div className="guide-card">
          <div className="guide-icon">📈</div>
          <h3>Check chapter-wise and difficulty-wise performance</h3>
          <p>Explore which chapters you excel in and identify areas where you need improvement based on difficulty levels</p>
        </div>
        <div className="guide-card">
          <div className="guide-icon">📥</div>
          <h3>Click "📥 Download My Report" to get a PDF of your performance</h3>
          <p>Generate and download a comprehensive PDF report of your performance for personal records or sharing with mentors</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Exams</h3>
          <div className="stat-value">{stats.totalExams}</div>
        </div>
        <div className="stat-card">
          <h3>Average Score</h3>
          <div className="stat-value">{stats.averageScore}%</div>
        </div>
        <div className="stat-card">
          <h3>Exams Passed</h3>
          <div className="stat-value">{stats.passedExams}</div>
        </div>
        <div className="stat-card">
          <h3>Pass Rate</h3>
          <div className="stat-value">
            {stats.totalExams > 0 ? ((stats.passedExams / stats.totalExams) * 100).toFixed(0) : 0}%
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      {chartData && (
        <div className="chart-section">
          <h2>Performance Trend</h2>
          <PerformanceChart data={chartData} />
        </div>
      )}

      {/* Chapter Performance */}
      {chapterData.length > 0 && (
        <div className="chart-section">
          <ChapterPerformanceChart 
            data={chapterData}
            examTitle="Your Performance"
          />
        </div>
      )}

      {/* Difficulty Performance */}
      {difficultyData.length > 0 && (
        <div className="chart-section">
          <DifficultyPerformanceChart 
            data={difficultyData}
            examTitle="Your Performance"
            chartType="pie"
          />
        </div>
      )}

      {/* Strengths and Weaknesses */}
      {analytics && (
        <div className="analysis-section">
          <h2>Performance Analysis</h2>
          <div className="analysis-grid">
            <StrengthWeaknessCard
              title="Strengths"
              items={analytics.strengths}
              type="strength"
            />
            <StrengthWeaknessCard
              title="Areas to Improve"
              items={analytics.weaknesses}
              type="weakness"
            />
          </div>
        </div>
      )}

      {/* Recent Exams */}
      {stats.recentExams.length > 0 && (
        <div className="recent-exams-section">
          <h2>Recent Exams</h2>
          <div className="exams-table">
            <table>
              <thead>
                <tr>
                  <th>Exam</th>
                  <th>Date</th>
                  <th>Score</th>
                  <th>Passing Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {stats.recentExams.map(exam => (
                  <tr key={exam.id}>
                    <td>{exam.title}</td>
                    <td>{new Date(exam.date).toLocaleDateString()}</td>
                    <td>{exam.score}</td>
                    <td>{exam.passingScore}</td>
                    <td>
                      <span className={`badge ${exam.score >= exam.passingScore ? 'badge-success' : 'badge-danger'}`}>
                        {exam.score >= exam.passingScore ? 'Passed' : 'Failed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
