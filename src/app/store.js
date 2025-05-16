import { configureStore } from '@reduxjs/toolkit';
import searchTermReducer from '../features/searchTerm/searchTermSlice';
import feedSliceReducer from '../features/homePage/feedSlice';

export const store = configureStore({
  reducer: {
    searchTerm: searchTermReducer,
    feed: feedSliceReducer
  },
});
