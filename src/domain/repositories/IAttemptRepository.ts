import { 
  Attempt, 
  AttemptAnswer, 
  AttemptEvent, 
  StartAttemptDto, 
  SubmitAnswerDto 
} from '@domain/entities';

export interface IAttemptRepository {
  // Attempt operations
  getAttempts(): Promise<Attempt[]>;
  getAttemptById(id: number): Promise<Attempt>;
  startAttempt(dto: StartAttemptDto): Promise<Attempt>;
  submitAttempt(id: number): Promise<Attempt>;
  
  // Answer operations
  getAttemptAnswers(attemptId: number): Promise<AttemptAnswer[]>;
  submitAnswer(attemptId: number, answer: SubmitAnswerDto): Promise<void>;
  
  // Event operations
  getAttemptEvents(attemptId: number): Promise<AttemptEvent[]>;
  logEvent(attemptId: number, event: string): Promise<void>;
}