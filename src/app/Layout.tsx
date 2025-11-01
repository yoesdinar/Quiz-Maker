import React from 'react';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  box-shadow: ${({ theme }) => theme.shadows.md};
`;

const Title = styled.h1`
  margin: 0;
  font-size: 1.5rem;
`;

const Main = styled.main`
  flex: 1;
  padding: ${({ theme }) => theme.spacing.lg};
  background-color: ${({ theme }) => theme.colors.background};
`;

export const Layout: React.FC = () => {
  return (
    <LayoutContainer>
      <Header>
        <Title>Quiz Maker</Title>
      </Header>
      <Main>
        <Outlet />
      </Main>
    </LayoutContainer>
  );
};