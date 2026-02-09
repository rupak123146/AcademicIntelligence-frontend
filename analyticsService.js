import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const analyticsService = {
  // Get student analytics
  getStudentAnalytics: async (studentId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_STUDENT_ANALYTICS, {
        params: { studentId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch student analytics' };
    }
  },

  // Get class analytics
  getClassAnalytics: async (classId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_CLASS_ANALYTICS.replace(':classId', classId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch class analytics' };
    }
  },

  // Get chapter analysis
  getChapterAnalysis: async (chapterId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_CHAPTER_ANALYSIS.replace(':chapterId', chapterId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch chapter analysis' };
    }
  },

  // Get performance trends
  getPerformanceTrends: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_PERFORMANCE_TRENDS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch performance trends' };
    }
  },

  // Get strengths and weaknesses
  getStrengthWeakness: async (studentId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_STRENGTH_WEAKNESS, {
        params: { studentId }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch strength/weakness analysis' };
    }
  },

  // Get exam results
  getExamResults: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EXAM_RESULTS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exam results' };
    }
  },

  // Get result by ID
  getResultById: async (resultId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_RESULT_BY_ID.replace(':id', resultId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch result' };
    }
  },

  // Generate report
  generateReport: async (resultId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GENERATE_REPORT.replace(':id', resultId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate report' };
    }
  },

  // Get class students
  getClassStudents: async (classId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.GET_CLASS_STUDENTS.replace(':classId', classId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch class students' };
    }
  },

  // Get student performance
  getStudentPerformance: async (studentId) => {
    try {
      const response = await api.get(
        API_ENDPOINTS.GET_STUDENT_PERFORMANCE.replace(':studentId', studentId)
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch student performance' };
    }
  }
};

export default analyticsService;
