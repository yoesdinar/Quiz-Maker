import { configureStore } from '@reduxjs/toolkit';
import quizBuilderReducer from './slices/quizBuilderSlice';

export const store = configureStore({
  reducer: {
    quizBuilder: quizBuilderReducer,
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