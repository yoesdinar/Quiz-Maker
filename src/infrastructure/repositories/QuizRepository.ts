import { IQuizRepository } from '@domain/repositories';
import { 
  Quiz, 
  Question, 
  CreateQuizDto, 
  UpdateQuizDto, 
  CreateQuestionDto, 
  UpdateQuestionDto 
} from '@domain/entities';
import { axiosClient } from '@infrastructure/config';
import { API_ENDPOINTS } from '@shared/utils';

export class QuizRepository implements IQuizRepository {
  async getQuizzes(): Promise<Quiz[]> {
    return axiosClient.get<Quiz[]>(API_ENDPOINTS.QUIZZES);
  }

  async getQuizById(id: number): Promise<Quiz> {
    return axiosClient.get<Quiz>(API_ENDPOINTS.QUIZ_BY_ID(id));
  }

  async createQuiz(quiz: CreateQuizDto): Promise<Quiz> {
    return axiosClient.post<Quiz>(API_ENDPOINTS.QUIZZES, quiz);
  }

  async updateQuiz(id: number, quiz: UpdateQuizDto): Promise<Quiz> {
    return axiosClient.patch<Quiz>(API_ENDPOINTS.QUIZ_BY_ID(id), quiz);
  }

  async deleteQuiz(id: number): Promise<void> {
    return axiosClient.delete<void>(API_ENDPOINTS.QUIZ_BY_ID(id));
  }

  async publishQuiz(id: number): Promise<Quiz> {
    return axiosClient.patch<Quiz>(API_ENDPOINTS.QUIZ_BY_ID(id), { isPublished: true });
  }

  async getQuestions(quizId: number): Promise<Question[]> {
    return axiosClient.get<Question[]>(API_ENDPOINTS.QUESTIONS(quizId));
  }

  async getQuestionById(_quizId: number, questionId: number): Promise<Question> {
    return axiosClient.get<Question>(API_ENDPOINTS.QUESTION_BY_ID(questionId));
  }

  async createQuestion(quizId: number, question: CreateQuestionDto): Promise<Question> {
    return axiosClient.post<Question>(API_ENDPOINTS.QUESTIONS(quizId), question);
  }

  async updateQuestion(_quizId: number, questionId: number, question: UpdateQuestionDto): Promise<Question> {
    return axiosClient.patch<Question>(API_ENDPOINTS.QUESTION_BY_ID(questionId), question);
  }

  async deleteQuestion(_quizId: number, questionId: number): Promise<void> {
    return axiosClient.delete<void>(API_ENDPOINTS.QUESTION_BY_ID(questionId));
  }
}