import { BaseEntity, QuestionType } from '@shared/types';

export interface Quiz extends BaseEntity {
  title: string;
  description: string;
  timeLimitSeconds?: number;
  isPublished: boolean;
  questions?: Question[]; // Included when fetching quiz details
}

export interface Question extends BaseEntity {
  quizId: number;
  type: QuestionType;
  prompt: string;
  options?: string[]; // Parsed array from backend (not JSON string)
  correctAnswer?: string | number;
  position: number;
}

export interface Attempt extends BaseEntity {
  quizId: number;
  startedAt: string;
  submittedAt?: string;
  score?: number;
  answers?: AttemptAnswer[];
  quiz?: QuizSnapshot; // Quiz snapshot from start attempt response
}

export interface QuizSnapshot {
  id: number;
  title: string;
  description: string;
  timeLimitSeconds?: number;
  questions: Question[];
}

export interface AttemptAnswer {
  attemptId: number;
  questionId: number;
  value: string;
}

export interface AttemptEvent extends BaseEntity {
  attemptId: number;
  event: string;
  timestamp: string;
}

// DTOs for API requests (match backend request format)
export interface CreateQuizDto {
  title: string;
  description: string;
  timeLimitSeconds?: number;
}

export interface UpdateQuizDto extends Partial<CreateQuizDto> {
  isPublished?: boolean;
}

export interface CreateQuestionDto {
  type: QuestionType;
  prompt: string;
  options?: string[]; // Array of options for MCQ
  correctAnswer?: string | number;
  position?: number;
}

export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {}

export interface StartAttemptDto {
  quizId: number;
}

export interface SubmitAnswerDto {
  questionId: number;
  value: string;
}

// Response types
export interface SubmitAttemptResponse {
  score: number;
  details: Array<{
    questionId: number;
    correct: boolean;
    expected?: string;
  }>;
}