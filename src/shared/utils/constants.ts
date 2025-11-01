export const API_ENDPOINTS = {
  QUIZZES: '/quizzes',
  QUIZ_BY_ID: (id: number) => `/quizzes/${id}`,
  QUESTIONS: (quizId: number) => `/quizzes/${quizId}/questions`,
  QUESTION_BY_ID: (questionId: number) => `/questions/${questionId}`,
  ATTEMPTS: '/attempts',
  ATTEMPT_BY_ID: (id: number) => `/attempts/${id}`,
  ATTEMPT_SUBMIT: (id: number) => `/attempts/${id}/submit`,
  ATTEMPT_ANSWER: (attemptId: number) => `/attempts/${attemptId}/answer`,
  ATTEMPT_EVENTS: (attemptId: number) => `/attempts/${attemptId}/events`,
} as const;

export const QUERY_KEYS = {
  QUIZZES: ['quizzes'],
  QUIZ: (id: number) => ['quiz', id],
  QUESTIONS: (quizId: number) => ['questions', quizId],
  ATTEMPTS: ['attempts'],
  ATTEMPT: (id: number) => ['attempt', id],
} as const;