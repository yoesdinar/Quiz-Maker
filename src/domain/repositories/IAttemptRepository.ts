import { 
  QuizAttempt,
  AttemptResult,
  Quiz,
  CreateAttemptRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest
} from '../../shared/types/api';

export interface IAttemptRepository {
  // Attempt operations
  createAttempt(request: CreateAttemptRequest): Promise<{ attempt: QuizAttempt, quiz: Quiz }>;
  getAttempt(attemptId: number): Promise<QuizAttempt>;
  completeAttempt(request: CompleteAttemptRequest): Promise<AttemptResult>;
  getAttemptResult(attemptId: number): Promise<AttemptResult>;
  
  // Answer operations
  submitAnswer(request: SubmitAnswerRequest): Promise<void>;
  
  // Quiz operations for attempts
  getQuizForAttempt(quizId: number): Promise<Quiz>;
}