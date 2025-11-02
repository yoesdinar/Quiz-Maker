import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { useQuizBuilder } from '../../store/hooks/useQuizBuilder';

const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin-bottom: 0.5rem;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
`;

const Form = styled.form`
  background: white;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '0.5rem'};
  padding: 2rem;
  box-shadow: ${({ theme }) => theme?.shadows?.sm || '0 1px 2px rgba(0, 0, 0, 0.05)'};
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme?.colors?.text || '#1e293b'};
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  font-size: 1rem;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.primary || '#007bff'}20;
  }

  &:invalid {
    border-color: ${({ theme }) => theme?.colors?.error || '#dc3545'};
  }
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
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: ${({ theme }) => theme?.colors?.primary || '#007bff'};
    box-shadow: 0 0 0 3px ${({ theme }) => theme?.colors?.primary || '#007bff'}20;
  }

  &:invalid {
    border-color: ${({ theme }) => theme?.colors?.error || '#dc3545'};
  }
`;

const HelpText = styled.small`
  display: block;
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: ${({ theme }) => theme?.colors?.textSecondary || '#64748b'};
`;

const Required = styled.span`
  color: ${({ theme }) => theme?.colors?.error || '#dc3545'};
`;

const Actions = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme?.colors?.border || '#e2e8f0'};
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 600;
  border: none;
  border-radius: ${({ theme }) => theme?.borderRadius?.sm || '0.25rem'};
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;

  ${({ variant = 'primary', theme }) =>
    variant === 'primary'
      ? `
        background: ${theme?.colors?.primary || '#007bff'};
        color: white;
        
        &:hover:not(:disabled) {
          opacity: 0.9;
          transform: translateY(-1px);
        }
      `
      : `
        background: ${theme?.colors?.surface || '#f8f9fa'};
        color: ${theme?.colors?.text || '#1e293b'};
        border: 1px solid ${theme?.colors?.border || '#e2e8f0'};
        
        &:hover:not(:disabled) {
          background: ${theme?.colors?.border || '#e2e8f0'};
        }
      `}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
`;



export const QuizDetailsFormPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    canProceedToQuestions,
    quizForm: quizFormActions,
  } = useQuizBuilder();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    timeLimitSeconds: '',
  });

  const handleInputChange = (field: string, value: string | number) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);

    // Update the Redux store
    const updateData: any = {
      title: newFormData.title,
      description: newFormData.description,
    };

    if (newFormData.timeLimitSeconds) {
      updateData.timeLimitSeconds = Number(newFormData.timeLimitSeconds) * 60; // Convert minutes to seconds
    }

    quizFormActions.updateForm(updateData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!canProceedToQuestions) return;

    // Just store the quiz data in Redux state, don't create the quiz yet
    const quizData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      timeLimitSeconds: formData.timeLimitSeconds ? Number(formData.timeLimitSeconds) * 60 : undefined,
    };

    // Update the form data in Redux
    quizFormActions.updateForm(quizData);

    // Navigate to questions page - the actual quiz creation will happen when finishing
    navigate('/quiz-builder/questions');
  };

  const handleBack = () => {
    navigate('/quiz-builder');
  };

  const isFormValid = formData.title.trim().length > 0 && formData.description.trim().length > 0;

  return (
    <Container>
      <Header>
        <Title>Quiz Details</Title>
        <Subtitle>
          Let's start by setting up the basic information for your quiz
        </Subtitle>
      </Header>

      <Form onSubmit={handleSubmit}>

        <FormGroup>
          <Label htmlFor="title">
            Quiz Title <Required>*</Required>
          </Label>
          <Input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            placeholder="Enter a compelling quiz title"
            required
            maxLength={100}
          />
          <HelpText>
            Choose a clear, descriptive title that tells users what the quiz is about
          </HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">
            Description <Required>*</Required>
          </Label>
          <TextArea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            placeholder="Describe what this quiz covers and what participants can expect to learn..."
            required
            maxLength={500}
          />
          <HelpText>
            Provide context and learning objectives. This helps participants understand what to expect.
          </HelpText>
        </FormGroup>

        <FormGroup>
          <Label htmlFor="timeLimit">
            Time Limit (minutes)
          </Label>
          <Input
            id="timeLimit"
            type="number"
            value={formData.timeLimitSeconds}
            onChange={(e) => handleInputChange('timeLimitSeconds', e.target.value)}
            placeholder="Optional time limit in minutes"
            min="1"
            max="180"
          />
          <HelpText>
            Optional. Leave blank for no time limit. Recommended: 1-3 minutes per question.
          </HelpText>
        </FormGroup>

        <Actions>
          <Button type="button" variant="secondary" onClick={handleBack}>
            Back
          </Button>
          <Button 
            type="submit" 
            variant="primary" 
            disabled={!isFormValid}
          >
            Next: Add Questions
          </Button>
        </Actions>
      </Form>
    </Container>
  );
};