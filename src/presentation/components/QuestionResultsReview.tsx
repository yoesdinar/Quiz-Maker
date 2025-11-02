import React, { useState } from 'react';
import styled from 'styled-components';
import { AttemptResult, Answer } from '../../shared/types/api';

const ReviewContainer = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin: 2rem 0;
`;

const ReviewTitle = styled.h3`
  margin: 0 0 1.5rem 0;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.5rem;
  font-weight: 600;
`;

const ShowDetailsButton = styled.button`
  background: ${({ theme }) => theme.colors.secondary};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 1.5rem;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.secondaryDark};
  }
`;

const QuestionsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const QuestionItem = styled.div<{ $isCorrect: boolean }>`
  border: 2px solid ${({ $isCorrect, theme }) => $isCorrect ? theme.colors.success : theme.colors.error};
  border-radius: 8px;
  overflow: hidden;
  background: white;
`;

const QuestionHeader = styled.div<{ $isCorrect: boolean }>`
  background: ${({ $isCorrect, theme }) => $isCorrect ? theme.colors.backgroundLight : theme.colors.errorBg};
  padding: 1rem 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s ease;

  &:hover {
    background: ${({ $isCorrect, theme }) => $isCorrect ? theme.colors.success : theme.colors.error};
    color: white;
  }
`;

const QuestionTitle = styled.div`
  font-weight: 500;
  font-size: 1rem;
`;

const StatusIndicator = styled.div<{ $isCorrect: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  font-weight: 500;
  color: ${({ $isCorrect, theme }) => $isCorrect ? theme.colors.success : theme.colors.error};
`;

const QuestionDetails = styled.div`
  padding: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.backgroundLight};
`;

const QuestionPrompt = styled.div`
  margin-bottom: 1.5rem;
  font-size: 1rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.text};
`;

const AnswerSection = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1rem;
`;

const AnswerBlock = styled.div`
  background: white;
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const AnswerLabel = styled.div`
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 0.5rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const AnswerValue = styled.div`
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.text};
  min-height: 1.5rem;
  word-break: break-word;
`;

const YourAnswerValue = styled(AnswerValue)<{ $isCorrect: boolean }>`
  color: ${({ $isCorrect, theme }) => $isCorrect ? theme.colors.success : theme.colors.error};
  font-weight: 500;
`;

const CorrectAnswerValue = styled(AnswerValue)`
  color: ${({ theme }) => theme.colors.success};
  font-weight: 500;
`;

const ExpandIcon = styled.span<{ $expanded: boolean }>`
  transform: rotate(${({ $expanded }) => $expanded ? '180deg' : '0deg'});
  transition: transform 0.2s ease;
  font-size: 1.2rem;
`;

interface QuestionResultsReviewProps {
  result: AttemptResult;
  userAnswers: Record<number, Answer>;
}

interface QuestionDetail {
  questionId: number;
  correct: boolean;
  expected: string;
}

export const QuestionResultsReview: React.FC<QuestionResultsReviewProps> = ({
  result,
  userAnswers
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [expandedQuestions, setExpandedQuestions] = useState<Set<number>>(new Set());

  // Extract question details from the result
  // The result.answers contains the API response data
  const questionDetails: QuestionDetail[] = result.answers.map(answer => ({
    questionId: answer.questionId,
    correct: answer.isCorrect,
    expected: answer.answer // This comes from the API response as the expected answer
  }));

  const toggleQuestionExpansion = (questionId: number) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  const formatAnswer = (answer: string | string[] | undefined): string => {
    if (!answer) return 'No answer provided';
    if (Array.isArray(answer)) {
      return answer.length > 0 ? answer.join(', ') : 'No answer provided';
    }
    return answer || 'No answer provided';
  };

  const getUserAnswerForQuestion = (questionId: number): string => {
    const answer = userAnswers[questionId];
    if (!answer) return 'No answer provided';
    return formatAnswer(answer.answer);
  };

  if (!showDetails) {
    return (
      <ReviewContainer>
        <ReviewTitle>Question Details</ReviewTitle>
        <ShowDetailsButton onClick={() => setShowDetails(true)}>
          Show Per-Question Breakdown
        </ShowDetailsButton>
      </ReviewContainer>
    );
  }

  return (
    <ReviewContainer>
      <ReviewTitle>Question Details</ReviewTitle>
      <ShowDetailsButton onClick={() => setShowDetails(false)}>
        Hide Details
      </ShowDetailsButton>
      
      <QuestionsList>
        {questionDetails.map((detail) => {
          const question = result.quiz.questions?.find(q => q.id === detail.questionId);
          const isExpanded = expandedQuestions.has(detail.questionId);
          const userAnswer = getUserAnswerForQuestion(detail.questionId);

          return (
            <QuestionItem key={detail.questionId} $isCorrect={detail.correct}>
              <QuestionHeader
                $isCorrect={detail.correct}
                onClick={() => toggleQuestionExpansion(detail.questionId)}
              >
                <QuestionTitle>
                  Question {detail.questionId}
                  {question && `: ${question.prompt.substring(0, 60)}${question.prompt.length > 60 ? '...' : ''}`}
                </QuestionTitle>
                <StatusIndicator $isCorrect={detail.correct}>
                  {detail.correct ? '✓ Correct' : '✗ Incorrect'}
                  <ExpandIcon $expanded={isExpanded}>▼</ExpandIcon>
                </StatusIndicator>
              </QuestionHeader>
              
              {isExpanded && (
                <QuestionDetails>
                  {question && (
                    <QuestionPrompt>
                      <strong>Question:</strong> {question.prompt}
                    </QuestionPrompt>
                  )}
                  
                  <AnswerSection>
                    <AnswerBlock>
                      <AnswerLabel>Your Answer</AnswerLabel>
                      <YourAnswerValue $isCorrect={detail.correct}>
                        {userAnswer}
                      </YourAnswerValue>
                    </AnswerBlock>
                    
                    <AnswerBlock>
                      <AnswerLabel>Correct Answer</AnswerLabel>
                      <CorrectAnswerValue>
                        {detail.expected || 'Not available'}
                      </CorrectAnswerValue>
                    </AnswerBlock>
                  </AnswerSection>
                </QuestionDetails>
              )}
            </QuestionItem>
          );
        })}
      </QuestionsList>
    </ReviewContainer>
  );
};