import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { QuizTimer } from '../components';
import {
  startQuizAttempt,
  submitAnswer,
  completeQuizAttempt,
  goToNextQuestion,
  goToPreviousQuestion,
  goToQuestion,
  setAnswer,
  resetAttempt,
  selectCurrentQuiz,
  selectCurrentAttempt,
  selectCurrentQuestion,
  selectCurrentQuestionIndex,
  selectAnswers,
  selectAnswer,
  selectResult,
  selectPhase,
  selectIsLoading,
  selectIsCompleting,
  selectError,
  selectProgress,
  selectCanNavigateNext,
  selectCanNavigatePrevious,
  selectCanComplete,
  selectHasTimeLimit,
} from '../../store/slices/quizAttemptSlice';
import { Answer } from '../../shared/types/api';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  min-height: 100vh;
`;

const Header = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const QuizTitle = styled.h1`
  margin: 0 0 0.5rem 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.75rem;
  font-weight: 600;
`;

const QuizDescription = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 1rem;
  line-height: 1.5;
`;

const ProgressSection = styled.div`
  background: white;
  padding: 1rem 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
  margin-top: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProgressText = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ProgressBar = styled.div`
  flex: 1;
  height: 8px;
  background: ${({ theme }) => theme.colors.background};
  border-radius: 4px;
  margin: 0 1rem;
  overflow: hidden;
`;

const ProgressFill = styled.div<{ $percentage: number }>`
  height: 100%;
  width: ${({ $percentage }) => $percentage}%;
  background: ${({ theme }) => theme.colors.success};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

const QuestionCard = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const QuestionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const QuestionNumber = styled.span`
  background: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 500;
`;

const QuestionType = styled.span`
  background: ${({ theme }) => theme.colors.secondary};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  text-transform: uppercase;
  font-weight: 500;
`;

const QuestionPrompt = styled.h2`
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.text};
  font-size: 1.25rem;
  font-weight: 500;
  line-height: 1.4;
`;

const AnswerSection = styled.div`
  margin-bottom: 2rem;
`;

const OptionButton = styled.button<{ $selected: boolean }>`
  display: block;
  width: 100%;
  padding: 1rem 1.5rem;
  margin-bottom: 0.75rem;
  border: 2px solid ${({ $selected, theme }) => $selected ? theme.colors.primary : theme.colors.border};
  background: ${({ $selected, theme }) => $selected ? theme.colors.primaryLight : 'white'};
  border-radius: 8px;
  text-align: left;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.2s ease;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: ${({ $selected, theme }) => $selected ? theme.colors.primaryLight : theme.colors.backgroundLight};
  }

  &:last-child {
    margin-bottom: 0;
  }
`;

const TextInput = styled.textarea`
  width: 100%;
  min-height: 120px;
  padding: 1rem;
  border: 2px solid ${({ theme }) => theme.colors.border};
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const NavigationSection = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 2rem;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' | 'danger' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  ${({ $variant = 'secondary', theme }) => {
    switch ($variant) {
      case 'primary':
        return `
          background: ${theme.colors.primary};
          color: white;
          &:hover { background: ${theme.colors.primaryDark}; }
        `;
      case 'success':
        return `
          background: ${theme.colors.success};
          color: white;
          &:hover { background: ${theme.colors.successDark}; }
        `;
      case 'danger':
        return `
          background: ${theme.colors.error};
          color: white;
          &:hover { background: ${theme.colors.errorDark}; }
        `;
      default:
        return `
          background: ${theme.colors.secondary};
          color: white;
          &:hover { background: ${theme.colors.secondaryDark}; }
        `;
    }
  }}

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const QuestionNavigation = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: center;
`;

const QuestionNavButton = styled.button<{ $current: boolean; $answered: boolean }>`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  
  ${({ $current, $answered, theme }) => {
    if ($current) {
      return `
        background: ${theme.colors.primary};
        color: white;
      `;
    } else if ($answered) {
      return `
        background: ${theme.colors.success};
        color: white;
      `;
    } else {
      return `
        background: ${theme.colors.background};
        color: ${theme.colors.textSecondary};
        border: 1px solid ${theme.colors.border};
      `;
    }
  }}

  &:hover {
    transform: translateY(-2px);
  }
`;

const ResultSection = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const ResultTitle = styled.h2`
  margin: 0 0 1rem 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 2rem;
  font-weight: 600;
`;

const ScoreDisplay = styled.div`
  margin: 2rem 0;
  padding: 2rem;
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: 12px;
`;

const ScoreValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 0.5rem;
`;

const ScoreLabel = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const ResultDetails = styled.div`
  margin: 2rem 0;
  padding: 1.5rem;
  background: ${({ theme }) => theme.colors.backgroundLight};
  border-radius: 8px;
  text-align: left;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ErrorMessage = styled.div`
  background: ${({ theme }) => theme.colors.errorBg};
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  border-radius: 8px;
  margin: 1rem 0;
  text-align: center;
`;

