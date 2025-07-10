import { PostPage } from '../features/post/PostPage';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useParams , useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import * as redditApi from '../api/reddit.js';

const mockNavigateFunction = jest.fn();
//Mock useSelector, useParams and useNavigate
jest.mock('react-redux', () => ({
    useSelector: jest.fn(),
    useDispatch: jest.fn()
}));
jest.mock('react-router-dom', () => ({
    useParams: jest.fn(),
    useNavigate: () => mockNavigateFunction
}));

jest.mock('../api/reddit.js', () => {
    // Define base mock action types. Redux will use these with /pending, /fulfilled, /rejected suffixes.
    const mockSubredditPostCommentsType = 'reddit/getSubredditPostComments';
    const mockSubredditPostsType = 'reddit/getSubredditPosts';

    return {
        // Mock getSubredditPostComments, when called by component it returns this object
        getSubredditPostComments: Object.assign(
            jest.fn((permalink) => ({
                type: mockSubredditPostCommentsType, // The base type without suffix
                payload: permalink, // The payload for the dispatched action
                meta: { arg: permalink } // Mock meta info
            })),
            {
                // Define the .pending, .fulfilled, .rejected properties that `createAsuncThunk` would normally add
                pending: { type: `${mockSubredditPostCommentsType}/pending` },
                fulfilled: { type: `${mockSubredditPostCommentsType}/fulfilled` },
                rejected: { type: `${mockSubredditPostCommentsType}/rejected` }
            }
        ),
        // Mock getSubredditPosts, when called by component it returns this object
        getSubredditPosts: Object.assign(
            jest.fn((post) => ({
                type: mockSubredditPostsType, // The base type without suffix
                payload: post, // The payload for the dispatched action
                meta: { arg: post } // Mock meta info
            })),
            {
                // Define the .pending, .fulfilled, .rejected properties that `createAsuncThunk` would normally add
                pending: { type: `${mockSubredditPostsType}/pending` },
                fulfilled: { type: `${mockSubredditPostsType}/fulfilled` },
                rejected: { type: `${mockSubredditPostsType}/rejected` }
            }
        ),
    };
});

