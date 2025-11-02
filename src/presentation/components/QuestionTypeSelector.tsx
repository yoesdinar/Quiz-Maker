import React from 'react';
import styled from 'styled-components';
import { useQuestionTypeHelpers } from '../../store/hooks/useQuizBuilder';
import { QuestionType } from '../../shared/types';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const Header = styled.div`
  text-align: center;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
`;

const QuestionTypesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 1rem;
`;

const QuestionTypeCard = styled.button`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '0.5rem'};
  background: white;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
  
  &:hover {
    border-color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme?.shadows?.md || '0 4px 6px rgba(0, 0, 0, 0.1)'};
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const QuestionIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
`;

const QuestionLabel = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin-bottom: 0.5rem;
`;


interface QuestionTypeSelectorProps {
  onTypeSelect?: (type: QuestionType) => void;
}

export const QuestionTypeSelector: React.FC<QuestionTypeSelectorProps> = ({
  onTypeSelect
}) => {
  const { getQuestionTypeLabel, getQuestionTypeIcon } = useQuestionTypeHelpers();

  const questionTypes: Array<{
    type: QuestionType;
  }> = [
      {
        type: 'mcq',
      },
      {
        type: 'short',
      },
    ];

  const handleTypeSelect = (type: QuestionType) => {
    onTypeSelect?.(type);
  };

  return (
    <Container>
      <Header>
        <Title>Choose Question Type</Title>
        <Subtitle>
          Select the type of question you want to add to your quiz
        </Subtitle>
      </Header>

      <QuestionTypesGrid>
        {questionTypes.map(({ type }) => (
          <QuestionTypeCard
            key={type}
            onClick={() => handleTypeSelect(type)}
          >
            <QuestionIcon>{getQuestionTypeIcon(type)}</QuestionIcon>
            <QuestionLabel>{getQuestionTypeLabel(type)}</QuestionLabel>
          </QuestionTypeCard>
        ))}
      </QuestionTypesGrid>
    </Container>
  );
};