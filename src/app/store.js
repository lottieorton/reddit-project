import { configureStore } from '@reduxjs/toolkit';
import searchTermReducer from '../features/searchTerm/searchTermSlice.js';
import redditReducer from '../api/redditSlice.js';
import filterReducer from '../features/filter/filterSlice.js'

export const store = configureStore({
  reducer: {
    searchTerm: searchTermReducer,
    reddit: redditReducer,
    filter: filterReducer
  },
});
