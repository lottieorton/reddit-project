import { createSlice } from '@reduxjs/toolkit';
import { getSubredditPosts } from '../api/reddit.js';

export const redditSlice = createSlice({
    name: 'reddit',
    initialState: {
        feed: [],
        isLoading: false,
        hasError: false
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(
            getSubredditPosts.pending,
            (state) => {
                state.isLoading = true;
                state.hasError = false;
        }).addCase(
            getSubredditPosts.fulfilled,
            (state, action) => {
                state.feed = action.payload;
                state.isLoading = false;
                state.hasError = false;
        }).addCase(
            getSubredditPosts.rejected,
            (state, action) => {
                state.isLoading = false;
                state.hasError = true;
        })
    }
})

export default redditSlice.reducer;
//export const selectFeed = (state) => state.feed.feed;