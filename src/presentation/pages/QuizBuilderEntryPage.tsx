import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  max-width: 600px;
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



const Features = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 3rem;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  padding: 1.5rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: 8px;
  background: white;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FeatureIcon = styled.div`
  font-size: 2rem;
  margin-bottom: 0.5rem;
`;

const FeatureTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin-bottom: 0.5rem;
`;

const FeatureDescription = styled.p`
  font-size: 0.875rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  line-height: 1.5;
`;

const StartButton = styled.button`
  background: ${({ theme }) => theme?.colors?.primary || '#2563eb'};
  color: white;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.125rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#1d4ed8'};
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(37, 99, 235, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const QuizBuilderEntryPage: React.FC = () => {
  const navigate = useNavigate();

  const handleStartBuilding = () => {
    navigate('/quiz-builder/details');
  };

  return (
    <Container>
      <Title>Create a New Quiz</Title>

      <Features>
        <FeatureCard>
          <FeatureIcon>☑️</FeatureIcon>
          <FeatureTitle>Multiple Choice</FeatureTitle>
          <FeatureDescription>
            Create questions with multiple options
          </FeatureDescription>
        </FeatureCard>

        <FeatureCard>
          <FeatureIcon>✏️</FeatureIcon>
          <FeatureTitle>Short Answer</FeatureTitle>
          <FeatureDescription>
            Text-based questions with expected answer matching
          </FeatureDescription>
        </FeatureCard>
      </Features>

      <StartButton onClick={handleStartBuilding}>
        Start Building Your Quiz
      </StartButton>
    </Container>
  );
};