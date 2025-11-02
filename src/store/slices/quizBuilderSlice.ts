import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { QuizRepository } from '../../infrastructure/repositories/QuizRepository';
import { 
  Quiz, 
  Question, 
  CreateQuizDto, 
  CreateQuestionDto
} from '../../domain/entities/Quiz';
import { QuestionType } from '../../shared/types';
import { RootState } from '../store';

// Create repository instance
const quizRepository = new QuizRepository();

// Quiz Builder State Types
export type QuizBuilderPage = 'entry' | 'details' | 'questions' | 'preview';

export interface QuestionBuilder {
  id: string; // temporary ID for local state
  type: QuestionType;
  prompt: string;
  options: string[];
  correctAnswer: string | number;
  position: number;
  isValid: boolean;
}

export interface QuizBuilderForm {
  title: string;
  description: string;
  timeLimitSeconds?: number;
  isValid: boolean;
}

export interface QuizBuilderState {
  // Navigation
  currentPage: QuizBuilderPage;
  
  // Quiz Details
  quizForm: QuizBuilderForm;
  createdQuiz: Quiz | null;
  
  // Questions
  questions: QuestionBuilder[];
  currentQuestionIndex: number;
  
  // UI State
  loading: boolean;
  error: string | null;
  
  // Validation
  canProceedToQuestions: boolean;
  canFinishQuiz: boolean;
}

// Async Thunks
export const createQuiz = createAsyncThunk<
  Quiz,
  CreateQuizDto,
  { state: RootState }
