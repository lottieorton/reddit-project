import { MainPage } from '../features/MainPage/MainPage.js';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch , useSelector } from 'react-redux';
//import { useEffect } from 'react';
//import userEvent from '@testing-library/user-event';
import * as redditApi from '../api/reddit.js';

//Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));
//Mock the imported components
//jest.mock('../features/searchTerm/SearchTerm.js', () => ({
//    SearchTerm: () => <div data-testid="mockSearchTerm">MockSearchTerm</div>
//}));
//jest.mock('../features/filter/Filter.js', () => ({
//    Filter: () => <div data-testid="mockFilter">MockFilter</div>
//}));
//jest.mock('../features/post/Post.js', () => ({
//    Post: ({id, category, title, url}) => (
//        <div data-testid={`mock-post-${id}`}>
//            <h3>{title}</h3>
//            <h4>{category}</h4>
//            <img src={url} />
//        </div>
//    )
//}));

//Mock getSubredditPosts and getSubredditList functions - more comprehensive due to all of their states
//Why the normal basic mock doesn't work here - the process that's occuring:
// 1. Jest processes test file and mock is hoisted to the top
// 2. redditSlice.js is imported indirectly from MainPage.js when the file is evaluated
// 3. Then redditSlice.js executes it's imports {getSubredditPosts, getSubredditList}. Because of our mock functions redditSlice.js would receive jest.fn() - and therefore not process correctly
jest.mock('../api/reddit.js', () => {
    // Define base mock action types. Redux will use these with /pending, /fulfilled, /rejected suffixes.
    const mockSubredditPostsType = 'reddit/getSubredditPosts';
    const mockSubredditListType = 'reddit/getSubredditList';

    return {
        // Mock getSubredditPosts, when called by component it returns this object
        getSubredditPosts: Object.assign(
            jest.fn((subreddit) => ({
                type: mockSubredditPostsType, // The base type without suffix
                payload: subreddit, // The payload for the dispatched action
                meta: { arg: subreddit } // Mock meta info
            })),
            {
                // Define the .pending, .fulfilled, .rejected properties that `createAsuncThunk` would normally add
                pending: { type: `${mockSubredditPostsType}/pending` },
                fulfilled: { type: `${mockSubredditPostsType}/fulfilled` },
                rejected: { type: `${mockSubredditPostsType}/rejected` }
            }
        ),

        // Mock getSubredditList, when called by component it returns this object
        getSubredditList: Object.assign(
            jest.fn(() => ({
                type: mockSubredditListType,
                meta: {} // Mock meta info
            })),
            {
                // Define the .pending, .fulfilled, .rejected properties
                pending: { type: `${mockSubredditListType}/pending` },
                fulfilled: { type: `${mockSubredditListType}/fulfilled` },
                rejected: { type: `${mockSubredditListType}/rejected` }
            }
        ),
    };
});

describe('MainPage component', () => {
    let mockDispatch;

    beforeEach(() => {
        jest.clearAllMocks(); //clears any previous calls or mock implementations on the action creator mocks
        mockDispatch = jest.fn(); //creates a new Jest mock function, ensures call count and arguments are reset for each test
        useDispatch.mockReturnValue(mockDispatch); //configures the mocked useDispatch to return our mockDispatch function
    })
    
    //Tell the mocked useSelector what to return. selectorFn represents the arg it will receive in this case will be the state: (state) => state.reddit.feed
    //Helper to set up common mock state for useSelector
    const mockState = (redditFeed = [], searchValue = '', redditList = []) => {
        useSelector.mockImplementation((selectorFn) => selectorFn({
            filter: '',
            searchTerm: searchValue,
            reddit: {
                feed: redditFeed,
                list: redditList,
                feedIsLoading: false,
                feedHasError: false,
                listIsLoading: false,
                listHasError: false
            }
        }))
    };

    it('on component render useEffect dispatches getSubredditPosts and subRedditList', async () => {
        //arrange
        const subredditDefault = '/r/pics/';
        mockState();
        //action
        render(<MainPage />);
        //assert
        await waitFor(() => {expect(mockDispatch).toHaveBeenCalledTimes(2)});
        expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditPosts(subredditDefault));
        expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditList());
        expect(redditApi.getSubredditPosts).toHaveBeenCalledWith(subredditDefault);
        expect(redditApi.getSubredditList).toHaveBeenCalledWith();
    });


    it('renders a header', async () => {
        //arrange
        //action
        render(<MainPage />);
        const header = screen.getByText(`Reddit? No? Well you've come to the right place`);
        //assert
        expect(header).toBeInTheDocument;
    })

//NEED CHECK IF RENDERS THE OUTLERT? COVERED IN APP.TEST?
})