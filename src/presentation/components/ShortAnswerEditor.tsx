import React from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  font-size: 1rem;
  font-family: inherit;
  resize: vertical;
  min-height: 100px;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.primary || '#007bff'}20;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.primary || '#007bff'}20;
  }
`;

const HelpText = styled.small`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  font-size: 0.75rem;
  line-height: 1.4;
`;

const Required = styled.span`
  color: ${({ theme }) => theme?.colors?.error || '#dc3545'};
`;

interface ShortAnswerEditorProps {
  onQuestionChange?: (questionData: { prompt: string; correctAnswer: string }) => void;
}

export const ShortAnswerEditor: React.FC<ShortAnswerEditorProps> = ({ onQuestionChange }) => {
  // Local state for building the question
  const [prompt, setPrompt] = React.useState('');
  const [correctAnswer, setCorrectAnswer] = React.useState('');

  // Notify parent component when question data changes
  React.useEffect(() => {
    if (onQuestionChange) {
      onQuestionChange({ prompt, correctAnswer });
    }
  }, [prompt, correctAnswer]); // Remove onQuestionChange from deps since it's now stable

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleCorrectAnswerChange = (value: string) => {
    setCorrectAnswer(value);
  };

  return (
    <Container>
      <FormGroup>
        <Label htmlFor="short-prompt">
          Question Prompt <Required>*</Required>
        </Label>
        <TextArea
          id="short-answer-prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Enter your short answer question..."
          required
        />
        <HelpText>
          Write a clear question that can be answered with a short text response.
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label htmlFor="short-answer">
          Expected Answer <Required>*</Required>
        </Label>
        <Input
          id="short-answer"
          type="text"
          value={correctAnswer}
          onChange={(e) => handleCorrectAnswerChange(e.target.value)}
          placeholder="Enter the expected answer..."
          required
        />
        <HelpText>
          This will be used for automatic grading. The system will compare student answers to this expected answer (case-insensitive, trimmed whitespace).
        </HelpText>
      </FormGroup>

    
    </Container>
  );
};