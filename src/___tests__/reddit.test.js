//import { isAsyncThunkAction } from '@reduxjs/toolkit';
import { getSubredditList, getSubredditPosts, apiBaseURL } from '../api/reddit.js';
import '@testing-library/jest-dom';
import { configureStore } from '@reduxjs/toolkit';

//Mock fetch
const mockFetch = jest.fn();

describe('Reddit API Async Thunks', () => {
    //Save the original global.fetch
    const originalFetch = global.fetch;
    let store;

    beforeAll(() => {
        global.fetch = mockFetch; //replace global.fetch with our mock
    });

    afterAll(() => {
        global.fetch = originalFetch; //restore original global.fetch
    });

    beforeEach(() => {
        mockFetch.mockClear(); //clear any previous mock calls and implementations
        jest.spyOn(console, 'log').mockImplementation(() => {}); //stop console.log's
        //create a test store
        store = configureStore({
            reducer: {
                reddit: (state = {}, action) => state
            }
        });
    });

    afterEach(() => {
        jest.restoreAllMocks(); //restore mocks
    });
    
    describe('getSubredditList', () => {
        it('should fetch subreddit list successfully and return mapped data', async () => {
            //arrange
            const mockSubredditsResponse = {
                data: {
                    children: [
                        {data: {title: 'title1', display_name: 'display_name1'}},
                        {data: {title: 'title2', display_name: 'display_name2'}},
                    ]
                }
            };
            const expectedResponse = [
                {title: 'title1', displayName: 'display_name1'},
                {title: 'title2', displayName: 'display_name2'}
            ];
            const expectedResultType = 'reddit/getSubredditList/fulfilled';
            const expectedURL = `${apiBaseURL}/subreddits.json`;
            //Configure mockFetch to return a successful response
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSubredditsResponse)
            });
            //action
            const result = await store.dispatch(getSubredditList());
            //assert
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(expectedURL);
            expect(result.payload).toEqual(expectedResponse);
            //Expect action type for fulfillment
            expect(result.type).toBe(expectedResultType);
        });

        it('should handle Network error for getSubredditList', async () => {
            //arrange
            //Configure mockFetch to return a rejected response
            mockFetch.mockRejectedValueOnce(new Error('Network error!'));
            const expectedURL = `${apiBaseURL}/subreddits.json`;
            const expectedError = 'Network error!';
            const expectedResultType = 'reddit/getSubredditList/rejected';
            //action
            const result = await store.dispatch(getSubredditList());
            //assert
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(expectedURL);
            //Expect the result type for rejection
            expect(result.type).toBe(expectedResultType);
            expect(result.error.message).toBe(expectedError);
            expect(console.log).toHaveBeenCalledTimes(1);
        });

        it('should handle non-ok HTTP response for getSubredditLists', async () => {
            //arrange
            //mockFetch giving a non-ok response
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: () => Promise.resolve({ message: 'Not Found'})
            });
            const expectedURL = `${apiBaseURL}/subreddits.json`;
            const expectedError = 'HTTP error! Status: 404';
            const expectedResultType = 'reddit/getSubredditList/rejected';
            //action
            const result = await store.dispatch(getSubredditList());
            //assert
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(expectedURL);
            //Expect the result type for rejection
            expect(result.type).toBe(expectedResultType);
            expect(result.error.message).toBe(expectedError);
        })
    })

    describe('getSubredditPosts', () => {
        it('should fetch subreddit posts successfully and return mapped data', async () => {
            //arrange
            const subreddit = '/r/pics/';
            const mockSubredditsResponse = {
                data: {
                    children: [
                        {data: {id: '1', title: 'title1', subreddit_name_prefixed: 'subredditNamePrefixed1', preview: 'preview1', subreddit_id: 'subredditId1', url: 'url1'}},
                        {data: {id: '2', title: 'title2', subreddit_name_prefixed: 'subredditNamePrefixed2', preview: 'preview2', subreddit_id: 'subredditId2', url: 'url2'}},
                        {data: {id: '3', title: 'title3', subreddit_name_prefixed: 'subredditNamePrefixed3', preview: 'preview3', subreddit_id: 'subredditId3', url: 'url3'}}
                    ]
                }
            };
            const expectedResponse = [
                {id: '1', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1'},
                {id: '2', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2'},
                {id: '3', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3'},
            ];
            const expectedResultType = 'reddit/getSubredditPosts/fulfilled';
            const expectedURL = `${apiBaseURL}${subreddit}.json`;
            //Configure mockFetch to return a successful response
            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: () => Promise.resolve(mockSubredditsResponse)
            });
            //action
            const result = await store.dispatch(getSubredditPosts(subreddit));
            //assert
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(expectedURL);
            expect(result.payload).toEqual(expectedResponse);
            //Expect action type for fulfillment
            expect(result.type).toBe(expectedResultType);
        })

        it('should handle Network error for getSubredditPosts', async () => {
            //arrange
            const subreddit = '/r/pics/';
            //Configure mockFetch to return a rejected response
            mockFetch.mockRejectedValueOnce(new Error('Network error!'));
            const expectedURL = `${apiBaseURL}${subreddit}.json`;
            const expectedError = 'Network error!';
            const expectedResultType = 'reddit/getSubredditPosts/rejected';
            //action
            const result = await store.dispatch(getSubredditPosts(subreddit));
            //assert
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(expectedURL);
            //Expect the result type for rejection
            expect(result.type).toBe(expectedResultType);
            expect(result.error.message).toBe(expectedError);
            expect(console.log).toHaveBeenCalledTimes(1);
        });

        it('should handle non-ok HTTP response for getSubredditPosts', async () => {
            //arrange
            const subreddit = '/r/pics/';
            //mockFetch giving a non-ok response
            mockFetch.mockResolvedValueOnce({
                ok: false,
                status: 404,
                json: () => Promise.resolve({ message: 'Not Found'})
            });
            const expectedURL = `${apiBaseURL}${subreddit}.json`;
            const expectedError = 'HTTP error! Status: 404';
            const expectedResultType = 'reddit/getSubredditPosts/rejected';
            //action
            const result = await store.dispatch(getSubredditPosts(subreddit));
            //assert
            expect(mockFetch).toHaveBeenCalledTimes(1);
            expect(mockFetch).toHaveBeenCalledWith(expectedURL);
            //Expect the result type for rejection
            expect(result.type).toBe(expectedResultType);
            expect(result.error.message).toBe(expectedError);
        });
    })
})