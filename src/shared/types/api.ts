// Base type definitions
export interface BaseEntity {
  id: number;
  created_at: string;
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

export type QuestionType = 'mcq' | 'short' | 'code';

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}