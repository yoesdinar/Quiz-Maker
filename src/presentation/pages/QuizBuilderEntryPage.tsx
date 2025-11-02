import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.primary || '#2563eb'};
  margin-bottom: 1rem;
`;

const MainActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  margin-bottom: 3rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ActionCard = styled.div`
  padding: 2rem;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: 12px;
  background: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border-color: ${({ theme }) => theme?.colors?.primary || '#2563eb'};
  }
`;

const ActionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const ActionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin-bottom: 0.75rem;
`;

const ActionDescription = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  line-height: 1.5;
  margin-bottom: 1.5rem;
`;

const ActionButton = styled.button`
  background: ${({ theme }) => theme?.colors?.primary || '#2563eb'};
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  width: 100%;
  
  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#1d4ed8'};
    opacity: 0.9;
  }
`;

const QuizIdInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#2563eb'};
  }
`;

export const QuizBuilderEntryPage: React.FC = () => {
  const navigate = useNavigate();
  const [quizId, setQuizId] = React.useState('');

  const handleStartBuilding = () => {
    navigate('/quiz-builder/details');
  };

  const handleTakeQuiz = () => {
    if (quizId && !isNaN(Number(quizId))) {
      navigate(`/take-quiz/${quizId}`);
    }
  };

  return (
    <Container>
      <Title>Quiz Platform</Title>

      <MainActions>
        <ActionCard onClick={handleStartBuilding}>
          <ActionIcon>🎯</ActionIcon>
          <ActionTitle>Create Quiz</ActionTitle>
          <ActionDescription>
            Build a new quiz with multiple choice and short answer questions. 
            Perfect for educators, trainers, and anyone who wants to create engaging assessments.
          </ActionDescription>
          <ActionButton onClick={handleStartBuilding}>
            Start Building
          </ActionButton>
        </ActionCard>

        <ActionCard>
          <ActionIcon>🚀</ActionIcon>
          <ActionTitle>Take Quiz</ActionTitle>
          <ActionDescription>
            Enter a quiz ID to take an existing quiz. Answer questions, navigate between them, 
            and see your results with detailed feedback.
          </ActionDescription>
          <QuizIdInput
            type="text"
            placeholder="Enter Quiz ID (e.g. 123)"
            value={quizId}
            onChange={(e) => setQuizId(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleTakeQuiz()}
          />
          <ActionButton 
            onClick={handleTakeQuiz}
            disabled={!quizId || isNaN(Number(quizId))}
            style={{ 
              opacity: (!quizId || isNaN(Number(quizId))) ? 0.6 : 1,
              cursor: (!quizId || isNaN(Number(quizId))) ? 'not-allowed' : 'pointer'
            }}
          >
            Take Quiz
          </ActionButton>
        </ActionCard>
      </MainActions>

    </Container>
  );
};