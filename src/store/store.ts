import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/auth.slice';
import postReducer from './post/post.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
