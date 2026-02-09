import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const DifficultyPerformanceChart = ({ data, examTitle = 'Difficulty Performance', chartType = 'pie' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No difficulty data available</p>
      </div>
    );
  }

  // Sample difficulty data if not provided
  const chartData = data.length > 0 ? data : [
    { difficulty: 'Easy', correct: 8, total: 10, percentage: 80 },
    { difficulty: 'Medium', correct: 5, total: 10, percentage: 50 },
    { difficulty: 'Hard', correct: 2, total: 5, percentage: 40 },
  ];

  const COLORS = ['#10b981', '#f59e0b', '#ef4444'];
  const difficultyColors = {
    'Easy': '#10b981',
    'Medium': '#f59e0b',
    'Hard': '#ef4444',
    'EASY': '#10b981',
    'MEDIUM': '#f59e0b',
    'HARD': '#ef4444',
  };

  // Pie chart data - showing correct answers vs total
  const pieData = chartData.map(item => ({
    name: `${item.difficulty} (${item.percentage}%)`,
    value: item.percentage,
    correct: item.correct || 0,
    total: item.total || 0
  }));

  const getColorForDifficulty = (difficulty) => {
    return difficultyColors[difficulty] || '#3b82f6';
  };

  return (
    <div className="difficulty-performance-chart">
      <h3>{examTitle} - Performance by Difficulty Level</h3>
      
      <div className="difficulty-charts-container">
        {/* Pie Chart */}
        <div className="difficulty-pie-chart">
          <h4>Distribution</h4>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name }) => name}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColorForDifficulty(entry.difficulty)} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `${value}%`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="difficulty-bar-chart">
          <h4>Correct vs Total</h4>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="difficulty" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="correct" fill="#10b981" name="Correct Answers" />
              <Bar dataKey="total" fill="#e5e7eb" name="Total Questions" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Stats Table */}
      <div className="difficulty-stats">
        <h4>Detailed Statistics</h4>
        <table className="difficulty-table">
          <thead>
            <tr>
              <th>Difficulty Level</th>
              <th>Correct</th>
              <th>Total</th>
              <th>Success Rate</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, idx) => (
              <tr key={idx}>
                <td>
                  <span 
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '0.25rem',
                      backgroundColor: getColorForDifficulty(item.difficulty),
                      color: 'white',
                      fontWeight: '600'
                    }}
                  >
                    {item.difficulty}
                  </span>
                </td>
                <td>{item.correct || 0}</td>
                <td>{item.total || 0}</td>
                <td>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: getColorForDifficulty(item.difficulty)
                      }}
                    />
                  </div>
                  <span>{item.percentage}%</span>
                </td>
                <td>
                  {item.percentage >= 70 ? (
                    <span style={{ color: '#10b981', fontWeight: '600' }}>✓ Excellent</span>
                  ) : item.percentage >= 50 ? (
                    <span style={{ color: '#f59e0b', fontWeight: '600' }}>△ Good</span>
                  ) : (
                    <span style={{ color: '#ef4444', fontWeight: '600' }}>✗ Needs Work</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DifficultyPerformanceChart;
