import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import analyticsService from '../../services/analyticsService';
import PerformanceChart from '../../components/analytics/PerformanceChart';
import ChapterAnalysis from '../../components/analytics/ChapterAnalysis';
import '../styles/FacultyPages.css';

const ClassAnalytics = ({ classId }) => {
  const { user } = useAuth();
  const [classData, setClassData] = useState(null);
  const [students, setStudents] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [chapterData, setChapterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadClassAnalytics();
  }, [classId]);

  const loadClassAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch class analytics
      const analyticsData = await analyticsService.getClassAnalytics(classId);
      setClassData(analyticsData);

      // Fetch class students
      const studentsData = await analyticsService.getClassStudents(classId);
      setStudents(studentsData.students || []);

      // Prepare chart data
      if (analyticsData.performanceTrend) {
        setChartData({
          labels: analyticsData.performanceTrend.map(item => item.date),
          scores: analyticsData.performanceTrend.map(item => item.averageScore),
          passingScore: 40
        });
      }

      // Prepare chapter data
      if (analyticsData.chapterWisePerformance) {
        setChapterData(analyticsData.chapterWisePerformance);
      }
    } catch (err) {
      setError('Failed to load class analytics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading class analytics...</div>;

  return (
    <div className="class-analytics-container">
      <div className="page-header">
        <h1>Class Analytics</h1>
        <p>Comprehensive class performance analysis</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Summary Stats */}
      {classData && (
        <div className="stats-grid">
          <div className="stat-card">
            <h3>Total Students</h3>
            <div className="stat-value">{classData.totalStudents}</div>
          </div>
          <div className="stat-card">
            <h3>Class Average</h3>
            <div className="stat-value">{classData.classAverage?.toFixed(2)}%</div>
          </div>
          <div className="stat-card">
            <h3>Highest Score</h3>
            <div className="stat-value">{classData.highestScore}</div>
          </div>
          <div className="stat-card">
            <h3>Lowest Score</h3>
            <div className="stat-value">{classData.lowestScore}</div>
          </div>
        </div>
      )}

      {/* Performance Trend Chart */}
      {chartData && (
        <div className="chart-section">
          <h2>Class Performance Trend</h2>
          <PerformanceChart data={chartData} />
        </div>
      )}

      {/* Chapter-wise Analysis */}
      {chapterData && (
        <div className="chart-section">
          <ChapterAnalysis data={chapterData} />
        </div>
      )}

      {/* Learning Gaps */}
      {classData?.learningGaps && classData.learningGaps.length > 0 && (
        <div className="learning-gaps-section">
          <h2>Common Learning Gaps</h2>
          <div className="gaps-list">
            {classData.learningGaps.map((gap, index) => (
              <div key={index} className="gap-item">
                <h4>{gap.topic}</h4>
                <p>{gap.affectedStudents} students struggling</p>
                <div className="gap-percentage">
                  <div className="percentage-bar">
                    <div
                      className="percentage-fill"
                      style={{ width: `${gap.percentage}%`, backgroundColor: '#ef4444' }}
                    />
                  </div>
                  <span>{gap.percentage}% of class</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Student List */}
      {students.length > 0 && (
        <div className="students-section">
          <h2>Student Performance</h2>
          <div className="students-table">
            <table>
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Roll Number</th>
                  <th>Exams Taken</th>
                  <th>Average Score</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{student.rollNumber}</td>
                    <td>{student.examsTaken}</td>
                    <td>{student.averageScore?.toFixed(2)}%</td>
                    <td>
                      <span className={`badge ${student.averageScore >= 40 ? 'badge-success' : 'badge-danger'}`}>
                        {student.averageScore >= 40 ? 'On Track' : 'Struggling'}
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

export default ClassAnalytics;
