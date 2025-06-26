import redditReducer from '../api/redditSlice.js';
import { getSubredditList, getSubredditPosts } from '../api/reddit.js';
import '@testing-library/jest-dom';

describe('redditSlice', () => {
    const initialState = {
        feed: [],
        list: [],
        feedIsLoading: false,
        feedHasError: false,
        listIsLoading: false,
        listHasError: false
    };

    it('should check the initial state', () => {
        expect(redditReducer(undefined, {type: 'UNKNOWN_ACTION'})).toEqual(initialState); //calling reducer with undefined state and unknown action should return the initial state 
    });

    describe('getSubredditPosts extraReducers or lifecycle actions', () => {
        const mockSubreddit = '/r/pics';
        const mockRequestId = 'mockReqId123';

        it('getSubredditPosts.pending should update the state correctly', () => {
            //arrange
            //action
            const action = getSubredditPosts.pending(mockSubreddit, mockRequestId)
            const newState = redditReducer(initialState, action);
            //assert
            expect(newState.feedIsLoading).toBe(true);
            expect(newState.feedHasError).toBe(false);
            //Other parts of the state should remain unchanged
            expect(newState.feed).toEqual([]);
            expect(newState.list).toEqual([]);
            expect(newState.listHasError).toBe(false);
            expect(newState.listIsLoading).toBe(false);
        });

        it('getSubredditPosts.fulfilled should update the state correctly', () => {
            //arrange
            const mockPostsResponse = [
                {id: '1', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1'},
                {id: '2', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2'},
                {id: '3', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3'},
            ];
            //Start from pending state
            const stateAfterPending = {...initialState, feedIsLoading: true};
            //action
            const action = getSubredditPosts.fulfilled(mockPostsResponse, mockRequestId, mockSubreddit);
            const newState = redditReducer(stateAfterPending, action);
            //assert
            expect(newState.feed).toEqual(mockPostsResponse);
            expect(newState.feedIsLoading).toBe(false);
            expect(newState.feedHasError).toBe(false);
            //Other parts of the state should remain unchanged
            expect(newState.list).toEqual([]);
            expect(newState.listHasError).toBe(false);
            expect(newState.listIsLoading).toBe(false);
        });

        it('getSubredditPosts.rejected should update the state correctly', () => {
            //arrange
            const mockError = new Error('Error fetching posts');
            //Start from pending state
            const stateAfterPending = {...initialState, feedIsLoading: true};
            //action
            const action = getSubredditPosts.rejected(mockError, mockSubreddit, mockRequestId)
            const newState = redditReducer(stateAfterPending, action);
            //assert
            expect(newState.feedIsLoading).toBe(false);
            expect(newState.feedHasError).toBe(true);
            //Other parts of the state should remain unchanged
            expect(newState.feed).toEqual([]);
            expect(newState.list).toEqual([]);
            expect(newState.listHasError).toBe(false);
            expect(newState.listIsLoading).toBe(false);
        });
    });

    describe('getSubreddits extraReducers or lifecyce actions', () => {
        const mockRequestId = 'mockReqId123';

        it('getSubredditList.pending should update the state correctly', () => {
            //arrange
            //action
            const action = getSubredditList.pending(mockRequestId);
            const newState = redditReducer(initialState, action);
            //assert
            expect(newState.listIsLoading).toBe(true);
            expect(newState.listHasError).toBe(false);
            //Remaining parts of the state should remain unchanged
            expect(newState.list).toEqual([]);
            expect(newState.feed).toEqual([]);
            expect(newState.feedHasError).toBe(false);
            expect(newState.feedIsLoading).toBe(false);
        });

        it('getSubredditList.fulfilled should update the state correctly', () => {
            //arrange
            const mockResponse = [
                {title: 'title1', displayName: 'display_name1'},
                {title: 'title2', displayName: 'display_name2'}
            ];
            //start with pending state
            const stateAfterPending = {...initialState, listIsLoading: true};
            //action
            const action = getSubredditList.fulfilled(mockResponse, mockRequestId);
            const newState = redditReducer(stateAfterPending, action);
            //assert
            expect(newState.list).toEqual(mockResponse);
            expect(newState.listIsLoading).toBe(false);
            expect(newState.listHasError).toBe(false);
            //Remaining parts of the state should remain unchanged
            expect(newState.feed).toEqual([]);
            expect(newState.feedHasError).toBe(false);
            expect(newState.feedIsLoading).toBe(false);
        });

        it('getSubredditList.rejected should update the state correctly', () => {
            //arrange
            const mockError = new Error('Error fetching posts');
            //start with pending state
            const stateAfterPending = {...initialState, listIsLoading: true};
            //action
            const action = getSubredditList.rejected(mockError, mockRequestId);
            const newState = redditReducer(stateAfterPending, action);
            //assert
            expect(newState.listIsLoading).toBe(false);
            expect(newState.listHasError).toBe(true);
            //Remaining parts of the state should remain unchanged
            expect(newState.list).toEqual([]);
            expect(newState.feed).toEqual([]);
            expect(newState.feedHasError).toBe(false);
            expect(newState.feedIsLoading).toBe(false);
        });
    })

})