describe('PostPage component', () => {
    let mockDispatch;

    beforeEach(() => {
        jest.clearAllMocks(); //clears any previous calls or mock implementations on the action creator mocks
        mockNavigateFunction.mockClear();
        mockDispatch = jest.fn(); //creates a new Jest mock function, ensures call count and arguments are reset for each test
        useDispatch.mockReturnValue(mockDispatch); //configures the mocked useDispatch to return our mockDispatch function
    });
    
    //Tell the mocked useSelector what to return. selectorFn represents the arg it will receive in this case will be the state: (state) => state.reddit.feed
    //Helper to set up common mock state for useSelector
    const mockState = (redditFeed = [], redditComments = [], commentsIsLoading = false, commentsHasError = false, feedIsLoading = false, feedHasError = false) => {
        useSelector.mockImplementation((selectorFn) => selectorFn({
            filter: '',
            searchTerm: '',
            reddit: {
                feed: redditFeed,
                list: [],
                comments: redditComments,
                feedIsLoading: feedIsLoading,
                feedHasError: feedHasError,
                listIsLoading: false,
                listHasError: false,
                commentsIsLoading: commentsIsLoading,
                commentsHasError: commentsHasError
            }
        }))
    };

    it('if selectedPost and its permalink exists, getSubredditPostComments dispatched', async () => {
        //arrange
        const testFeed = [
                {id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', permalink: '/r/subreddit1/1a/link_info_here', author: 'author1', numComments: 10},
                {id: '2b', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2', permalink: '/r/subreddit1/1a/link_info_here', author: 'author2', numComments: 11},
                {id: '3c', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3', permalink: '/r/subreddit1/1a/link_info_here', author: 'author3', numComments: 12},
        ];
        const expectedPermalink = '/r/subreddit1/1a/link_info_here';
        mockState(testFeed);
        useParams.mockReturnValue({id: '1a'});
        //action
        render(<PostPage />);
        //assert
        await waitFor(() => {expect(mockDispatch).toHaveBeenCalledTimes(1)});
        expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditPostComments(expectedPermalink));
        expect(redditApi.getSubredditPostComments).toHaveBeenCalledWith(expectedPermalink);   
    });

    it('filters the comments array to exclude entries with no body value and reduces array to max 50 length', async () => {
        //arrange
        const testFeed = [
                {id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', permalink: '/r/subreddit1/1a/link_info_here', author: 'author1', numComments: 10},
                {id: '2b', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2', permalink: '/r/subreddit1/1a/link_info_here', author: 'author2', numComments: 11},
                {id: '3c', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3', permalink: '/r/subreddit1/1a/link_info_here', author: 'author3', numComments: 12},
        ];
        //Create more than 50 mock comments
        const testComments = [
            {subreddit: 'subreddita', subreddit_name_prefixed: 'r/1aa', name: 't1_1aa', ups: 1, downs: 3, score: 3, subreddit_id: 't5_3c2b', id: '1a2b3c', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body: '', body_html: 'This is the first comment HTML'},
            {subreddit: 'subredditb', subreddit_name_prefixed: 'r/1ab', name: 't1_1ab', ups: 2, downs: 3, score: 3, subreddit_id: 't5_3c2b', id: '1a2b4d', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body_html: 'This is the second comment HTML'}
        ];
        for (let i = 0; i < 60; i++) {
            testComments.push({
                subreddit: `subreddit${i}`, 
                subreddit_name_prefixed: `r/subreddit1`, 
                name: `t1_1a${i}`, 
                ups: 10 + i, 
                downs: 5 + i, 
                score: 5 + i, 
                subreddit_id: 't5_3c2b', 
                id: '1a2b3c', 
                parent_id: "t3_1a", 
                permalink: '/r/subreddit1/1a/link_info_here', 
                body: `This is the ${i} comment`, 
                body_html: `This is the ${i} comment HTML`
            })
        }

        mockState(testFeed, testComments);
        useParams.mockReturnValue({id: '1a'});
        //action
        render(<PostPage />);
        //assert
        await waitFor(() => {
            //Check the parent post details are still there
            expect(screen.getByRole('button', {name: /Back to Home Page/i})).toBeInTheDocument();
            expect(screen.getByText(/title1/i)).toBeInTheDocument();
            expect(screen.getByRole('img', {name: /title1/i})).toBeInTheDocument();
            expect(screen.getByText('Author: author1')).toBeInTheDocument();
            expect(screen.getByText(/Comments: 10/i)).toBeInTheDocument();
            //Check the first 50 comments are successfully rendered and not the rest
            for (let i = 0; i < 5; i++) {
                const expectedBody = `This is the ${i} comment`;
                const expectedUps = 10 + 1;
                const expectedDowns = 5 + 1;
                const expectedScore = 5 + 1;
                //Check comment body
                expect(screen.getByText(expectedBody)).toBeInTheDocument();
                expect(screen.getByText(`Up votes: ${expectedUps} Down votes: ${expectedDowns} Score: ${expectedScore}`)).toBeInTheDocument();
            }
            //Check the 51st comment is not rendered
            const expected51Body = `This is the 50 comment`
            expect(screen.queryByText(expected51Body)).not.toBeInTheDocument();
        })
    });

    it('if there are no comments it gives an empty array', async () => {
        //arrange
        const testFeed = [
                {id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', permalink: '/r/subreddit1/1a/link_info_here', author: 'author1', numComments: 10},
                {id: '2b', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2', permalink: '/r/subreddit1/1a/link_info_here', author: 'author2', numComments: 11},
                {id: '3c', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3', permalink: '/r/subreddit1/1a/link_info_here', author: 'author3', numComments: 12},
        ];
        mockState(testFeed, null);
        useParams.mockReturnValue({id: '1a'});
        //action
        const { rerender } = render(<PostPage />); // Get rerender to update props without full unmount
        //assert 
        await waitFor(() => {
            //Check the parent post details are still there
            expect(screen.getByRole('button', {name: /Back to Home Page/i})).toBeInTheDocument();
            expect(screen.getByText(/title1/i)).toBeInTheDocument();
            expect(screen.getByRole('img', {name: /title1/i})).toBeInTheDocument();
            expect(screen.getByText('Author: author1')).toBeInTheDocument();
            expect(screen.getByText(/Comments: 10/i)).toBeInTheDocument();
        })
    });

    it('renders the component with post properties when feed not empty', () => {
        //arrange
        const testFeed = [
                {id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', permalink: '/r/subreddit1/1a/link_info_here', author: 'author1', numComments: 10},
                {id: '2b', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2', permalink: '/r/subreddit1/1a/link_info_here', author: 'author2', numComments: 11},
                {id: '3c', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3', permalink: '/r/subreddit1/1a/link_info_here', author: 'author3', numComments: 12},
        ];
        const testComments = [
            {subreddit: 'subreddit1', subreddit_name_prefixed: 'r/subreddit1', name: 't1_1a2b', ups: 10, downs: 5, score: 5, subreddit_id: 't5_3c2b', id: '1a2b3c', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body: 'This is the first comment', body_html: 'This is the first comment HTML'},
            {subreddit: 'subreddit1', subreddit_name_prefixed: 'r/subreddit1', name: 't1_1a3c', ups: 10, downs: 5, score: 5, subreddit_id: 't5_3c2b', id: '1a2b4d', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body: 'This is the second comment', body_html: 'This is the second comment HTML'},
            {subreddit: 'subreddit1', subreddit_name_prefixed: 'r/subreddit1', name: 't1_1a4d', ups: 10, downs: 5, score: 5, subreddit_id: 't5_3c2b', id: '1a2be5', parent_id: "t3_1a", permalink: '/r/subreddit1/1a/link_info_here', body: 'This is the third comment', body_html: 'This is the third comment HTML'}
        ]
        mockState(testFeed, testComments);
        useParams.mockReturnValue({id: '1a'});
        //action
        render(<PostPage />);
        const backButton = screen.getByRole('button', {name: /Back to Home Page/i});
        const titleText = screen.getByText(/title1/i);
        const img = screen.getByRole('img', {name: /title1/i});
        const authorText = screen.getByText('Author: author1');
        const numberComments = screen.getByText(/Comments: 10/i);
        const comment1 = screen.getByText(/This is the first comment/i);
        const comment2 = screen.getByText(/This is the second comment/i);
        const comment3 = screen.getByText(/This is the third comment/i);    
        //assert
        expect(backButton).toBeInTheDocument();
        expect(titleText).toBeInTheDocument();
        expect(authorText).toBeInTheDocument();
        expect(numberComments).toBeInTheDocument();
        expect(img).toBeInTheDocument();
        expect(comment1).toBeInTheDocument();
        expect(comment2).toBeInTheDocument();
        expect(comment3).toBeInTheDocument();
    });

    it('shows loading message and then error message for comment when comments load and then error', async () => {
        //arrange
        const postId = '1a'
        const expectedPermalink = `/r/subreddit1/${postId}/link_info_here`;
        const selectedPost = [{id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', permalink: expectedPermalink, author: 'author1', numComments: 10}];
        const testFeed = selectedPost;
        //Mock initial State
        mockState(testFeed, [], false, false);
        useParams.mockReturnValue({id: postId});
        const { rerender } = render(<PostPage />);
        //assert
        //Simulate pending state
        await waitFor(() => {
            expect(mockDispatch).toHaveBeenCalledWith(redditApi.getSubredditPostComments(expectedPermalink));
            expect(redditApi.getSubredditPostComments).toHaveBeenCalledWith(expectedPermalink);
        })
        mockState(testFeed, [], true, false);
        rerender(<PostPage />);
        await waitFor(() => {
            expect(screen.getByText(/Your comments will be ready in just a min\.\.\./i)).toBeInTheDocument();
        })
        //Simulate rejected state
        mockState(testFeed, [], false, true);
        rerender(<PostPage />);
        await waitFor(() => {
            expect(screen.getByText(/Oops seems to be an issue with your comments loading! Try again later\./i)).toBeInTheDocument();
            expect(screen.queryByText(/Your comments will be ready in just a min\.\.\./i)).not.toBeInTheDocument();
        })
        //Check other components loaded correctly
        const backButton = screen.getByRole('button', {name: /Back to Home Page/i});
        const titleText = screen.getByText(/title1/i);
        const authorText = screen.getByText('Author: author1');
        const numberComments = screen.getByText(/Comments: 10/i);
        const img = screen.getByRole('img', {name: /title1/i});
        expect(backButton).toBeInTheDocument();
        expect(titleText).toBeInTheDocument();
        expect(authorText).toBeInTheDocument();
        expect(numberComments).toBeInTheDocument();
        expect(img).toBeInTheDocument();
        expect(screen.queryByText(/This is the first comment/i)).not.toBeInTheDocument();
    });

    it('renders a feed loading message while loading and error message when errors', async () => {
        //arrange
        const postId = '1a'
        mockState([], [], false, false, true, false);
        useParams.mockReturnValue({id: postId});
        const { rerender } = render(<PostPage />);
        const backButton = screen.getByRole('button', {name: /Back to Home Page/i})
        expect(backButton).toBeInTheDocument();
        expect(screen.getByText(/Please wait while this post loads\.\.\./i)).toBeInTheDocument();
        //Simulate rejected state
        mockState([], [], false, false, false, true);
        rerender(<PostPage />);
        await waitFor(() => {
            expect(screen.getByText(/Oopsie seems to be a little error causing mischief here\. Try again later is you wanna\./i)).toBeInTheDocument();
            expect(screen.queryByText(/Please wait while this post loads\.\.\./i)).not.toBeInTheDocument();
            expect(backButton).toBeInTheDocument();
        })
    })

    it('renders only the button when feed empty', () => {
        //arrange
        const testFeed = [];
        mockState(testFeed);
        useParams.mockReturnValue({id: '1a'});
        //action
        render(<PostPage />);
        const backButton = screen.getByRole('button', {name: /Back to Home Page/i});        
        //assert
        expect(backButton).toBeInTheDocument();
        expect(screen.getByText(/Oopsie seems to be a little error causing mischief here. Try again later is you wanna./i)).toBeInTheDocument();
        expect(screen.queryByText('title1')).not.toBeInTheDocument();
        expect(screen.queryByText('1a')).not.toBeInTheDocument();
        expect(screen.queryByText('subredditNamePrefixed1')).not.toBeInTheDocument();
        expect(screen.queryByAltText(/title1/i)).not.toBeInTheDocument();
    });

    it('pressing the back button triggers the useNavigate call', async () => {
                //arrange
        const testFeed = [
                {id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', permalink: '/r/subreddit1/1a/link_info_here', author: 'author1', numComments: 10},
                {id: '2b', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2', permalink: '/r/subreddit1/1a/link_info_here', author: 'author2', numComments: 11},
                {id: '3c', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3', permalink: '/r/subreddit1/1a/link_info_here', author: 'author3', numComments: 12},
        ];
        mockState(testFeed);
        useParams.mockReturnValue({id: '1a'});
        //action
        render(<PostPage />);
        const backButton = screen.getByRole('button', {name: /Back to Home Page/i});
        await userEvent.click(backButton);
        //assert
        expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    });
});