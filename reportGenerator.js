/**
 * Report Generator Utility
 * Generates PDF and Excel reports for exam analytics
 */

// Simple CSV export function (Excel compatible)
export const generateExcelReport = (data, fileName = 'exam-report.csv') => {
  try {
    const csv = convertToCSV(data);
    downloadFile(csv, fileName, 'text/csv;charset=utf-8;');
  } catch (error) {
    console.error('Error generating Excel report:', error);
    throw new Error('Failed to generate Excel report');
  }
};

// Convert data to CSV format
const convertToCSV = (data) => {
  if (!data || data.length === 0) {
    return '';
  }

  // Get headers from first object
  const headers = Object.keys(data[0]);
  
  // Create header row
  const headerRow = headers.join(',');
  
  // Create data rows
  const dataRows = data.map(row =>
    headers.map(header => {
      const value = row[header];
      // Escape quotes and wrap in quotes if contains comma
      const escapedValue = String(value || '').replace(/"/g, '""');
      return escapedValue.includes(',') ? `"${escapedValue}"` : escapedValue;
    }).join(',')
  );

  return [headerRow, ...dataRows].join('\n');
};

// Download file utility
const downloadFile = (content, fileName, contentType) => {
  const blob = new Blob([content], { type: contentType });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', fileName);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Generate PDF Report (simple text-based, browser-friendly)
export const generatePDFReport = (reportData, fileName = 'exam-report.pdf') => {
  try {
    // Since we don't have a PDF library, we'll create a simple HTML report
    // that can be printed as PDF through the browser
    const html = generateHTMLReport(reportData);
    
    // Open in new window for better print options
    const printWindow = window.open('', '_blank');
    printWindow.document.write(html);
    printWindow.document.close();
    
    // Auto print for convenience
    setTimeout(() => {
      printWindow.print();
    }, 250);
  } catch (error) {
    console.error('Error generating PDF report:', error);
    throw new Error('Failed to generate PDF report');
  }
};

// Generate HTML report for printing
const generateHTMLReport = (reportData) => {
  const {
    examTitle = 'Exam Report',
    examDetails = {},
    studentResults = [],
    stats = {},
    chapterData = [],
    difficultyData = [],
    generatedAt = new Date().toLocaleString()
  } = reportData;

  const resultsTableHTML = studentResults.length > 0 ? `
    <h3>Student Results</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: left;">Student Name</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: left;">Email</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Score</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Percentage</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Status</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: left;">Date</th>
        </tr>
      </thead>
      <tbody>
        ${studentResults.map(result => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${result.studentName || 'N/A'}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${result.studentEmail || 'N/A'}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${result.score || 0}/${result.totalMarks || 0}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${result.percentage || 0}%</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">
              <strong style="color: ${result.passed ? '#10b981' : '#ef4444'};">
                ${result.passed ? 'PASSED' : 'FAILED'}
              </strong>
            </td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${result.submittedAt || 'N/A'}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '';

  const chapterTableHTML = chapterData.length > 0 ? `
    <h3>Chapter-wise Performance</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: left;">Chapter</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Correct</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Total</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Performance</th>
        </tr>
      </thead>
      <tbody>
        ${chapterData.map(chapter => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${chapter.chapter || 'N/A'}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${chapter.correct || 0}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${chapter.total || 0}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;"><strong>${chapter.percentage || 0}%</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '';

  const difficultyTableHTML = difficultyData.length > 0 ? `
    <h3>Performance by Difficulty</h3>
    <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
      <thead>
        <tr style="background-color: #f3f4f6; border-bottom: 2px solid #d1d5db;">
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: left;">Difficulty</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Correct</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Total</th>
          <th style="padding: 10px; border: 1px solid #d1d5db; text-align: center;">Success Rate</th>
        </tr>
      </thead>
      <tbody>
        ${difficultyData.map(diff => `
          <tr style="border-bottom: 1px solid #e5e7eb;">
            <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>${diff.difficulty || 'N/A'}</strong></td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${diff.correct || 0}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;">${diff.total || 0}</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb; text-align: center;"><strong>${diff.percentage || 0}%</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  ` : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${examTitle} Report</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
          padding: 40px;
        }
        .report-header {
          text-align: center;
          margin-bottom: 40px;
          border-bottom: 3px solid #3b82f6;
          padding-bottom: 20px;
        }
        .report-header h1 {
          color: #1f2937;
          margin-bottom: 10px;
          font-size: 28px;
        }
        .report-meta {
          color: #6b7280;
          font-size: 14px;
        }
        .stats-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 20px;
          margin: 30px 0;
        }
        .stat-box {
          background: #f3f4f6;
          padding: 20px;
          border-radius: 8px;
          text-align: center;
          border-left: 4px solid #3b82f6;
        }
        .stat-box h4 {
          color: #6b7280;
          font-size: 12px;
          text-transform: uppercase;
          margin-bottom: 10px;
        }
        .stat-box .value {
          font-size: 24px;
          font-weight: bold;
          color: #1f2937;
        }
        h3 {
          color: #1f2937;
          margin-top: 40px;
          margin-bottom: 20px;
          font-size: 18px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        @media print {
          body { padding: 0; }
          .stats-container { page-break-inside: avoid; }
          table { page-break-inside: avoid; }
          h3 { page-break-before: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="report-header">
        <h1>${examTitle} - Comprehensive Report</h1>
        <div class="report-meta">
          <p>Generated on: ${generatedAt}</p>
        </div>
      </div>

      <div class="stats-container">
        <div class="stat-box">
          <h4>Total Attempts</h4>
          <div class="value">${stats.totalAttempts || 0}</div>
        </div>
        <div class="stat-box">
          <h4>Average Score</h4>
          <div class="value">${stats.averageScore || 0}%</div>
        </div>
        <div class="stat-box">
          <h4>Passed</h4>
          <div class="value" style="color: #10b981;">${stats.passed || 0}</div>
        </div>
        <div class="stat-box">
          <h4>Failed</h4>
          <div class="value" style="color: #ef4444;">${stats.failed || 0}</div>
        </div>
      </div>

      ${resultsTableHTML}
      ${chapterTableHTML}
      ${difficultyTableHTML}

      <div class="report-footer" style="margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
        <p>This is a confidential report generated by ExamPlatform</p>
      </div>
    </body>
    </html>
  `;
};

// Generate student performance report
export const generateStudentReport = (studentData, fileName = 'student-report.csv') => {
  try {
    const csv = convertToCSV(studentData);
    downloadFile(csv, fileName, 'text/csv;charset=utf-8;');
  } catch (error) {
    console.error('Error generating student report:', error);
    throw new Error('Failed to generate student report');
  }
};

// Export all results as Excel/CSV
export const exportResultsToExcel = (results, examTitle = 'exam') => {
  const data = results.map(result => ({
    'Student Name': result.studentName,
    'Email': result.studentEmail,
    'Score': result.score,
    'Total Marks': result.totalMarks,
    'Percentage': result.percentage,
    'Correct Answers': result.correctAnswers,
    'Incorrect Answers': result.incorrectAnswers,
    'Unanswered': result.unanswered,
    'Status': result.passed ? 'Passed' : 'Failed',
    'Date Submitted': result.submittedAt
  }));

  generateExcelReport(data, `${examTitle}-results-${new Date().toISOString().split('T')[0]}.csv`);
};
