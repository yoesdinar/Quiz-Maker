import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Layout } from './Layout';
import { HomePage } from '@presentation/pages/HomePage';
import { QuizListPage } from '@presentation/pages/QuizListPage';
import { QuizDetailPage } from '@presentation/pages/QuizDetailPage';
import { TakeQuizPage } from '@presentation/pages/TakeQuizPage';
import { QuizBuilderEntryPage } from '@presentation/pages/QuizBuilderEntryPage';
import { QuizDetailsFormPage } from '@presentation/pages/QuizDetailsFormPage';
import { QuestionBuilderPage } from '@presentation/pages/QuestionBuilderPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="quizzes" element={<QuizListPage />} />
        <Route path="quizzes/:id" element={<QuizDetailPage />} />
        <Route path="quizzes/:id/take" element={<TakeQuizPage />} />
        
        {/* Quiz Builder Routes */}
        <Route path="quiz-builder" element={<QuizBuilderEntryPage />} />
        <Route path="quiz-builder/details" element={<QuizDetailsFormPage />} />
        <Route path="quiz-builder/questions" element={<QuestionBuilderPage />} />
      </Route>
    </Routes>
  );
};