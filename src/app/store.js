import { configureStore } from '@reduxjs/toolkit';
import searchTermReducer from '../features/searchTerm/searchTermSlice.js';
import feedReducer from '../features/homePage/feedSlice.js';
import filterReducer from '../features/filter/filterSlice.js'

export const store = configureStore({
  reducer: {
    searchTerm: searchTermReducer,
    feed: feedReducer,
    filter: filterReducer
  },
});
