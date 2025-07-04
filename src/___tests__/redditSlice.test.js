import redditReducer from '../api/redditSlice.js';
import { getSubredditList, getSubredditPosts, getSubredditPostComments } from '../api/reddit.js';
import '@testing-library/jest-dom';

describe('redditSlice', () => {
    const initialState = {
        feed: [],
        list: [],
        comments: [],
        feedIsLoading: false,
        feedHasError: false,
        listIsLoading: false,
        listHasError: false,
        commentsIsLoading: false,
        commentsHasError: false
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
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(false);
            expect(newState.comments).toEqual([]);
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
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(false);
            expect(newState.comments).toEqual([]);
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
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(false);
            expect(newState.comments).toEqual([]);
        });
    });

    describe('getSubreddits extraReducers or lifecycle actions', () => {
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
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(false);
            expect(newState.comments).toEqual([]);
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
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(false);
            expect(newState.comments).toEqual([]);
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
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(false);
            expect(newState.comments).toEqual([]);
        });
    })

    describe('getSubredditPostComments extraReducers or lifecycle actions', () => {
        const mockSubredditPermalink = '/r/subreddit1/1a/link_info_here';
        const mockRequestId = 'mockReqId123';

        it('getSubredditPostComments.pending should update the state correctly', () => {
            //arrange
            //action
            const action = getSubredditPostComments.pending(mockSubredditPermalink, mockRequestId)
            const newState = redditReducer(initialState, action);
            //assert
            expect(newState.commentsIsLoading).toBe(true);
            expect(newState.commentsHasError).toBe(false);
            //Other parts of the state should remain unchanged
            expect(newState.comments).toEqual([]);
            expect(newState.feedIsLoading).toBe(false);
            expect(newState.feedHasError).toBe(false);
            expect(newState.feed).toEqual([]);
            expect(newState.list).toEqual([]);
            expect(newState.listHasError).toBe(false);
            expect(newState.listIsLoading).toBe(false);
        });

        it('getSubredditPostComments.fulfilled should update the state correctly', () => {
            //arrange
            const mockCommentsResponse = [
                {subreddit: 'subreddit1', subreddit_name_prefixed: 'r/subreddit1', name: 't1_1a2b', ups: 10, downs: 5, score: 5, subreddit_id: 't5_3c2b', id: '1a2b3c', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body: 'This is the first comment', body_html: 'This is the first comment HTML'},
                {subreddit: 'subreddit1', subreddit_name_prefixed: 'r/subreddit1', name: 't1_1a3c', ups: 10, downs: 5, score: 5, subreddit_id: 't5_3c2b', id: '1a2b4d', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body: 'This is the second comment', body_html: 'This is the second comment HTML'},
                {subreddit: 'subreddit1', subreddit_name_prefixed: 'r/subreddit1', name: 't1_1a4d', ups: 10, downs: 5, score: 5, subreddit_id: 't5_3c2b', id: '1a2be5', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body: 'This is the third comment', body_html: 'This is the third comment HTML'}
            ];
            //Start from pending state
            const stateAfterPending = {...initialState, commentsIsLoading: true};
            //action
            const action = getSubredditPostComments.fulfilled(mockCommentsResponse, mockRequestId, mockSubredditPermalink);
            const newState = redditReducer(stateAfterPending, action);
            //assert
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(false);
            expect(newState.comments).toEqual(mockCommentsResponse);
            //Other parts of the state should remain unchanged
            expect(newState.feedIsLoading).toBe(false);
            expect(newState.feedHasError).toBe(false);
            expect(newState.feed).toEqual([]);
            expect(newState.list).toEqual([]);
            expect(newState.listHasError).toBe(false);
            expect(newState.listIsLoading).toBe(false);
        });

        it('getSubredditPostComments.rejected should update the state correctly', () => {
            //arrange
            const mockError = new Error('Error fetching comments');
            //Start from pending state
            const stateAfterPending = {...initialState, commentsIsLoading: true};
            //action
            const action = getSubredditPostComments.rejected(mockError, mockSubredditPermalink, mockRequestId)
            const newState = redditReducer(stateAfterPending, action);
            //assert
            expect(newState.commentsIsLoading).toBe(false);
            expect(newState.commentsHasError).toBe(true);
            //Other parts of the state should remain unchanged
            expect(newState.comments).toEqual([]);
            expect(newState.feedIsLoading).toBe(false);
            expect(newState.feedHasError).toBe(false);
            expect(newState.feed).toEqual([]);
            expect(newState.list).toEqual([]);
            expect(newState.listHasError).toBe(false);
            expect(newState.listIsLoading).toBe(false);
        });
    });

})
