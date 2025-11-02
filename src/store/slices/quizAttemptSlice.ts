import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AttemptRepository } from '../../infrastructure/repositories/AttemptRepository';
import {
  QuizAttempt,
  AttemptResult,
  Quiz,
  Answer,
  CreateAttemptRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest
} from '../../shared/types/api';

// Async thunks
const attemptRepository = new AttemptRepository();

export const startQuizAttempt = createAsyncThunk(
  'quizAttempt/start',
  async (request: CreateAttemptRequest) => {
    // The backend returns both attempt and quiz data in one call
    return await attemptRepository.createAttempt(request);
  }
);

export const submitAnswer = createAsyncThunk(
  'quizAttempt/submitAnswer',
  async (request: SubmitAnswerRequest) => {
    await attemptRepository.submitAnswer(request);
    return request;
  }
);

export const completeQuizAttempt = createAsyncThunk(
  'quizAttempt/complete',
  async (request: CompleteAttemptRequest) => {
    return await attemptRepository.completeAttempt(request);
  }
);

export const loadQuizForTaking = createAsyncThunk(
  'quizAttempt/loadQuiz',
  async (quizId: number) => {
    return await attemptRepository.getQuizForAttempt(quizId);
  }
);

// State interface
interface QuizAttemptState {
  // Current attempt
  currentAttempt: QuizAttempt | null;
  currentQuiz: Quiz | null;
  
  // Navigation
  currentQuestionIndex: number;
  
  // Answers tracking
  answers: Record<number, Answer>; // questionId -> Answer
  
  // Timer
  timeRemainingSeconds: number | null; // null means no time limit
  timerActive: boolean;
  
  // Result
  result: AttemptResult | null;
  
  // UI states
  isLoading: boolean;
  isSubmitting: boolean;
  isCompleting: boolean;
  error: string | null;
  
  // Flow control
  phase: 'loading' | 'taking' | 'completed' | 'error';
}

const initialState: QuizAttemptState = {
  currentAttempt: null,
  currentQuiz: null,
  currentQuestionIndex: 0,
  answers: {},
  timeRemainingSeconds: null,
  timerActive: false,
  result: null,
  isLoading: false,
  isSubmitting: false,
  isCompleting: false,
  error: null,
  phase: 'loading',
};

const quizAttemptSlice = createSlice({
  name: 'quizAttempt',
  initialState,
  reducers: {
    // Navigation actions
    goToNextQuestion: (state) => {
      if (state.currentQuiz && state.currentQuestionIndex < state.currentQuiz.questions!.length - 1) {
        state.currentQuestionIndex += 1;
      }
    },
    
    goToPreviousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
      }
    },
    
    goToQuestion: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      if (state.currentQuiz && index >= 0 && index < state.currentQuiz.questions!.length) {
        state.currentQuestionIndex = index;
      }
    },
    
    // Answer management
    setAnswer: (state, action: PayloadAction<{ questionId: number; answer: Answer }>) => {
      const { questionId, answer } = action.payload;
      state.answers[questionId] = answer;
    },
    
    // Timer management
    startTimer: (state, action: PayloadAction<number>) => {
      state.timeRemainingSeconds = action.payload;
      state.timerActive = true;
    },
    
    tickTimer: (state) => {
      if (state.timeRemainingSeconds !== null && state.timeRemainingSeconds > 0) {
        state.timeRemainingSeconds -= 1;
      }
      if (state.timeRemainingSeconds === 0) {
        state.timerActive = false;
      }
    },
    
    pauseTimer: (state) => {
      state.timerActive = false;
    },
    
    stopTimer: (state) => {
      state.timerActive = false;
      state.timeRemainingSeconds = null;
    },
    
    // Reset state
    resetAttempt: (state) => {
      Object.assign(state, initialState);
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load quiz for taking
      .addCase(loadQuizForTaking.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.phase = 'loading';
      })
      .addCase(loadQuizForTaking.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentQuiz = action.payload;
        state.phase = 'taking';
      })
      .addCase(loadQuizForTaking.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load quiz';
        state.phase = 'error';
      })
      
      // Start attempt
      .addCase(startQuizAttempt.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startQuizAttempt.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentAttempt = action.payload.attempt;
        state.currentQuiz = action.payload.quiz;
        state.phase = 'taking';
        state.currentQuestionIndex = 0;
        state.answers = {};
        
        // Start timer if quiz has time limit
        if (action.payload.quiz.timeLimitSeconds) {
          state.timeRemainingSeconds = action.payload.quiz.timeLimitSeconds;
          state.timerActive = true;
        } else {
          state.timeRemainingSeconds = null;
          state.timerActive = false;
        }
      })
      .addCase(startQuizAttempt.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to start quiz attempt';
        state.phase = 'error';
        // Stop timer on error
        state.timerActive = false;
        state.timeRemainingSeconds = null;
      })
      
      // Submit answer
      .addCase(submitAnswer.pending, (state) => {
        state.isSubmitting = true;
        state.error = null;
      })
      .addCase(submitAnswer.fulfilled, (state) => {
        state.isSubmitting = false;
      })
      .addCase(submitAnswer.rejected, (state, action) => {
        state.isSubmitting = false;
        state.error = action.error.message || 'Failed to submit answer';
      })
      
      // Complete attempt
      .addCase(completeQuizAttempt.pending, (state) => {
        state.isCompleting = true;
        state.error = null;
      })
      .addCase(completeQuizAttempt.fulfilled, (state, action) => {
        state.isCompleting = false;
        state.result = action.payload;
        state.phase = 'completed';
        // Stop timer when quiz is completed
        state.timerActive = false;
      })
      .addCase(completeQuizAttempt.rejected, (state, action) => {
        state.isCompleting = false;
        state.error = action.error.message || 'Failed to complete quiz';
        // Stop timer on error
        state.timerActive = false;
      });
  },
});

