import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../assets/styles/analytics.css';

const PerformanceChart = ({ data, type = 'line' }) => {
  if (!data || !data.labels || data.labels.length === 0) {
    return <div className="chart-empty">No data available</div>;
  }

  const chartData = data.labels.map((label, index) => ({
    name: label,
    score: data.scores[index] || 0,
    passing: data.passingScore || 40
  }));

  return (
    <div className="performance-chart">
      <ResponsiveContainer width="100%" height={300}>
        {type === 'line' ? (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="score"
              stroke="#3b82f6"
              name="Your Score"
              strokeWidth={2}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="passing"
              stroke="#ef4444"
              name="Passing Score"
              strokeDasharray="5 5"
            />
          </LineChart>
        ) : (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="score" fill="#3b82f6" name="Your Score" />
            <Bar dataKey="passing" fill="#ef4444" name="Passing Score" />
          </BarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;
