// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// User Roles
export const USER_ROLES = {
  STUDENT: 'student',
  FACULTY: 'faculty',
  ADMIN: 'admin'
};

// Exam Status
export const EXAM_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  ONGOING: 'ongoing',
  COMPLETED: 'completed',
  ARCHIVED: 'archived'
};

// Question Types
export const QUESTION_TYPE = {
  MULTIPLE_CHOICE: 'mcq',
  TRUE_FALSE: 'true_false',
  SHORT_ANSWER: 'short_answer',
  ESSAY: 'essay'
};

// Difficulty Levels
export const DIFFICULTY_LEVEL = {
  EASY: 'easy',
  MEDIUM: 'medium',
  HARD: 'hard'
};

// Performance Ranges
export const PERFORMANCE_RANGES = {
  EXCELLENT: { min: 80, max: 100, label: 'Excellent', color: '#10b981' },
  GOOD: { min: 60, max: 79, label: 'Good', color: '#3b82f6' },
  AVERAGE: { min: 40, max: 59, label: 'Average', color: '#f59e0b' },
  POOR: { min: 0, max: 39, label: 'Poor', color: '#ef4444' }
};

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER_DATA: 'userData',
  EXAM_DRAFT: 'examDraft',
  STUDENT_RESPONSES: 'studentResponses'
};

// API Endpoints
export const API_ENDPOINTS = {
  // Auth
  REGISTER: '/auth/register',
  LOGIN: '/auth/login',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  
  // Exams
  GET_EXAMS: '/exams',
  CREATE_EXAM: '/exams',
  GET_EXAM_BY_ID: '/exams/:id',
  UPDATE_EXAM: '/exams/:id',
  DELETE_EXAM: '/exams/:id',
  PUBLISH_EXAM: '/exams/:id/publish',
  GET_EXAM_QUESTIONS: '/exams/:id/questions',
  
  // Student Exam Actions
  START_EXAM: '/student/exams/:id/start',
  SUBMIT_EXAM: '/student/exams/:id/submit',
  GET_EXAM_PROGRESS: '/student/exams/:id/progress',
  GET_EXAM_RESULT: '/student/exams/:id/result',
  
  // Analytics
  GET_STUDENT_ANALYTICS: '/analytics/student',
  GET_CLASS_ANALYTICS: '/analytics/class/:classId',
  GET_CHAPTER_ANALYSIS: '/analytics/chapter/:chapterId',
  GET_PERFORMANCE_TRENDS: '/analytics/trends',
  GET_STRENGTH_WEAKNESS: '/analytics/strengths-weaknesses',
  
  // Results
  GET_EXAM_RESULTS: '/results',
  GET_RESULT_BY_ID: '/results/:id',
  GENERATE_REPORT: '/results/:id/report',
  
  // Faculty
  GET_CLASS_STUDENTS: '/faculty/classes/:classId/students',
  GET_STUDENT_PERFORMANCE: '/faculty/students/:studentId/performance'
};

// Validation Rules
export const VALIDATION_RULES = {
  PASSWORD_MIN_LENGTH: 6,
  PASSWORD_REQUIRE_SPECIAL: true,
  EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  EXAM_TITLE_MAX_LENGTH: 100,
  EXAM_DESCRIPTION_MAX_LENGTH: 500,
  QUESTION_TEXT_MAX_LENGTH: 1000,
  OPTION_TEXT_MAX_LENGTH: 200
};

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_NOT_FOUND: 'User not found',
  USER_ALREADY_EXISTS: 'User already exists',
  UNAUTHORIZED: 'You are not authorized to perform this action',
  EXAM_NOT_FOUND: 'Exam not found',
  EXAM_NOT_STARTED: 'Exam has not started yet',
  EXAM_ENDED: 'Exam has ended',
  NETWORK_ERROR: 'Network error. Please check your connection',
  SERVER_ERROR: 'Server error. Please try again later'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  REGISTRATION_SUCCESS: 'Registration successful',
  EXAM_SUBMITTED: 'Exam submitted successfully',
  PROFILE_UPDATED: 'Profile updated successfully'
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100
};

// Time Configuration (in minutes)
export const TIME_CONFIG = {
  EXAM_WARNING_TIME: 5,
  EXAM_BUFFER_TIME: 1
};

// Charts and Visualization
export const CHART_COLORS = {
  PRIMARY: '#3b82f6',
  SECONDARY: '#10b981',
  SUCCESS: '#10b981',
  WARNING: '#f59e0b',
  DANGER: '#ef4444',
  INFO: '#06b6d4',
  LIGHT: '#f3f4f6',
  DARK: '#1f2937'
};

export default {
  API_BASE_URL,
  USER_ROLES,
  EXAM_STATUS,
  QUESTION_TYPE,
  DIFFICULTY_LEVEL,
  PERFORMANCE_RANGES,
  STORAGE_KEYS,
  API_ENDPOINTS,
  VALIDATION_RULES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES,
  PAGINATION,
  TIME_CONFIG,
  CHART_COLORS
};