export const {
  goToNextQuestion,
  goToPreviousQuestion,
  goToQuestion,
  setAnswer,
  startTimer,
  tickTimer,
  pauseTimer,
  stopTimer,
  resetAttempt,
  clearError,
} = quizAttemptSlice.actions;

export default quizAttemptSlice.reducer;

// Selectors
export const selectCurrentQuiz = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.currentQuiz;
export const selectCurrentAttempt = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.currentAttempt;
export const selectCurrentQuestionIndex = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.currentQuestionIndex;
export const selectCurrentQuestion = (state: { quizAttempt: QuizAttemptState }) => {
  const { currentQuiz, currentQuestionIndex } = state.quizAttempt;
  return currentQuiz?.questions?.[currentQuestionIndex] || null;
};
export const selectAnswers = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.answers;
export const selectAnswer = (questionId: number) => (state: { quizAttempt: QuizAttemptState }) => 
  state.quizAttempt.answers[questionId] || null;
export const selectResult = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.result;
export const selectPhase = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.phase;
export const selectIsLoading = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.isLoading;
export const selectIsSubmitting = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.isSubmitting;
export const selectIsCompleting = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.isCompleting;
export const selectError = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.error;

// Timer selectors
export const selectTimeRemainingSeconds = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.timeRemainingSeconds;
export const selectTimerActive = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.timerActive;
export const selectHasTimeLimit = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.timeRemainingSeconds !== null;

// Progress selectors
export const selectProgress = (state: { quizAttempt: QuizAttemptState }) => {
  const { currentQuiz, answers } = state.quizAttempt;
  if (!currentQuiz?.questions) return { answered: 0, total: 0, percentage: 0 };
  
  const answered = Object.keys(answers).length;
  const total = currentQuiz.questions.length;
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;
  
  return { answered, total, percentage };
};

export const selectCanNavigateNext = (state: { quizAttempt: QuizAttemptState }) => {
  const { currentQuiz, currentQuestionIndex } = state.quizAttempt;
  return currentQuiz && currentQuestionIndex < currentQuiz.questions!.length - 1;
};

export const selectCanNavigatePrevious = (state: { quizAttempt: QuizAttemptState }) => {
  return state.quizAttempt.currentQuestionIndex > 0;
};

export const selectCanComplete = (state: { quizAttempt: QuizAttemptState }) => {
  const { currentQuiz, answers } = state.quizAttempt;
  if (!currentQuiz?.questions) return false;
  
  // Check if all questions have been answered
  return currentQuiz.questions.every(question => answers[question.id] !== undefined);
};