import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../../store/hooks';
import { useQuizBuilder } from '../../store/hooks/useQuizBuilder';
import { CreateQuestionDto } from '../../domain/entities/Quiz';
import { QuestionTypeSelector } from '../components/QuestionTypeSelector';
import { McqQuestionEditor } from '../components/McqQuestionEditor';
import { ShortAnswerEditor } from '../components/ShortAnswerEditor';
import { QuestionBuilder } from '../../store/slices/quizBuilderSlice';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin: 0 0 0.5rem 0;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  font-size: 1rem;
  margin: 0;
`;

const QuizInfo = styled.div`
  background: ${({ theme }) => theme?.colors?.surface || '#f8f9fa'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '0.375rem'};
  padding: 1rem;
  margin-bottom: 2rem;
`;

const QuizTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin: 0 0 0.25rem 0;
`;

const QuizDescription = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  font-size: 0.875rem;
  margin: 0;
`;

const ProgressSection = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '0.5rem'};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const ProgressTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin: 0;
`;

const QuestionCounter = styled.span`
  background: ${({ theme }) => theme?.colors?.primary || '#007bff'};
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 600;
`;

const QuestionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const QuestionItem = styled.div<{ $isActive?: boolean }>`
  display: flex;
  justify-content: between;
  align-items: center;
  padding: 0.75rem;
  border: 1px solid ${({ $isActive, theme }) => 
    $isActive ? theme?.colors?.primary || '#007bff' : theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  background: ${({ $isActive, theme }) => 
    $isActive ? (theme?.colors?.primary || '#007bff') + '10' : 'white'};
`;

const QuestionInfo = styled.div`
  flex: 1;
`;

const QuestionTitle = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  font-size: 0.875rem;
`;

const QuestionType = styled.div`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  font-size: 0.75rem;
  margin-top: 0.25rem;
`;

const QuestionActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const ActionButton = styled.button`
  padding: 0.25rem 0.5rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  background: white;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme?.colors?.surface || '#f8f9fa'};
  }
`;

const EditorSection = styled.div`
  background: white;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '0.5rem'};
  padding: 1.5rem;
  margin-bottom: 2rem;
`;

const EditorHeader = styled.div`
  margin-bottom: 1.5rem;
`;

const EditorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin: 0 0 0.5rem 0;
`;

const EditorSubtitle = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  font-size: 0.875rem;
  margin: 0;
`;

const ActionBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  margin-top: 2rem;
  background: ${({ theme }) => theme?.colors?.surface || '#f8f9fa'};
  border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: 0 0 ${({ theme }) => theme?.borderRadius?.lg || '0.5rem'} ${({ theme }) => theme?.borderRadius?.lg || '0.5rem'};
`;

const ActionGroup = styled.div`
  display: flex;
  gap: 1rem;
`;

const Button = styled.button<{ $variant?: 'primary' | 'secondary' | 'success' }>`
  padding: 0.75rem 1.5rem;
  margin-right: 0.5rem;
  border: 1px solid ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary': return theme?.colors?.primary || '#007bff';
      case 'success': return '#28a745';
      default: return theme?.colors?.border || '#e2e8f0';
    }
  }};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  background: ${({ $variant, theme }) => {
    switch ($variant) {
      case 'primary': return theme?.colors?.primary || '#007bff';
      case 'success': return '#28a745';
      default: return 'white';
    }
  }};
  color: ${({ $variant, theme }) => 
    $variant === 'primary' || $variant === 'success' ? 'white' : theme?.colors?.text || '#1e293b'};
  font-size: 0.875rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const FinishInfo = styled.div`
  font-size: 0.75rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  font-style: italic;
