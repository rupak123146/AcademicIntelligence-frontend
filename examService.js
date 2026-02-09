import api from './api';
import { API_ENDPOINTS } from '../utils/constants';

const examService = {
  // Get all exams
  getAllExams: async (params = {}) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EXAMS, { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exams' };
    }
  },

  // Get exam by ID
  getExamById: async (examId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EXAM_BY_ID.replace(':id', examId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exam' };
    }
  },

  // Create exam
  createExam: async (examData) => {
    try {
      const response = await api.post(API_ENDPOINTS.CREATE_EXAM, examData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create exam' };
    }
  },

  // Update exam
  updateExam: async (examId, examData) => {
    try {
      const response = await api.put(API_ENDPOINTS.UPDATE_EXAM.replace(':id', examId), examData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to update exam' };
    }
  },

  // Delete exam
  deleteExam: async (examId) => {
    try {
      const response = await api.delete(API_ENDPOINTS.DELETE_EXAM.replace(':id', examId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete exam' };
    }
  },

  // Publish exam
  publishExam: async (examId) => {
    try {
      const response = await api.post(API_ENDPOINTS.PUBLISH_EXAM.replace(':id', examId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to publish exam' };
    }
  },

  // Get exam questions
  getExamQuestions: async (examId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EXAM_QUESTIONS.replace(':id', examId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch questions' };
    }
  },

  // Start exam
  startExam: async (examId) => {
    try {
      const response = await api.post(API_ENDPOINTS.START_EXAM.replace(':id', examId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to start exam' };
    }
  },

  // Submit exam
  submitExam: async (examId, responses) => {
    try {
      const response = await api.post(
        API_ENDPOINTS.SUBMIT_EXAM.replace(':id', examId),
        { responses }
      );
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to submit exam' };
    }
  },

  // Get exam progress
  getExamProgress: async (examId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EXAM_PROGRESS.replace(':id', examId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exam progress' };
    }
  },

  // Get exam result
  getExamResult: async (examId) => {
    try {
      const response = await api.get(API_ENDPOINTS.GET_EXAM_RESULT.replace(':id', examId));
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch exam result' };
    }
  }
};

export default examService;
