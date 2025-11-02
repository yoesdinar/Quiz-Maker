import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  QuizAttempt,
  AttemptResult,
  Quiz,
  Answer,
  AntiCheatEvent,
} from '../../shared/types/api';

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
  
  // Anti-cheat tracking
  antiCheatEvents: AntiCheatEvent[];
  focusLostCount: number;
  pasteCount: number;
  
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
  antiCheatEvents: [],
  focusLostCount: 0,
  pasteCount: 0,
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
    
    // Anti-cheat event tracking
    addAntiCheatEvent: (state, action: PayloadAction<AntiCheatEvent>) => {
      state.antiCheatEvents.push(action.payload);
      
      // Update counters based on event type
      if (action.payload.eventType === 'focus_lost') {
        state.focusLostCount += 1;
      } else if (action.payload.eventType === 'paste_detected') {
        state.pasteCount += 1;
      }
    },
    
    // Reset state
    resetAttempt: (state) => {
      Object.assign(state, initialState);
    },
    
    // Clear error
    clearError: (state) => {
      state.error = null;
    },

    // Actions to handle TanStack Query results
    setCurrentQuiz: (state, action: PayloadAction<Quiz>) => {
      state.currentQuiz = action.payload;
      state.phase = 'taking';
      state.isLoading = false;
      state.error = null;
    },

    setQuizAttempt: (state, action: PayloadAction<{ attempt: QuizAttempt; quiz: Quiz }>) => {
      state.currentAttempt = action.payload.attempt;
      state.currentQuiz = action.payload.quiz;
      state.phase = 'taking';
      state.currentQuestionIndex = 0;
      state.answers = {};
      state.isLoading = false;
      state.error = null;
      
      // Start timer if quiz has time limit
      if (action.payload.quiz.timeLimitSeconds) {
        state.timeRemainingSeconds = action.payload.quiz.timeLimitSeconds;
        state.timerActive = true;
      } else {
        state.timeRemainingSeconds = null;
        state.timerActive = false;
      }
    },

    setQuizResult: (state, action: PayloadAction<AttemptResult>) => {
      state.result = action.payload;
      state.phase = 'completed';
      state.isCompleting = false;
      state.timerActive = false;
    },

    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },

    setSubmitting: (state, action: PayloadAction<boolean>) => {
      state.isSubmitting = action.payload;
    },

    setCompleting: (state, action: PayloadAction<boolean>) => {
      state.isCompleting = action.payload;
    },

    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isSubmitting = false;
      state.isCompleting = false;
      if (action.payload) {
        state.phase = 'error';
        state.timerActive = false;
      }
    },

    setPhase: (state, action: PayloadAction<'loading' | 'taking' | 'completed' | 'error'>) => {
      state.phase = action.payload;
    },
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
  addAntiCheatEvent,
  resetAttempt,
  clearError,
  setCurrentQuiz,
  setQuizAttempt,
  setQuizResult,
  setLoading,
  setSubmitting,
  setCompleting,
  setError,
  setPhase,
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

// Anti-cheat selectors
export const selectAntiCheatEvents = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.antiCheatEvents;
export const selectFocusLostCount = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.focusLostCount;
export const selectPasteCount = (state: { quizAttempt: QuizAttemptState }) => state.quizAttempt.pasteCount;
export const selectAntiCheatSummary = (state: { quizAttempt: QuizAttemptState }) => ({
  totalEvents: state.quizAttempt.antiCheatEvents.length,
  focusLostCount: state.quizAttempt.focusLostCount,
  pasteCount: state.quizAttempt.pasteCount,
  events: state.quizAttempt.antiCheatEvents,
});

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