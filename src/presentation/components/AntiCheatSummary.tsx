import React from 'react';
import styled from 'styled-components';
import { AntiCheatSummary as AntiCheatSummaryType } from '@shared/types/api';

const SummaryContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.backgroundLight};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  padding: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
`;

const SummaryTitle = styled.h3`
  color: ${({ theme }) => theme.colors.text};
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 ${({ theme }) => theme.spacing.sm} 0;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SummaryIcon = styled.span`
  font-size: 18px;
`;

const SummaryStats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const StatLabel = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: 12px;
  text-transform: uppercase;
  font-weight: 500;
`;

const StatValue = styled.span<{ $warning?: boolean }>`
  color: ${({ theme, $warning }) => $warning ? theme.colors.warning : theme.colors.text};
  font-size: 18px;
  font-weight: 600;
`;

const NoEventsMessage = styled.div`
  color: ${({ theme }) => theme.colors.success};
  font-style: italic;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

interface AntiCheatSummaryProps {
  summary: AntiCheatSummaryType;
}

export const AntiCheatSummary: React.FC<AntiCheatSummaryProps> = ({ summary }) => {
  const { totalEvents, focusLostCount, pasteCount } = summary;

  // Determine if there are concerning levels of events
  const hasWarningLevels = focusLostCount > 5 || pasteCount > 3;

  if (totalEvents === 0) {
    return (
      <SummaryContainer>
        <SummaryTitle>
          <SummaryIcon>🛡️</SummaryIcon>
          Anti-Cheat Summary
        </SummaryTitle>
        <NoEventsMessage>
          <span>✅</span>
          No suspicious activity detected during this quiz attempt.
        </NoEventsMessage>
      </SummaryContainer>
    );
  }

  return (
    <SummaryContainer>
      <SummaryTitle>
        <SummaryIcon>🛡️</SummaryIcon>
        Anti-Cheat Summary
      </SummaryTitle>
      
      <SummaryStats>
        <StatItem>
          <StatLabel>Tab Switches</StatLabel>
          <StatValue $warning={focusLostCount > 5}>
            {focusLostCount}
          </StatValue>
        </StatItem>
        
        <StatItem>
          <StatLabel>Paste Actions</StatLabel>
          <StatValue $warning={pasteCount > 3}>
            {pasteCount}
          </StatValue>
        </StatItem>
        
        <StatItem>
          <StatLabel>Total Events</StatLabel>
          <StatValue $warning={hasWarningLevels}>
            {totalEvents}
          </StatValue>
        </StatItem>
      </SummaryStats>
    </SummaryContainer>
  );
};

export default AntiCheatSummary;