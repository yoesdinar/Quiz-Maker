import { BaseEntity, QuestionType } from '@shared/types';

export interface Quiz extends BaseEntity {
  title: string;
  description: string;
  time_limit_seconds?: number;
  is_published: boolean;
}

export interface Question extends BaseEntity {
  quiz_id: number;
  type: QuestionType;
  prompt: string;
  options_json?: string; // JSON array for MCQ options
  correct_answer?: string;
  position: number;
}

export interface Attempt extends BaseEntity {
  quiz_id: number;
  started_at: string;
  submitted_at?: string;
  score?: number;
}

export interface AttemptAnswer {
  attempt_id: number;
  question_id: number;
  value: string;
}

export interface AttemptEvent extends BaseEntity {
  attempt_id: number;
  event: string;
  timestamp: string;
}

// DTOs for API requests
export interface CreateQuizDto {
  title: string;
  description: string;
  time_limit_seconds?: number;
}

export interface UpdateQuizDto extends Partial<CreateQuizDto> {
  is_published?: boolean;
}

export interface CreateQuestionDto {
  type: QuestionType;
  prompt: string;
  options_json?: string;
  correct_answer?: string;
  position?: number;
}

export interface UpdateQuestionDto extends Partial<CreateQuestionDto> {}

export interface StartAttemptDto {
  quiz_id: number;
}

export interface SubmitAnswerDto {
  question_id: number;
  value: string;
}