import { configureStore } from '@reduxjs/toolkit';
import searchTermReducer from '../features/searchTerm/searchTermSlice';
import feedReducer from '../features/homePage/feedSlice';
import filterReducer from '../features/filter/filterSlice'

export const store = configureStore({
  reducer: {
    searchTerm: searchTermReducer,
    feed: feedReducer,
    filter: filterReducer
  },
});
