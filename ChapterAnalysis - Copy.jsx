import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import '../../assets/styles/analytics.css';

const ChapterAnalysis = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="chart-empty">No chapter data available</div>;
  }

  return (
    <div className="chapter-analysis">
      <h3>Chapter-wise Performance</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="chapter" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="correct" fill="#10b981" name="Correct" />
          <Bar dataKey="incorrect" fill="#ef4444" name="Incorrect" />
          <Bar dataKey="skipped" fill="#f59e0b" name="Skipped" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ChapterAnalysis;
