import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ChapterPerformanceChart = ({ data, examTitle = 'Chapter Performance' }) => {
  if (!data || data.length === 0) {
    return (
      <div className="chart-empty">
        <p>No chapter data available</p>
      </div>
    );
  }

  // Sample chapter data if not provided
  const chartData = data.length > 0 ? data : [
    { chapter: 'Chapter 1', correct: 4, total: 5, percentage: 80 },
    { chapter: 'Chapter 2', correct: 3, total: 5, percentage: 60 },
    { chapter: 'Chapter 3', correct: 5, total: 6, percentage: 83 },
    { chapter: 'Chapter 4', correct: 2, total: 4, percentage: 50 },
  ];

  const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="chapter-performance-chart">
      <h3>{examTitle} - Chapter Wise Performance</h3>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 60 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="chapter" 
            angle={-45}
            textAnchor="end"
            height={100}
          />
          <YAxis label={{ value: 'Percentage (%)', angle: -90, position: 'insideLeft' }} />
          <Tooltip 
            formatter={(value) => `${value}%`}
            labelFormatter={(label) => `${label}`}
          />
          <Legend />
          <Bar 
            dataKey="percentage" 
            fill="#3b82f6" 
            name="Performance %"
            radius={[8, 8, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <div className="chapter-stats">
        <table className="chapter-table">
          <thead>
            <tr>
              <th>Chapter</th>
              <th>Correct</th>
              <th>Total</th>
              <th>Performance</th>
            </tr>
          </thead>
          <tbody>
            {chartData.map((item, idx) => (
              <tr key={idx}>
                <td>{item.chapter}</td>
                <td>{item.correct || 0}</td>
                <td>{item.total || 0}</td>
                <td>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: colors[idx % colors.length]
                      }}
                    />
                  </div>
                  <span>{item.percentage}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ChapterPerformanceChart;
