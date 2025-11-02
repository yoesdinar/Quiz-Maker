import { 
  Quiz, 
  Question, 
  CreateQuizDto, 
  UpdateQuizDto, 
  CreateQuestionDto, 
  UpdateQuestionDto 
} from '@domain/entities';

export interface IQuizRepository {
  // Quiz operations
  getQuizzes(): Promise<Quiz[]>;
  getQuizById(id: number): Promise<Quiz>;
  createQuiz(quiz: CreateQuizDto): Promise<Quiz>;
  updateQuiz(id: number, quiz: UpdateQuizDto): Promise<Quiz>;
  deleteQuiz(id: number): Promise<void>;
  publishQuiz(id: number): Promise<Quiz>;
  
  // Question operations
  getQuestions(quizId: number): Promise<Question[]>;
  getQuestionById(quizId: number, questionId: number): Promise<Question>;
  createQuestion(quizId: number, question: CreateQuestionDto): Promise<Question>;
  updateQuestion(quizId: number, questionId: number, question: UpdateQuestionDto): Promise<Question>;
  deleteQuestion(quizId: number, questionId: number): Promise<void>;
}