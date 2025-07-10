import { MainPage } from '../features/MainPage/MainPage.js';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch , useSelector } from 'react-redux';
import * as redditApi from '../api/reddit.js';
import { useParams } from 'react-router-dom';
import { setFilter } from '../features/filter/filterSlice.js';

//Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn()
}))

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

    it('on component render, where no subreddit in url, useEffect dispatches getSubredditPosts and subRedditList', async () => {
        //arrange
        const subredditDefault = '/r/pics/';
        mockState();
        useParams.mockReturnValue({});
        //action
        render(<MainPage />);
        //assert
        await waitFor(() => {expect(mockDispatch).toHaveBeenCalledTimes(2)});
        expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditPosts(subredditDefault));
        expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditList());
        expect(redditApi.getSubredditPosts).toHaveBeenCalledWith(subredditDefault);
        expect(redditApi.getSubredditList).toHaveBeenCalledWith();
    });

    it('on component render, where subbreddit in url, useEffect dispatches setFilter, getSubredditPosts and subRedditList', async () => {
        //arrange
        const subredditValue = '/r/Home/';
        const subredditFilterValue = 'Home'
        mockState();
        useParams.mockReturnValue({subreddit: 'Home'});
        //action
        render(<MainPage />);
        //assert
        await waitFor(() => {expect(mockDispatch).toHaveBeenCalledTimes(3)});
        expect(mockDispatch).toHaveBeenCalledWith(setFilter({value: subredditFilterValue}));
        expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditPosts(subredditValue));
        expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditList());
        expect(redditApi.getSubredditPosts).toHaveBeenCalledWith(subredditValue);
        expect(redditApi.getSubredditList).toHaveBeenCalledWith();
    });

    it('renders a header and logo', async () => {
        //arrange
        useParams.mockReturnValue({});
        //action
        render(<MainPage />);
        const header = screen.getByText(`Reddit? No? Well you've come to the right place`);
        const logo = screen.getByRole('img', { name: /Reddit Logo in black/i })
        //assert
        expect(header).toBeInTheDocument();
        expect(logo).toBeInTheDocument();
    })
})