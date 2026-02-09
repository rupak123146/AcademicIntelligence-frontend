import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

// Auth Pages
import Login from '../pages/Auth/Login';
import Register from '../pages/Auth/Register';

// Student Pages
import StudentDashboard from '../pages/Student/StudentDashboard';
import ExamList from '../pages/Student/ExamList';
import ResultAnalysis from '../pages/Student/ResultAnalysis';
import TakeExam from '../pages/Student/TakeExam';

// Faculty Pages
import FacultyDashboard from '../pages/Faculty/FacultyDashboard';
import ClassAnalytics from '../pages/Faculty/ClassAnalytics';
import CreateExam from '../pages/Faculty/CreateExam';
import FacultyReports from '../pages/Faculty/FacultyReports';

// Common Pages
import NotFound from '../pages/NotFound';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Student Routes */}
      <Route
        path="/student/dashboard"
        element={
          <ProtectedRoute requiredRole="student">
            <StudentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exams"
        element={
          <ProtectedRoute requiredRole="student">
            <ExamList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/exam/:examId/take"
        element={
          <ProtectedRoute requiredRole="student">
            <TakeExam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/student/result/:examId"
        element={
          <ProtectedRoute requiredRole="student">
            <ResultAnalysis />
          </ProtectedRoute>
        }
      />

      {/* Faculty Routes */}
      <Route
        path="/faculty/dashboard"
        element={
          <ProtectedRoute requiredRole="faculty">
            <FacultyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/create-exam"
        element={
          <ProtectedRoute requiredRole="faculty">
            <CreateExam />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/reports"
        element={
          <ProtectedRoute requiredRole="faculty">
            <FacultyReports />
          </ProtectedRoute>
        }
      />
      <Route
        path="/faculty/class/:classId/analytics"
        element={
          <ProtectedRoute requiredRole="faculty">
            <ClassAnalytics />
          </ProtectedRoute>
        }
      />

      {/* Default Routes */}
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
