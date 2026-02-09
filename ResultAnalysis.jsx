import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import analyticsService from '../../services/analyticsService';
import ChapterAnalysis from '../../components/analytics/ChapterAnalysis';
import StrengthWeaknessCard from '../../components/analytics/StrengthWeaknessCard';
import ScoreSummary from '../../components/analytics/ScoreSummary';
import '../styles/StudentPages.css';

const ResultAnalysis = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // If navigation passed a result in location.state, use it immediately
    if (location?.state?.result) {
      setResult(location.state.result);
      setLoading(false);
      return;
    }

    loadResultAnalysis();
  }, [examId]);

  const loadResultAnalysis = async () => {
    setLoading(true);
    try {
      let resultData = null;
      
      // Try to get from backend first
      try {
        resultData = await analyticsService.getResultById(examId);
      } catch (backendError) {
        // Fallback to localStorage
        const resultsData = JSON.parse(localStorage.getItem('demoExamResults') || '{}');
        console.log('demoExamResults from localStorage:', resultsData);
        const results = resultsData[examId];
        
        if (results && results.length > 0) {
          // Use the first result (or latest)
          resultData = results[0];
        } else {
          throw new Error('No exam result found');
        }
      }
      
      setResult(resultData);

      // Generate basic analysis from the result
      const analysisData = {
        strengths: [],
        weaknesses: [],
        suggestions: []
      };
      setAnalysis(analysisData);
      
    } catch (err) {
      setError('Failed to load result analysis');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading result analysis...</div>;

  return (
    <div className="result-container">
      {error && <div className="alert alert-error">{error}</div>}

      {result && (
        <div>
          {/* Result Summary Card */}
          <div className="result-summary">
            <div className="result-header">
              <h1>{result.examTitle}</h1>
              <div className={`result-status ${result.passed ? 'passed' : 'failed'}`}>
                {result.passed ? 'PASSED' : 'FAILED'}
              </div>
            </div>

            <div className="result-score-display">
                <div style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
                  <ScoreSummary result={result} />

                  <div className="result-details">
                    <div className="detail">
                      <span className="label">Percentage</span>
                      <span className="value">{result.percentage}%</span>
                    </div>
                    <div className="detail">
                      <span className="label">Passing Score</span>
                      <span className="value">{result.passingScore}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Time Taken</span>
                      <span className="value">{result.timeTaken}</span>
                    </div>
                  </div>
                </div>
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="metrics-section">
            <h2>Performance Metrics</h2>
            <div className="metrics-grid">
              <div className="metric-card">
                <h4>Correct Answers</h4>
                <div className="metric-value">{result.correctAnswers}</div>
                <div className="metric-percentage">
                  <div className="percentage-bar">
                    <div
                      className="percentage-fill"
                      style={{ width: `${(result.correctAnswers / result.totalQuestions) * 100}%`, backgroundColor: '#10b981' }}
                    />
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <h4>Incorrect Answers</h4>
                <div className="metric-value">{result.incorrectAnswers}</div>
                <div className="metric-percentage">
                  <div className="percentage-bar">
                    <div
                      className="percentage-fill"
                      style={{ width: `${(result.incorrectAnswers / result.totalQuestions) * 100}%`, backgroundColor: '#ef4444' }}
                    />
                  </div>
                </div>
              </div>

              <div className="metric-card">
                <h4>Unanswered</h4>
                <div className="metric-value">{result.unanswered}</div>
                <div className="metric-percentage">
                  <div className="percentage-bar">
                    <div
                      className="percentage-fill"
                      style={{ width: `${(result.unanswered / result.totalQuestions) * 100}%`, backgroundColor: '#f59e0b' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Chapter-wise Performance */}
          {analysis?.chapterPerformance && (
            <div className="chapter-section">
              <h2>Chapter-wise Performance</h2>
              <ChapterAnalysis data={analysis.chapterPerformance} />
            </div>
          )}

          {/* Strengths and Weaknesses */}
          {analysis && (
            <div className="analysis-section">
              <h2>Performance Analysis</h2>
              <div className="analysis-grid">
                <StrengthWeaknessCard
                  title="Strengths"
                  items={analysis.strengths}
                  type="strength"
                />
                <StrengthWeaknessCard
                  title="Areas to Improve"
                  items={analysis.weaknesses}
                  type="weakness"
                />
              </div>
            </div>
          )}

          {/* Recommendations */}
          {analysis?.recommendations && (
            <div className="recommendations-section">
              <h2>Personalized Recommendations</h2>
              <div className="recommendations-list">
                {analysis.recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-item">
                    <div className="rec-icon">💡</div>
                    <div className="rec-content">
                      <p className="rec-title">{rec.title}</p>
                      <p className="rec-description">{rec.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="result-actions">
            <button onClick={() => navigate('/student/exams')} className="btn btn-secondary">
              Back to Exams
            </button>
            <button onClick={() => window.print()} className="btn btn-primary">
              Print Result
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultAnalysis;
