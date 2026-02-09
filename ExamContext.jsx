import React, { createContext, useState, useCallback } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

export const ExamContext = createContext();

export const ExamProvider = ({ children }) => {
  const [currentExam, setCurrentExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState({});
  const [startTime, setStartTime] = useState(null);
  const [isExamActive, setIsExamActive] = useState(false);
  const [examResult, setExamResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const startExam = useCallback((exam, examQuestions) => {
    setCurrentExam(exam);
    setQuestions(examQuestions);
    setCurrentQuestionIndex(0);
    setResponses({});
    setStartTime(new Date());
    setIsExamActive(true);
    setError(null);
    
    // Save to localStorage
    localStorage.setItem(STORAGE_KEYS.STUDENT_RESPONSES, JSON.stringify({
      examId: exam.id,
      responses: {},
      startTime: new Date().toISOString()
    }));
  }, []);

  const updateResponse = useCallback((questionId, answer, timeSpent = 0) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: {
        answer,
        timeSpent,
        answered: true
      }
    }));
    
    // Update localStorage
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEYS.STUDENT_RESPONSES) || '{}');
    stored.responses = { ...stored.responses, [questionId]: { answer, timeSpent, answered: true } };
    localStorage.setItem(STORAGE_KEYS.STUDENT_RESPONSES, JSON.stringify(stored));
  }, []);

  const goToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  const nextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const previousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const submitExam = useCallback((result) => {
    setExamResult(result);
    setIsExamActive(false);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_RESPONSES);
  }, []);

  const endExam = useCallback(() => {
    setCurrentExam(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setResponses({});
    setStartTime(null);
    setIsExamActive(false);
    localStorage.removeItem(STORAGE_KEYS.STUDENT_RESPONSES);
  }, []);

  const value = {
    currentExam,
    questions,
    currentQuestionIndex,
    responses,
    startTime,
    isExamActive,
    examResult,
    loading,
    error,
    setError,
    setLoading,
    startExam,
    updateResponse,
    goToQuestion,
    nextQuestion,
    previousQuestion,
    submitExam,
    endExam
  };

  return (
    <ExamContext.Provider value={value}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = React.useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within ExamProvider');
  }
  return context;
};
