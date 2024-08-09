import { configureStore } from '@reduxjs/toolkit';
import projectReviewReducer from './projectSlice';

const store = configureStore({
  reducer: {
    projectReview: projectReviewReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
