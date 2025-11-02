import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { 
  selectTimeRemainingSeconds, 
  selectTimerActive, 
  selectHasTimeLimit,
  tickTimer,
  stopTimer,
  completeQuizAttempt,
  selectCurrentAttempt
} from '@store/slices/quizAttemptSlice';

const TimerContainer = styled.div<{ $warning?: boolean; $critical?: boolean }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid ${({ theme, $warning, $critical }) => 
    $critical ? theme.colors.error : 
    $warning ? theme.colors.warning : 
    theme.colors.border};
  background-color: ${({ theme, $warning, $critical }) => 
    $critical ? `${theme.colors.error}10` : 
    $warning ? `${theme.colors.warning}10` : 
    theme.colors.backgroundLight};
  font-weight: 500;
`;

const TimeIcon = styled.span`
  font-size: 18px;
`;

const TimeText = styled.span<{ $warning?: boolean; $critical?: boolean }>`
  color: ${({ theme, $warning, $critical }) => 
    $critical ? theme.colors.error : 
    $warning ? theme.colors.warning : 
    theme.colors.text};
  font-size: 16px;
  font-weight: 600;
`;

const TimerLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 14px;
`;

export const QuizTimer: React.FC = () => {
  const dispatch = useAppDispatch();
  const timeRemainingSeconds = useAppSelector(selectTimeRemainingSeconds);
  const timerActive = useAppSelector(selectTimerActive);
  const hasTimeLimit = useAppSelector(selectHasTimeLimit);
  const currentAttempt = useAppSelector(selectCurrentAttempt);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Start/stop timer based on timerActive state
  useEffect(() => {
    if (timerActive && timeRemainingSeconds !== null && timeRemainingSeconds > 0) {
      intervalRef.current = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [timerActive, timeRemainingSeconds, dispatch]);

  // Auto-complete quiz when time runs out
  useEffect(() => {
    if (timeRemainingSeconds === 0 && currentAttempt) {
      dispatch(stopTimer());
      dispatch(completeQuizAttempt({ attemptId: currentAttempt.id }));
    }
  }, [timeRemainingSeconds, currentAttempt, dispatch]);

  // Don't render if no time limit
  if (!hasTimeLimit || timeRemainingSeconds === null) {
    return null;
  }

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Warning and critical thresholds (in seconds)
  const warningThreshold = 300; // 5 minutes
  const criticalThreshold = 60; // 1 minute

  const isWarning = timeRemainingSeconds <= warningThreshold && timeRemainingSeconds > criticalThreshold;
  const isCritical = timeRemainingSeconds <= criticalThreshold;

  return (
    <TimerContainer $warning={isWarning} $critical={isCritical}>
      <TimeIcon>⏰</TimeIcon>
      <TimerLabel>Time Remaining:</TimerLabel>
      <TimeText $warning={isWarning} $critical={isCritical}>
        {formatTime(timeRemainingSeconds)}
      </TimeText>
    </TimerContainer>
  );
};

export default QuizTimer;