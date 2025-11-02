import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../hooks';
import {
  // Actions
  navigateToPage,
  goToQuizDetails,
  goToQuestions,
  updateQuizForm,
  resetQuizForm,
  addNewQuestion,
  updateCurrentQuestion,
  setCurrentQuestionIndex,
  removeQuestion,
  addMcqOption,
  removeMcqOption,
  updateMcqOption,
  resetQuizBuilder,
  clearError,
  
  // Async Thunks
  createQuiz,
  saveQuestion,
  finishQuiz,
  
  // Types
  QuizBuilderPage,
  QuestionBuilder,
  QuizBuilderForm,
} from '../slices/quizBuilderSlice';
import { QuestionType } from '../../shared/types';
import { CreateQuizDto, CreateQuestionDto } from '../../domain/entities/Quiz';

export const useQuizBuilder = () => {
  const dispatch = useAppDispatch();
  
  // Select state
  const state = useAppSelector((state) => state.quizBuilder);
  
  // Navigation actions
  const navigation = {
    navigateToPage: useCallback((page: QuizBuilderPage) => {
      dispatch(navigateToPage(page));
    }, [dispatch]),
    
    goToQuizDetails: useCallback(() => {
      dispatch(goToQuizDetails());
    }, [dispatch]),
    
    goToQuestions: useCallback(() => {
      dispatch(goToQuestions());
    }, [dispatch]),
  };
  
  // Quiz form actions
  const quizForm = {
    updateForm: useCallback((updates: Partial<QuizBuilderForm>) => {
      dispatch(updateQuizForm(updates));
    }, [dispatch]),
    
    resetForm: useCallback(() => {
      dispatch(resetQuizForm());
    }, [dispatch]),
    
    createQuiz: useCallback(async (quizData: CreateQuizDto) => {
      return dispatch(createQuiz(quizData));
    }, [dispatch]),
  };
  
  // Question management actions
  const questions = {
    addQuestion: useCallback((type: QuestionType) => {
      dispatch(addNewQuestion(type));
    }, [dispatch]),
    
    updateCurrentQuestion: useCallback((updates: Partial<Omit<QuestionBuilder, 'id' | 'position'>>) => {
      dispatch(updateCurrentQuestion(updates));
    }, [dispatch]),
    
    setCurrentIndex: useCallback((index: number) => {
      dispatch(setCurrentQuestionIndex(index));
    }, [dispatch]),
    
    removeQuestion: useCallback((questionId: string) => {
      dispatch(removeQuestion(questionId));
    }, [dispatch]),
    
    saveQuestion: useCallback(async (quizId: number, questionData: CreateQuestionDto) => {
      return dispatch(saveQuestion({ quizId, questionData }));
    }, [dispatch]),
  };
  
  // MCQ specific actions
  const mcq = {
    addOption: useCallback(() => {
      dispatch(addMcqOption());
    }, [dispatch]),
    
    removeOption: useCallback((index: number) => {
      dispatch(removeMcqOption(index));
    }, [dispatch]),
    
    updateOption: useCallback((index: number, value: string) => {
      dispatch(updateMcqOption({ index, value }));
    }, [dispatch]),
  };
  
  // Utility actions
  const utils = {
    reset: useCallback(() => {
      dispatch(resetQuizBuilder());
    }, [dispatch]),
    
    clearError: useCallback(() => {
      dispatch(clearError());
    }, [dispatch]),
    
    finishQuiz: useCallback(async (quizId: number) => {
      return dispatch(finishQuiz(quizId));
    }, [dispatch]),
  };
  
  // Computed values
  const computed = {
    currentQuestion: state.questions[state.currentQuestionIndex] || null,
    hasQuestions: state.questions.length > 0,
    questionsCount: state.questions.length,
    validQuestionsCount: state.questions.filter(q => q.isValid).length,
    isCurrentQuestionValid: state.questions[state.currentQuestionIndex]?.isValid ?? false,
    canAddMoreQuestions: true, // No limit for now
    progressPercentage: state.questions.length > 0 
      ? Math.round((state.questions.filter(q => q.isValid).length / Math.max(state.questions.length, 2)) * 100)
      : 0,
  };
  
  return {
    // State
    ...state,
    
    // Actions grouped by functionality
    navigation,
    quizForm,
    questions,
    mcq,
    utils,
    
    // Computed values
    computed,
  };
};

// Helper hook for question type specific logic
export const useQuestionTypeHelpers = () => {
  return {
    getQuestionTypeLabel: (type: QuestionType): string => {
      switch (type) {
        case 'mcq':
          return 'Multiple Choice';
        case 'short':
          return 'Short Answer';
        default:
          return 'Unknown';
      }
    },
    
    getQuestionTypeIcon: (type: QuestionType): string => {
      switch (type) {
        case 'mcq':
          return '☑️';
        case 'short':
          return '✏️';
        default:
          return '❓';
      }
    },
    
    getDefaultCorrectAnswer: (type: QuestionType): string | number => {
      switch (type) {
        case 'mcq':
          return 0;
        case 'short':
          return '';
        default:
          return '';
      }
    },
    
    getMinimumOptions: (type: QuestionType): number => {
      return type === 'mcq' ? 2 : 0;
    },
  };
};