`;

const ErrorMessage = styled.div`
  background: #fee;
  border: 1px solid #fcc;
  color: #c33;
  padding: 1rem;
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const SuccessMessage = styled.div`
  background: #efe;
  border: 1px solid #cfc;
  color: #363;
  padding: 1rem;
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  margin-bottom: 1rem;
  font-size: 0.875rem;
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border: 2px solid #f3f3f3;
  border-top: 2px solid #333;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

export const QuestionBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  // Use direct selectors to avoid naming conflicts
  const quizBuilderState = useAppSelector(state => state.quizBuilder);
  const { questions: questionActions, quizForm, utils } = useQuizBuilder();
  
  // Local state for question type selection and question data
  const [selectedQuestionType, setSelectedQuestionType] = useState<'mcq' | 'short' | null>(null);
  const [questionData, setQuestionData] = useState<any>(null);
  
  // Local state for finish quiz process
  const [isFinishing, setIsFinishing] = useState(false);
  const [finishError, setFinishError] = useState<string | null>(null);
  const [finishSuccess, setFinishSuccess] = useState<string | null>(null);
  
  // Now we can access the state properly
  const questionsArray = quizBuilderState.questions;
  const canFinishQuiz = quizBuilderState.canFinishQuiz;
  const createdQuiz = quizBuilderState.createdQuiz;

  const handleQuestionTypeSelect = (type: 'mcq' | 'short') => {
    setSelectedQuestionType(type);
    setQuestionData(null); // Reset question data when type changes
    // Clear any previous finish errors when user starts interacting again
    setFinishError(null);
    setFinishSuccess(null);
  };

  const handleQuestionChange = useCallback((data: any) => {
    setQuestionData(data);
  }, []);

  const handleAddQuestion = () => {
    if (selectedQuestionType && questionData) {
      // Add the question to Redux with the local question data
      questionActions.addQuestion(selectedQuestionType);
      
      // Update the current question with the local data
      if (selectedQuestionType === 'mcq') {
        questionActions.updateCurrentQuestion({
          prompt: questionData.prompt,
          options: questionData.options,
          correctAnswer: questionData.correctAnswer
        });
      } else if (selectedQuestionType === 'short') {
        questionActions.updateCurrentQuestion({
          prompt: questionData.prompt,
          correctAnswer: questionData.correctAnswer
        });
      }
      
      // Reset selection after adding
      setSelectedQuestionType(null);
      setQuestionData(null);
    }
  };

  const handleRemoveQuestion = (index: number) => {
    if (window.confirm('Are you sure you want to remove this question?')) {
      const questionToRemove = questionsArray[index];
      if (questionToRemove?.id) {
        questionActions.removeQuestion(questionToRemove.id);
      }
    }
  };

  const handleBuildNewQuiz = () => {
    // Reset the entire quiz builder state
    utils.reset();
    // Navigate to the entry page to start fresh
    navigate('/quiz-builder');
  };

  const handleGoToQuizList = () => {
    // Reset state and go to home/quiz list
    utils.reset();
    navigate('/');
  };

  const handleFinishQuiz = async () => {
    setIsFinishing(true);
    setFinishError(null);
    setFinishSuccess(null);

    try {
      // Step 1: Create the quiz if it doesn't exist yet
      let quizId: number;
      
      if (!quizBuilderState.createdQuiz) {
        setFinishSuccess('Creating quiz...');
        
        const quizResult = await quizForm.createQuiz({
          title: quizBuilderState.quizForm.title,
          description: quizBuilderState.quizForm.description,
          timeLimitSeconds: quizBuilderState.quizForm.timeLimitSeconds,
        });
        
        if (quizResult.meta.requestStatus === 'rejected') {
          throw new Error(quizResult.payload as string || 'Failed to create quiz');
        }
        
        quizId = (quizResult.payload as any).id;
        setFinishSuccess('Quiz created successfully! Creating questions...');
      } else {
        quizId = quizBuilderState.createdQuiz.id;
        setFinishSuccess('Saving questions...');
      }

      // Step 2: Save all questions
      const validQuestions = quizBuilderState.questions.filter(q => 
        q.prompt && 
        (q.type !== 'mcq' || (q.options && q.options.length >= 2)) &&
        (q.type !== 'short' || q.correctAnswer)
      );

      if (validQuestions.length === 0) {
        throw new Error('Please add at least one valid question before finishing the quiz');
      }

      let savedCount = 0;
      for (const question of validQuestions) {
        try {
          const questionData: CreateQuestionDto = {
            type: question.type,
            prompt: question.prompt,
            options: question.options || [],
            correctAnswer: question.correctAnswer,
            position: question.position,
          };

          const result = await questionActions.saveQuestion(quizId, questionData);
          
          if (result.meta.requestStatus === 'rejected') {
            console.warn(`Failed to save question ${question.position + 1}:`, result.payload);
            // Continue with other questions instead of failing completely
          } else {
            savedCount++;
            setFinishSuccess(`Saved ${savedCount}/${validQuestions.length} questions...`);
          }
        } catch (questionError) {
          console.warn(`Error saving question ${question.position + 1}:`, questionError);
          // Continue with other questions
        }
      }

      if (savedCount === 0) {
        throw new Error('Failed to save any questions. Please try again.');
      }

      // Step 3: Publish/finish the quiz
      setFinishSuccess('Publishing quiz...');
      
      const finishResult = await utils.finishQuiz(quizId);
      
      if (finishResult.meta.requestStatus === 'rejected') {
        throw new Error(finishResult.payload as string || 'Failed to publish quiz');
      }

      // Step 4: Success!
      setFinishSuccess(`🎉 Quiz published successfully! Quiz ID: ${quizId} | Saved ${savedCount}/${validQuestions.length} questions.`);
      
      // Don't auto-navigate, let user see the success and decide what to do next

    } catch (error: any) {
      console.error('Failed to finish quiz:', error);
      setFinishError(error.message || 'An unexpected error occurred while finishing the quiz');
    } finally {
      setIsFinishing(false);
    }
  };

  const renderQuestionEditor = () => {
    // Only show editor based on selected question type
    if (selectedQuestionType) {
      switch (selectedQuestionType) {
        case 'mcq':
          return <McqQuestionEditor onQuestionChange={handleQuestionChange} />;
        case 'short':
          return <ShortAnswerEditor onQuestionChange={handleQuestionChange} />;
        default:
          return null;
      }
    }

    return null;
  };

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'mcq': return 'Multiple Choice';
      case 'short': return 'Short Answer';
      default: return type;
    }
  };

  return (
    <Container>
      <Header>
        <Title>Quiz Builder</Title>
        <Subtitle>Build your quiz by adding questions one by one</Subtitle>
      </Header>

      {finishError && (
        <ErrorMessage>
          <strong>Error:</strong> {finishError}
        </ErrorMessage>
      )}

      {finishSuccess && (
        <SuccessMessage>
          {finishSuccess}
        </SuccessMessage>
      )}

      {(createdQuiz || quizBuilderState.quizForm.title) && (
        <QuizInfo>
          <QuizTitle>
            {createdQuiz?.title || quizBuilderState.quizForm.title}
            {createdQuiz && <span style={{ fontSize: '0.875rem', fontWeight: 'normal', marginLeft: '1rem' }}>
              (Quiz ID: {createdQuiz.id})
            </span>}
          </QuizTitle>
          <QuizDescription>
            {createdQuiz?.description || quizBuilderState.quizForm.description}
          </QuizDescription>
        </QuizInfo>
      )}

      {!(finishSuccess && finishSuccess.includes('🎉')) && (
        <>
          <ProgressSection>
            <ProgressHeader>
              <ProgressTitle>Questions</ProgressTitle>
              <QuestionCounter>
                {questionsArray.length} question{questionsArray.length !== 1 ? 's' : ''}
              </QuestionCounter>
            </ProgressHeader>

            {questionsArray.length > 0 && (
              <QuestionList>
                {questionsArray.map((question: QuestionBuilder, index: number) => (
                  <QuestionItem key={index}>
                    <QuestionInfo>
                      <QuestionTitle>
                        Question {index + 1}: {question.prompt || 'Untitled Question'}
                      </QuestionTitle>
                      <QuestionType>{getQuestionTypeLabel(question.type)}</QuestionType>
                    </QuestionInfo>
                    <QuestionActions>
                      <ActionButton onClick={() => handleRemoveQuestion(index)}>
                        Remove
                      </ActionButton>
                    </QuestionActions>
                  </QuestionItem>
                ))}
              </QuestionList>
            )}
          </ProgressSection>

          <EditorSection>
            <EditorHeader>
              <EditorTitle>
                {selectedQuestionType 
                  ? `Add ${getQuestionTypeLabel(selectedQuestionType)} Question`
                  : 'Add New Question'}
              </EditorTitle>
              <EditorSubtitle>
                {selectedQuestionType
                  ? 'Fill in the question details below'
                  : 'Start by selecting a question type'}
              </EditorSubtitle>
            </EditorHeader>

            <QuestionTypeSelector onTypeSelect={handleQuestionTypeSelect} />
            {renderQuestionEditor()}

            <ActionBar>
              <ActionGroup>
                <Button 
                  onClick={() => navigate('/quiz-builder/details')}
                  disabled={isFinishing}
                >
                  Back to Details
                </Button>
                {selectedQuestionType && (
                  <Button 
                    $variant="primary" 
                    onClick={handleAddQuestion}
                    disabled={!questionData || isFinishing}
                  >
                    Add {getQuestionTypeLabel(selectedQuestionType)} Question
                  </Button>
                )}
              </ActionGroup>

              <ActionGroup>
                <Button 
                  $variant="success" 
                  onClick={handleFinishQuiz}
                  disabled={!canFinishQuiz || isFinishing}
                >
                  {isFinishing && <LoadingSpinner />}
                  {isFinishing ? 'Publishing Quiz...' : 'Finish Building Quiz'}
                </Button>
                {!canFinishQuiz && !isFinishing && (
                  <FinishInfo>
                    Need at least 2 question types to finish building quiz
                  </FinishInfo>
                )}
              </ActionGroup>
            </ActionBar>
          </EditorSection>
        </>
      )}

      {/* Show completion section when quiz is finished */}
      {(finishSuccess && finishSuccess.includes('🎉')) && (
        <EditorSection>
          <EditorHeader>
            <EditorTitle>🎉 Quiz Published Successfully!</EditorTitle>
            <EditorSubtitle>
              Your quiz has been created and is now available. What would you like to do next?
            </EditorSubtitle>
          </EditorHeader>
          
          <ActionBar>
            <ActionGroup>
              <Button onClick={handleGoToQuizList}>
                Back To Home
              </Button>
            </ActionGroup>
            <ActionGroup>
              <Button $variant="primary" onClick={handleBuildNewQuiz}>
                Build Another Quiz
              </Button>
            </ActionGroup>
          </ActionBar>
        </EditorSection>
      )}
    </Container>
  );
};