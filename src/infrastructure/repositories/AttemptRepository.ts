import { IAttemptRepository } from '@domain/repositories';
import { 
  Attempt, 
  AttemptAnswer, 
  AttemptEvent, 
  StartAttemptDto, 
  SubmitAnswerDto,
  SubmitAttemptResponse
} from '@domain/entities';
import { axiosClient } from '@infrastructure/config';
import { API_ENDPOINTS } from '@shared/utils';

export class AttemptRepository implements IAttemptRepository {
  async getAttempts(): Promise<Attempt[]> {
    return axiosClient.get<Attempt[]>(API_ENDPOINTS.ATTEMPTS);
  }

  async getAttemptById(id: number): Promise<Attempt> {
    return axiosClient.get<Attempt>(API_ENDPOINTS.ATTEMPT_BY_ID(id));
  }

  async startAttempt(dto: StartAttemptDto): Promise<Attempt> {
    return axiosClient.post<Attempt>(API_ENDPOINTS.ATTEMPTS, dto);
  }

  async submitAttempt(id: number): Promise<SubmitAttemptResponse> {
    return axiosClient.post<SubmitAttemptResponse>(API_ENDPOINTS.ATTEMPT_SUBMIT(id));
  }

  async getAttemptAnswers(attemptId: number): Promise<AttemptAnswer[]> {
    return axiosClient.get<AttemptAnswer[]>(API_ENDPOINTS.ATTEMPT_BY_ID(attemptId) + '/answers');
  }

  async submitAnswer(attemptId: number, answer: SubmitAnswerDto): Promise<void> {
    return axiosClient.post<void>(API_ENDPOINTS.ATTEMPT_ANSWER(attemptId), answer);
  }

  async getAttemptEvents(attemptId: number): Promise<AttemptEvent[]> {
    return axiosClient.get<AttemptEvent[]>(API_ENDPOINTS.ATTEMPT_EVENTS(attemptId));
  }

  async logEvent(attemptId: number, event: string): Promise<void> {
    return axiosClient.post<void>(API_ENDPOINTS.ATTEMPT_EVENTS(attemptId), { event });
  }
}