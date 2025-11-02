// Base type definitions
export interface BaseEntity {
  id: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: 'success' | 'error';
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export type QuestionType = 'mcq' | 'short';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Quiz attempt types
export interface QuizAttempt extends BaseEntity {
  quizId: number;
  userId?: number; // Make optional since backend doesn't use user auth
  score: number;
  totalQuestions: number;
  status: 'in-progress' | 'completed';
  timeStarted: string;
  timeCompleted?: string;
}

export interface Answer {
  questionId: number;
  answer: string | string[]; // string for short answer, string[] for MCQ
  isCorrect?: boolean; // Only available after submission
}

export interface AttemptAnswer extends BaseEntity {
  attemptId: number;
  questionId: number;
  answer: string;
  isCorrect: boolean;
}

export interface AttemptResult {
  attempt: QuizAttempt;
  answers: AttemptAnswer[];
  quiz: {
    id: number;
    title: string;
    description: string;
    timeLimitSeconds?: number;
    totalQuestions?: number;
    questions: QuizQuestion[];
  };
  summary: {
    totalQuestions: number;
    correctAnswers: number;
    score: number;
    percentage: number;
  };
}

export interface QuizQuestion extends BaseEntity {
  quizId: number;
  type: QuestionType;
  prompt: string;
  options?: string[]; // Only for MCQ
  correctAnswer: string | string[];
  points: number;
}

export interface Quiz extends BaseEntity {
  title: string;
  description: string;
  timeLimitSeconds?: number;
  isPublished?: boolean;
  totalQuestions?: number;
  questions?: QuizQuestion[];
}

// Request/Response types
export interface CreateAttemptRequest {
  quizId: number;
}

export interface SubmitAnswerRequest {
  attemptId: number;
  questionId: number;
  answerValue: string; // Match what Redux slice expects
}

export interface CompleteAttemptRequest {
  attemptId: number;
}

// Anti-cheat event types
export type AntiCheatEventType = 'focus_lost' | 'focus_gained' | 'paste_detected';

export interface AntiCheatEvent {
  attemptId: number;
  eventType: AntiCheatEventType;
  timestamp: string;
  metadata?: Record<string, any>;
}

export interface RecordEventRequest {
  attemptId: number;
  event: AntiCheatEventType;
  timestamp?: string;
  metadata?: Record<string, any>;
}

export interface AntiCheatSummary {
  totalEvents: number;
  focusLostCount: number;
  pasteCount: number;
  events: AntiCheatEvent[];
}