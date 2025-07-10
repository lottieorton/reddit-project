import { createSlice } from '@reduxjs/toolkit';
import { getSubredditPosts, getSubredditList, getSubredditPostComments } from '../api/reddit.js';

export const redditSlice = createSlice({
    name: 'reddit',
    initialState: {
        feed: [],
        list: [],
        comments: [],
        feedIsLoading: false,
        feedHasError: false,
        listIsLoading: false,
        listHasError: false,
        commentsIsLoading: false,
        commentsHasError: false
    },
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(
            getSubredditPosts.pending,
            (state) => {
                state.feedIsLoading = true;
                state.feedHasError = false;
        }).addCase(
            getSubredditPosts.fulfilled,
            (state, action) => {
                state.feed = action.payload;
                state.feedIsLoading = false;
                state.feedHasError = false;
        }).addCase(
            getSubredditPosts.rejected,
            (state, action) => {
                state.feedIsLoading = false;
                state.feedHasError = true;
        }).addCase(
            getSubredditList.pending,
            (state) => {
                state.listIsLoading = true;
                state.listHasError = false;
        }).addCase(
            getSubredditList.fulfilled,
            (state, action) => {
                state.list = action.payload;
                state.listIsLoading = false;
                state.listHasError = false;
        }).addCase(
            getSubredditList.rejected,
            (state, action) => {
                state.listIsLoading = false;
                state.listHasError = true;
        }).addCase(
            getSubredditPostComments.pending,
            (state) => {
                state.commentsIsLoading = true;
                state.commentsHasError = false;
        }).addCase(
            getSubredditPostComments.fulfilled,
            (state, action) => {
                state.comments = action.payload;
                state.commentsIsLoading = false;
                state.commentsHasError = false;
        }).addCase(
            getSubredditPostComments.rejected,
            (state, action) => {
                state.commentsIsLoading = false;
                state.commentsHasError = true;
        })
    }
})

export default redditSlice.reducer;