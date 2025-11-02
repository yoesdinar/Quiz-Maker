import { configureStore } from '@reduxjs/toolkit';
import quizBuilderReducer from './slices/quizBuilderSlice';
import quizAttemptReducer from './slices/quizAttemptSlice';

export const store = configureStore({
  reducer: {
    quizBuilder: quizBuilderReducer,
    quizAttempt: quizAttemptReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;