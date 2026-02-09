import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import analyticsService from '../../services/analyticsService';
import '../styles/FacultyPages.css';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalClasses: 0,
    totalStudents: 0,
    totalExams: 0,
    averageClassScore: 0
  });
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, [user?.id]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Fetch faculty dashboard data
      // This would typically come from the backend
      // For now, we'll mock the data structure
      
      setStats({
        totalClasses: 3,
        totalStudents: 85,
        totalExams: 12,
        averageClassScore: 72.5
      });

      setClasses([
        {
          id: '1',
          name: 'Class 10A',
          subject: 'Mathematics',
          students: 30,
          averageScore: 75.5,
          examsTaken: 4
        },
        {
          id: '2',
          name: 'Class 10B',
          subject: 'Science',
          students: 28,
          averageScore: 68.3,
          examsTaken: 3
        },
        {
          id: '3',
          name: 'Class 11A',
          subject: 'English',
          students: 27,
          averageScore: 73.8,
          examsTaken: 5
        }
      ]);
    } catch (err) {
      setError('Failed to load dashboard');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="faculty-dashboard-container">
      <div className="dashboard-header">
        <h1>Faculty Dashboard</h1>
        <p>Welcome, {user?.firstName}! Here's your teaching analytics overview</p>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Classes</h3>
          <div className="stat-value">{stats.totalClasses}</div>
        </div>
        <div className="stat-card">
          <h3>Total Students</h3>
          <div className="stat-value">{stats.totalStudents}</div>
        </div>
        <div className="stat-card">
          <h3>Total Exams</h3>
          <div className="stat-value">{stats.totalExams}</div>
        </div>
        <div className="stat-card">
          <h3>Average Class Score</h3>
          <div className="stat-value">{stats.averageClassScore}%</div>
        </div>
      </div>

      {/* Classes Section */}
      {classes.length > 0 && (
        <div className="classes-section">
          <h2>Your Classes</h2>
          <div className="classes-grid">
            {classes.map(cls => (
              <div key={cls.id} className="class-card">
                <h3>{cls.name}</h3>
                <p className="class-subject">{cls.subject}</p>
                
                <div className="class-stats">
                  <div className="stat">
                    <span className="label">Students</span>
                    <span className="value">{cls.students}</span>
                  </div>
                  <div className="stat">
                    <span className="label">Avg Score</span>
                    <span className="value">{cls.averageScore}%</span>
                  </div>
                  <div className="stat">
                    <span className="label">Exams</span>
                    <span className="value">{cls.examsTaken}</span>
                  </div>
                </div>

                <button className="btn btn-primary btn-block">
                  View Analytics
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="actions-grid">
          <button className="action-btn" onClick={() => navigate('/faculty/create-exam')}>Create Exam</button>
          <button className="action-btn" onClick={() => navigate('/faculty/reports')}>View Reports</button>
          <button className="action-btn">Message Students</button>
          <button className="action-btn">Settings</button>
        </div>
      </div>
    </div>
  );
};

export default FacultyDashboard;