export const TakeQuizPage: React.FC = () => {
  const params = useParams<{ quizId?: string; id?: string }>();
  const quizId = params.quizId || params.id; // Handle both route patterns
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // Redux state
  const currentQuiz = useAppSelector(selectCurrentQuiz);
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const currentQuestion = useAppSelector(selectCurrentQuestion);
  const currentQuestionIndex = useAppSelector(selectCurrentQuestionIndex);
  const answers = useAppSelector(selectAnswers);
  const result = useAppSelector(selectResult);
  const phase = useAppSelector(selectPhase);
  const isLoading = useAppSelector(selectIsLoading);
  const isCompleting = useAppSelector(selectIsCompleting);
  const error = useAppSelector(selectError);
  const progress = useAppSelector(selectProgress);
  const canNavigateNext = useAppSelector(selectCanNavigateNext);
  const canNavigatePrevious = useAppSelector(selectCanNavigatePrevious);
  const canComplete = useAppSelector(selectCanComplete);
  const hasTimeLimit = useAppSelector(selectHasTimeLimit);

  // Local state
  const [currentAnswer, setCurrentAnswer] = useState<string>('');

  // Get current question's answer
  const currentQuestionAnswer = useAppSelector(selectAnswer(currentQuestion?.id || 0));

  // Initialize quiz attempt
  useEffect(() => {
    if (quizId && !isNaN(Number(quizId))) {
      console.log('Starting quiz attempt for quizId:', quizId);
      dispatch(resetAttempt());
      dispatch(startQuizAttempt({ quizId: Number(quizId) }));
    } else {
      navigate('/');
    }
  }, [dispatch, navigate, quizId]);

  // Debug logging
  useEffect(() => {
    console.log('Quiz Attempt Debug:', {
      phase,
      isLoading,
      currentQuiz: currentQuiz ? { id: currentQuiz.id, title: currentQuiz.title, questionsCount: currentQuiz.questions?.length } : null,
      currentAttempt: currentAttempt ? { id: currentAttempt.id, quizId: currentAttempt.quizId } : null,
      currentQuestion: currentQuestion ? { id: currentQuestion.id, prompt: currentQuestion.prompt } : null,
      error
    });
  }, [phase, isLoading, currentQuiz, currentAttempt, currentQuestion, error]);

  // Update local answer when question changes
  useEffect(() => {
    if (currentQuestion) {
      const savedAnswer = currentQuestionAnswer;
      if (savedAnswer) {
        if (Array.isArray(savedAnswer.answer)) {
          setCurrentAnswer(savedAnswer.answer[0] || '');
        } else {
          setCurrentAnswer(savedAnswer.answer || '');
        }
      } else {
        setCurrentAnswer('');
      }
    }
  }, [currentQuestion, currentQuestionAnswer]);

  // Handle answer selection/input
  const handleAnswerChange = (answer: string) => {
    setCurrentAnswer(answer);
    
    // Add defensive checks for both objects and their properties
    if (currentQuestion && currentQuestion.id && currentAttempt && currentAttempt.id) {
      const answerObj: Answer = {
        questionId: currentQuestion.id,
        answer: currentQuestion.type === 'mcq' ? [answer] : answer,
      };
      
      dispatch(setAnswer({ questionId: currentQuestion.id, answer: answerObj }));
      
      // Auto-submit answer to backend
      dispatch(submitAnswer({
        attemptId: currentAttempt.id,
        questionId: currentQuestion.id,
        answerValue: answer,
      }));
    }
  };

  // Navigation handlers
  const handleNext = () => {
    if (canNavigateNext) {
      dispatch(goToNextQuestion());
    }
  };

  const handlePrevious = () => {
    if (canNavigatePrevious) {
      dispatch(goToPreviousQuestion());
    }
  };

  const handleGoToQuestion = (index: number) => {
    dispatch(goToQuestion(index));
  };

  // Complete quiz
  const handleCompleteQuiz = () => {
    if (currentAttempt && currentAttempt.id && canComplete) {
      dispatch(completeQuizAttempt({ attemptId: currentAttempt.id }));
    }
  };

  // Restart quiz
  const handleRestartQuiz = () => {
    if (quizId) {
      dispatch(resetAttempt());
      dispatch(startQuizAttempt({ quizId: Number(quizId) }));
    }
  };

  // Go back to home
  const handleGoHome = () => {
    navigate('/');
  };

  // Render loading state
  if (phase === 'loading' || isLoading) {
    return (
      <Container>
        <QuestionCard>
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <LoadingSpinner />
            <p style={{ marginTop: '1rem' }}>Loading quiz...</p>
          </div>
        </QuestionCard>
      </Container>
    );
  }

  // Render error state
  if (phase === 'error' || error) {
    return (
      <Container>
        <QuestionCard>
          <ErrorMessage>
            {error || 'Failed to load quiz'}
          </ErrorMessage>
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <Button onClick={handleGoHome}>
              Back to Home
            </Button>
          </div>
        </QuestionCard>
      </Container>
    );
  }

  // Render completed state
  if (phase === 'completed' && result) {
    return (
      <Container>
        <ResultSection>
          <ResultTitle>Quiz Completed! 🎉</ResultTitle>
          
          <ScoreDisplay>
            <ScoreValue>{result.summary.percentage}%</ScoreValue>
            <ScoreLabel>Final Score</ScoreLabel>
          </ScoreDisplay>
          
          <ResultDetails>
            <DetailRow>
              <span>Correct Answers:</span>
              <strong>{result.summary.correctAnswers} / {result.summary.totalQuestions}</strong>
            </DetailRow>
            <DetailRow>
              <span>Total Points:</span>
              <strong>{result.summary.score}</strong>
            </DetailRow>
            <DetailRow>
              <span>Quiz:</span>
              <strong>{result.quiz.title}</strong>
            </DetailRow>
          </ResultDetails>
          
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Button onClick={handleRestartQuiz}>
              Retake Quiz
            </Button>
            <Button $variant="primary" onClick={handleGoHome}>
              Back to Home
            </Button>
          </div>
        </ResultSection>
      </Container>
    );
  }

  // Render quiz taking interface
  if (phase === 'taking' && currentQuiz && currentQuestion) {
    return (
      <Container>
        <Header>
          <QuizTitle>{currentQuiz.title}</QuizTitle>
          <QuizDescription>{currentQuiz.description}</QuizDescription>
        </Header>

        {/* Timer - only show if quiz has time limit */}
        {hasTimeLimit && <QuizTimer />}

        <ProgressSection>
          <ProgressText>
            Question {currentQuestionIndex + 1} of {currentQuiz.questions?.length || 0}
          </ProgressText>
          <ProgressBar>
            <ProgressFill $percentage={progress.percentage} />
          </ProgressBar>
          <ProgressText>
            {progress.answered} answered
          </ProgressText>
        </ProgressSection>

        <QuestionCard>
          <QuestionHeader>
            <QuestionNumber>Question {currentQuestionIndex + 1}</QuestionNumber>
            <QuestionType>{currentQuestion.type.toUpperCase()}</QuestionType>
          </QuestionHeader>
          
          <QuestionPrompt>{currentQuestion.prompt}</QuestionPrompt>
          
          <AnswerSection>
            {currentQuestion.type === 'mcq' && currentQuestion.options ? (
              // Multiple choice options
              <div>
                {currentQuestion.options.map((option, index) => (
                  <OptionButton
                    key={index}
                    $selected={currentAnswer === option}
                    onClick={() => handleAnswerChange(option)}
                  >
                    {option}
                  </OptionButton>
                ))}
              </div>
            ) : (
              // Short answer input
              <TextInput
                value={currentAnswer}
                onChange={(e) => handleAnswerChange(e.target.value)}
                placeholder="Type your answer here..."
              />
            )}
          </AnswerSection>
        </QuestionCard>

        <NavigationSection>
          <NavigationButtons>
            <Button
              onClick={handlePrevious}
              disabled={!canNavigatePrevious}
            >
              ← Previous
            </Button>
            
            <div>
              {canNavigateNext ? (
                <Button
                  $variant="primary"
                  onClick={handleNext}
                >
                  Next →
                </Button>
              ) : (
                <Button
                  $variant="success"
                  onClick={handleCompleteQuiz}
                  disabled={!canComplete || isCompleting}
                >
                  {isCompleting && <LoadingSpinner />}
                  {isCompleting ? 'Submitting...' : 'Complete Quiz'}
                </Button>
              )}
            </div>
          </NavigationButtons>
          
          <QuestionNavigation>
            {currentQuiz.questions?.map((question, index) => (
              <QuestionNavButton
                key={index}
                $current={index === currentQuestionIndex}
                $answered={question?.id ? answers[question.id] !== undefined : false}
                onClick={() => handleGoToQuestion(index)}
              >
                {index + 1}
              </QuestionNavButton>
            ))}
          </QuestionNavigation>
        </NavigationSection>
      </Container>
    );
  }

  // Debug render - this should help us see what's happening
  return (
    <Container>
      <QuestionCard>
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Debug Information</h2>
          <p>Phase: {phase}</p>
          <p>Quiz ID: {quizId}</p>
          <p>Current Quiz: {currentQuiz ? 'Loaded' : 'Not loaded'}</p>
          <p>Current Question: {currentQuestion ? 'Available' : 'Not available'}</p>
          <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <Button onClick={handleGoHome}>
            Back to Home
          </Button>
        </div>
      </QuestionCard>
    </Container>
  );
};