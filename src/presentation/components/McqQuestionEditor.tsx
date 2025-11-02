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

const OptionsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

const OptionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const OptionInput = styled.input`
  flex: 1;
  padding: 0.5rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
    box-shadow: 0 0 0 2px ${({ theme }) => theme?.colors?.primary || '#007bff'}20;
  }
`;

const RadioInput = styled.input`
  width: 1rem;
  height: 1rem;
  accent-color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
`;

const RemoveButton = styled.button`
  width: 2rem;
  height: 2rem;
  border: 1px solid ${({ theme }) => theme?.colors?.error || '#dc3545'};
  background: white;
  color: ${({ theme }) => theme?.colors?.error || '#dc3545'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;
  
  &:hover {
    background: ${({ theme }) => theme?.colors?.error || '#dc3545'};
    color: white;
  }
`;

const AddOptionButton = styled.button`
  padding: 0.5rem 1rem;
  border: 1px solid ${({ theme }) => theme?.colors?.primary || '#007bff'};
  background: white;
  color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: 500;
  align-self: flex-start;
  
  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#007bff'};
    color: white;
  }
`;

const HelpText = styled.small`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
  font-size: 0.75rem;
`;

const Required = styled.span`
  color: ${({ theme }) => theme?.colors?.error || '#dc3545'};
`;

interface McqQuestionEditorProps {
  onQuestionChange?: (questionData: { prompt: string; options: string[]; correctAnswer: number }) => void;
}

export const McqQuestionEditor: React.FC<McqQuestionEditorProps> = ({ onQuestionChange }) => {
  // Local state for building the question
  const [prompt, setPrompt] = React.useState('');
  const [options, setOptions] = React.useState(['', '']);
  const [correctAnswer, setCorrectAnswer] = React.useState(0);

  // Notify parent component when question data changes
  React.useEffect(() => {
    if (onQuestionChange) {
      onQuestionChange({ prompt, options, correctAnswer });
    }
  }, [prompt, options, correctAnswer]); // Remove onQuestionChange from deps since it's now stable

  const handlePromptChange = (value: string) => {
    setPrompt(value);
  };

  const handleCorrectAnswerChange = (index: number) => {
    setCorrectAnswer(index);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      const newOptions = options.filter((_, i) => i !== index);
      setOptions(newOptions);
      // Adjust correct answer if needed
      if (correctAnswer >= newOptions.length) {
        setCorrectAnswer(0);
      }
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  return (
    <Container>
      <FormGroup>
        <Label htmlFor="mcq-prompt">
          Question Prompt <Required>*</Required>
        </Label>
        <TextArea
          id="mcq-prompt"
          value={prompt}
          onChange={(e) => handlePromptChange(e.target.value)}
          placeholder="Enter your multiple choice question..."
          required
        />
        <HelpText>
          Write a clear, specific question. Avoid ambiguous wording.
        </HelpText>
      </FormGroup>

      <FormGroup>
        <Label>
          Answer Options <Required>*</Required>
        </Label>
        <OptionsContainer>
          {options.map((option, index) => (
            <OptionRow key={index}>
              <RadioInput
                type="radio"
                name="correctAnswer"
                checked={correctAnswer === index}
                onChange={() => handleCorrectAnswerChange(index)}
                aria-label={`Mark option ${index + 1} as correct answer`}
              />
              <OptionInput
                type="text"
                value={option}
                onChange={(e) => handleOptionChange(index, e.target.value)}
                placeholder={`Option ${index + 1}`}
                required
              />
              {options.length > 2 && (
                <RemoveButton
                  type="button"
                  onClick={() => handleRemoveOption(index)}
                  aria-label={`Remove option ${index + 1}`}
                >
                  ×
                </RemoveButton>
              )}
            </OptionRow>
          ))}
        </OptionsContainer>
        
        <AddOptionButton
          type="button"
          onClick={handleAddOption}
        >
          + Add Option
        </AddOptionButton>
        
        <HelpText>
          Select the radio button next to the correct answer. You need at least 2 options.
        </HelpText>
      </FormGroup>
    </Container>
  );
};