>('quizBuilder/createQuiz', async (quizData, { rejectWithValue }) => {
  try {
    const response = await quizRepository.createQuiz(quizData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to create quiz');
  }
});

export const saveQuestion = createAsyncThunk<
  Question,
  { quizId: number; questionData: CreateQuestionDto },
  { state: RootState }
>('quizBuilder/saveQuestion', async ({ quizId, questionData }, { rejectWithValue }) => {
  try {
    const response = await quizRepository.createQuestion(quizId, questionData);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to save question');
  }
});

export const finishQuiz = createAsyncThunk<
  Quiz,
  number,
  { state: RootState }
>('quizBuilder/finishQuiz', async (quizId, { rejectWithValue }) => {
  try {
    // Publish the quiz
    const response = await quizRepository.publishQuiz(quizId);
    return response;
  } catch (error: any) {
    return rejectWithValue(error.message || 'Failed to finish quiz');
  }
});

// Initial State
const initialState: QuizBuilderState = {
  currentPage: 'entry',
  
  quizForm: {
    title: '',
    description: '',
    timeLimitSeconds: undefined,
    isValid: false,
  },
  createdQuiz: null,
  
  questions: [],
  currentQuestionIndex: 0,
  
  loading: false,
  error: null,
  
  canProceedToQuestions: false,
  canFinishQuiz: false,
};

// Helper Functions
const validateQuizForm = (form: QuizBuilderForm): boolean => {
  return form.title.trim().length > 0 && form.description.trim().length > 0;
};

const validateQuestion = (question: QuestionBuilder): boolean => {
  if (!question.prompt.trim()) return false;
  
  switch (question.type) {
    case 'mcq':
      return question.options.length >= 2 && 
             question.options.every(opt => opt.trim().length > 0) &&
             (typeof question.correctAnswer === 'number' && 
              question.correctAnswer >= 0 && 
              question.correctAnswer < question.options.length);
    
    case 'short':
      return typeof question.correctAnswer === 'string' && 
             question.correctAnswer.trim().length > 0;
    
    default:
      return false;
  }
};

const canFinishQuiz = (questions: QuestionBuilder[]): boolean => {
  const validQuestions = questions.filter(q => q.isValid);
  return validQuestions.length >= 2;
};

const generateTempId = (): string => {
  return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Quiz Builder Slice
const quizBuilderSlice = createSlice({
  name: 'quizBuilder',
  initialState,
  reducers: {
    // Navigation
    navigateToPage: (state, action: PayloadAction<QuizBuilderPage>) => {
      state.currentPage = action.payload;
    },
    
    goToQuizDetails: (state) => {
      state.currentPage = 'details';
      state.error = null;
    },
    
    goToQuestions: (state) => {
      if (state.canProceedToQuestions) {
        state.currentPage = 'questions';
      }
    },
    
    // Quiz Form Management
    updateQuizForm: (state, action: PayloadAction<Partial<QuizBuilderForm>>) => {
      state.quizForm = { ...state.quizForm, ...action.payload };
      state.quizForm.isValid = validateQuizForm(state.quizForm);
      state.canProceedToQuestions = state.quizForm.isValid;
    },
    
    resetQuizForm: (state) => {
      state.quizForm = initialState.quizForm;
      state.canProceedToQuestions = false;
    },
    
    // Question Management
    addNewQuestion: (state, action: PayloadAction<QuestionType>) => {
      const newQuestion: QuestionBuilder = {
        id: generateTempId(),
        type: action.payload,
        prompt: '',
        options: action.payload === 'mcq' ? ['', ''] : [],
        correctAnswer: action.payload === 'mcq' ? 0 : '',
        position: state.questions.length,
        isValid: false,
      };
      
      state.questions.push(newQuestion);
      state.currentQuestionIndex = state.questions.length - 1;
      state.canFinishQuiz = canFinishQuiz(state.questions);
    
    },
    
    updateCurrentQuestion: (state, action: PayloadAction<Partial<Omit<QuestionBuilder, 'id' | 'position'>>>) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (currentQuestion) {
        Object.assign(currentQuestion, action.payload);
        currentQuestion.isValid = validateQuestion(currentQuestion);
        state.canFinishQuiz = canFinishQuiz(state.questions);
      }
    },
    
    setCurrentQuestionIndex: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.questions.length) {
        state.currentQuestionIndex = action.payload;
      }
    },
    
    removeQuestion: (state, action: PayloadAction<string>) => {
      const questionIndex = state.questions.findIndex(q => q.id === action.payload);
      if (questionIndex !== -1) {
        state.questions.splice(questionIndex, 1);
        
        // Update positions
        state.questions.forEach((q, index) => {
          q.position = index;
        });
        
        // Adjust current index if needed
        if (state.currentQuestionIndex >= state.questions.length) {
          state.currentQuestionIndex = Math.max(0, state.questions.length - 1);
        }
        
        state.canFinishQuiz = canFinishQuiz(state.questions);
      }
    },
    
    // MCQ Specific Actions
    addMcqOption: (state) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (currentQuestion && currentQuestion.type === 'mcq') {
        currentQuestion.options.push('');
        currentQuestion.isValid = validateQuestion(currentQuestion);
      }
    },
    
    removeMcqOption: (state, action: PayloadAction<number>) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (currentQuestion && currentQuestion.type === 'mcq' && currentQuestion.options.length > 2) {
        currentQuestion.options.splice(action.payload, 1);
        
        // Adjust correctAnswer if it's affected
        if (typeof currentQuestion.correctAnswer === 'number' && 
            currentQuestion.correctAnswer >= currentQuestion.options.length) {
          currentQuestion.correctAnswer = currentQuestion.options.length - 1;
        }
        
        currentQuestion.isValid = validateQuestion(currentQuestion);
        state.canFinishQuiz = canFinishQuiz(state.questions);
      }
    },
    
    updateMcqOption: (state, action: PayloadAction<{ index: number; value: string }>) => {
      const currentQuestion = state.questions[state.currentQuestionIndex];
      if (currentQuestion && currentQuestion.type === 'mcq') {
        currentQuestion.options[action.payload.index] = action.payload.value;
        currentQuestion.isValid = validateQuestion(currentQuestion);
        state.canFinishQuiz = canFinishQuiz(state.questions);
      }
    },
    
    // Reset and Clear
    resetQuizBuilder: () => {
      return { ...initialState };
    },
    
    clearError: (state) => {
      state.error = null;
    },
  },
  
  extraReducers: (builder) => {
    // Create Quiz
    builder
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.createdQuiz = action.payload;
        state.currentPage = 'questions';
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to create quiz';
      })
      
      // Save Question
      .addCase(saveQuestion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveQuestion.fulfilled, (state, action) => {
        state.loading = false;
        // Update the question in state with the server response
        const questionIndex = state.questions.findIndex(
          q => q.position === action.payload.position
        );
        if (questionIndex !== -1) {
          // Mark as saved (you might want to add a 'saved' field to track this)
          state.questions[questionIndex].isValid = true;
        }
      })
      .addCase(saveQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to save question';
      })
      
      // Finish Quiz
      .addCase(finishQuiz.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(finishQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.createdQuiz = action.payload;
        // Navigate to preview or success page
        state.currentPage = 'preview';
      })
      .addCase(finishQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Failed to finish quiz';
      });
  },
});

export const {
  // Navigation
  navigateToPage,
  goToQuizDetails,
  goToQuestions,
  
  // Quiz Form
  updateQuizForm,
  resetQuizForm,
  
  // Questions
  addNewQuestion,
  updateCurrentQuestion,
  setCurrentQuestionIndex,
  removeQuestion,
  
  // MCQ Options
  addMcqOption,
  removeMcqOption,
  updateMcqOption,
  
  // Reset & Clear
  resetQuizBuilder,
  clearError,
} = quizBuilderSlice.actions;

export default quizBuilderSlice.reducer;