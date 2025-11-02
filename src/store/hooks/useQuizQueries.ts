import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { AttemptRepository } from '../../infrastructure/repositories/AttemptRepository';
import {
  CreateAttemptRequest,
  SubmitAnswerRequest,
  CompleteAttemptRequest,
  RecordEventRequest,
  Quiz,
} from '../../shared/types/api';

const attemptRepository = new AttemptRepository();

// Query Keys
export const attemptKeys = {
  all: ['attempts'] as const,
  attempt: (id: number) => [...attemptKeys.all, id] as const,
  quiz: (id: number) => ['quiz', id] as const,
};

// Start Quiz Attempt
export const useStartQuizAttempt = () => {
  return useMutation({
    mutationFn: (request: CreateAttemptRequest) => attemptRepository.createAttempt(request),
    onSuccess: (data) => {
      // You can add side effects here if needed
      console.log('Quiz attempt started:', data);
    },
    onError: (error) => {
      console.error('Failed to start quiz attempt:', error);
    },
  });
};

// Submit Answer
export const useSubmitAnswer = () => {
  return useMutation({
    mutationFn: (request: SubmitAnswerRequest) => attemptRepository.submitAnswer(request),
    onError: (error) => {
      console.error('Failed to submit answer:', error);
    },
  });
};

// Complete Quiz Attempt
export const useCompleteQuizAttempt = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (request: CompleteAttemptRequest & { currentQuiz?: Quiz | null }) => {
      const result = await attemptRepository.completeAttempt(request);
      
      // Enhance the result with current quiz data for better display
      if (request.currentQuiz) {
        result.quiz = {
          ...result.quiz,
          id: request.currentQuiz.id,
          title: request.currentQuiz.title,
          description: request.currentQuiz.description,
          questions: request.currentQuiz.questions || []
        };
      }
      
      return result;
    },
    onSuccess: (data) => {
      console.log('Quiz attempt completed:', data);
      // Invalidate related queries if needed
      queryClient.invalidateQueries({ queryKey: attemptKeys.attempt(data.attempt.id) });
    },
    onError: (error) => {
      console.error('Failed to complete quiz attempt:', error);
    },
  });
};

// Load Quiz for Taking
export const useQuizForTaking = (quizId: number, enabled: boolean = true) => {
  return useQuery({
    queryKey: attemptKeys.quiz(quizId),
    queryFn: () => attemptRepository.getQuizForAttempt(quizId),
    enabled: enabled && !isNaN(quizId),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: (failureCount, error: any) => {
      // Don't retry on 404s
      if (error?.status === 404) return false;
      return failureCount < 3;
    },
  });
};

// Record Anti-Cheat Event
export const useRecordAntiCheatEvent = () => {
  return useMutation({
    mutationFn: (request: RecordEventRequest) => attemptRepository.recordEvent(request),
    onError: (error) => {
      // Don't throw on anti-cheat recording errors, just log
      console.warn('Failed to record anti-cheat event:', error);
    },
  });
};