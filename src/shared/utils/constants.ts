export const API_ENDPOINTS = {
  QUIZZES: '/api/quizzes',
  QUIZ_BY_ID: (id: number) => `/api/quizzes/${id}`,
  QUESTIONS: (quizId: number) => `/api/quizzes/${quizId}/questions`,
  QUESTION_BY_ID: (quizId: number, questionId: number) => 
    `/api/quizzes/${quizId}/questions/${questionId}`,
  ATTEMPTS: '/api/attempts',
  ATTEMPT_BY_ID: (id: number) => `/api/attempts/${id}`,
  ATTEMPT_SUBMIT: (id: number) => `/api/attempts/${id}/submit`,
  ATTEMPT_ANSWERS: (attemptId: number) => `/api/attempts/${attemptId}/answers`,
  ATTEMPT_EVENTS: (attemptId: number) => `/api/attempts/${attemptId}/events`,
} as const;

export const QUERY_KEYS = {
  QUIZZES: ['quizzes'],
  QUIZ: (id: number) => ['quiz', id],
  QUESTIONS: (quizId: number) => ['questions', quizId],
  ATTEMPTS: ['attempts'],
  ATTEMPT: (id: number) => ['attempt', id],
} as const;