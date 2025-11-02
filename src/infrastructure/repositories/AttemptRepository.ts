import { IAttemptRepository } from '../../domain/repositories';
import { 
  QuizAttempt,
  AttemptResult,
  Quiz,
  CreateAttemptRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest
} from '../../shared/types/api';
import { axiosClient } from '../config/axiosClient';

export interface AttemptWithQuiz {
  attempt: QuizAttempt;
  quiz: Quiz;
}

export class AttemptRepository implements IAttemptRepository {
  async createAttempt(request: CreateAttemptRequest): Promise<AttemptWithQuiz> {
    try {
      // Backend expects POST /attempts with {quizId: string}
      const data: any = await axiosClient.post('/attempts', { 
        quizId: String(request.quizId) 
      });
      
      console.log('API Response data:', data);
      
      // Validate response structure
      if (!data) {
        throw new Error('No data received from API');
      }
      if (!data.id) {
        throw new Error('No attempt ID in response');
      }
      if (!data.quiz) {
        throw new Error('No quiz data in response');
      }
      if (!data.quiz.questions || !Array.isArray(data.quiz.questions)) {
        throw new Error('No questions array in quiz data');
      }
    
      const attempt: QuizAttempt = {
        id: data.id,
        quizId: Number(data.quizId), // Convert string to number
        score: 0,
        totalQuestions: data.quiz.questions.length,
        status: 'in-progress',
        timeStarted: data.startedAt,
        createdAt: data.startedAt,
      };

      const quiz: Quiz = {
        id: data.quiz.id,
        title: data.quiz.title || 'Untitled Quiz',
        description: data.quiz.description || '',
        timeLimitSeconds: data.quiz.timeLimitSeconds,
        totalQuestions: data.quiz.questions.length,
        createdAt: new Date().toISOString(),
        questions: data.quiz.questions.map((q: any, index: number) => {
          if (!q || !q.id) {
            throw new Error(`Question at index ${index} missing ID`);
          }
          return {
            id: q.id,
            quizId: Number(q.quizId || data.quiz.id), // Ensure quizId is a number
            type: q.type === 'code' ? 'short' : q.type, // Convert 'code' to 'short' since we removed code support
            prompt: q.prompt || '',
            options: q.options ? (Array.isArray(q.options) ? q.options : JSON.parse(q.options)) : undefined, // Handle options properly
            correctAnswer: q.correctAnswer,
            points: 1, // Default points
            createdAt: new Date().toISOString(),
          };
        }),
      };    return { attempt, quiz };
    } catch (error) {
      console.error('Error in createAttempt:', error);
      throw error;
    }
  }

  async getAttempt(_attemptId: number): Promise<QuizAttempt> {
    // Backend doesn't have a get attempt endpoint, so we'll return a placeholder
    throw new Error('Get attempt not implemented');
  }

  async submitAnswer(request: SubmitAnswerRequest): Promise<void> {
    // Backend expects POST /attempts/:id/answer with { questionId: string, value: string }
    await axiosClient.post(`/attempts/${request.attemptId}/answer`, {
      questionId: request.questionId.toString(),
      value: request.answerValue
    });
  }

  async completeAttempt(request: CompleteAttemptRequest): Promise<AttemptResult> {
    // Backend expects POST /attempts/:id/submit
    const data: any = await axiosClient.post(`/attempts/${request.attemptId}/submit`);
    
    // Convert backend response to our AttemptResult format
    return {
      attempt: {
        id: request.attemptId,
        quizId: 0, // We don't have this from the submit response
        score: data.score,
        totalQuestions: data.details.length,
        status: 'completed',
        timeStarted: '',
        timeCompleted: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      },
      answers: data.details.map((detail: any, index: number) => ({
        id: index,
        attemptId: request.attemptId,
        questionId: detail.questionId,
        answer: detail.expected || '',
        isCorrect: detail.correct,
        createdAt: new Date().toISOString(),
      })),
      quiz: {
        id: 0,
        title: 'Quiz',
        description: '',
        totalQuestions: data.details.length,
        questions: [],
      },
      summary: {
        totalQuestions: data.details.length,
        correctAnswers: data.details.filter((d: any) => d.correct).length,
        score: data.score,
        percentage: Math.round((data.score / data.details.length) * 100),
      },
    };
  }

  async getQuizForAttempt(quizId: number): Promise<Quiz> {
    const data: any = await axiosClient.get(`/quizzes/${quizId}`);
    return {
      id: data.id,
      title: data.title,
      description: data.description,
      isPublished: data.isPublished,
      totalQuestions: data.questions?.length || 0,
      createdAt: data.createdAt,
      questions: data.questions?.map((q: any) => ({
        id: q.id,
        quizId: q.quizId,
        type: q.type,
        prompt: q.prompt,
        options: q.options,
        correctAnswer: q.correctAnswer,
        points: 1, // Default points
        createdAt: new Date().toISOString(),
      })) || [],
    };
  }

  async getAttemptResult(_attemptId: number): Promise<AttemptResult> {
    throw new Error('Get attempt result not implemented');
  }
}