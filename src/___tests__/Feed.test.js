import { Feed } from '../features/Feed/Feed.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';

//Mock useSelector
jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));
//Mock the imported components
jest.mock('../features/searchTerm/SearchTerm.js', () => ({
    SearchTerm: () => <div data-testid="mockSearchTerm">MockSearchTerm</div>
}));
jest.mock('../features/filter/Filter.js', () => ({
    Filter: () => <div data-testid="mockFilter">MockFilter</div>
}));
jest.mock('../features/post/Post.js', () => ({
    Post: ({id, category, title, url}) => (
        <div data-testid={`mock-post-${id}`}>
            <h3>{title}</h3>
            <h4>{category}</h4>
            <img src={url} />
        </div>
    )
}));

describe('Feed component', () => {

    beforeEach(() => {
        jest.clearAllMocks(); //clears any previous calls or mock implementations on the action creator mocks
    })
    
    //Tell the mocked useSelector what to return. selectorFn represents the arg it will receive in this case will be the state: (state) => state.reddit.feed
    //Helper to set up common mock state for useSelector
    const mockState = (redditFeed = [], searchValue = '', redditList = [], feedIsLoading = false, feedHasError = false, listIsLoading = false, listHasError = false) => {
        useSelector.mockImplementation((selectorFn) => selectorFn({
            filter: '',
            searchTerm: searchValue,
            reddit: {
                feed: redditFeed,
                list: redditList,
                comments: [],
                feedIsLoading: feedIsLoading,
                feedHasError: feedHasError,
                listIsLoading: listIsLoading,
                listHasError: listHasError,
                commentsIsLoading: false,
                commentsHasError: false
            }
        }))
    };

    it('check searchedFeed, correctly filters the returned feed with the searchTerm', async () => {
        //arrange
        const feedReturned = [
                {id: '1', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', subreddit: 'subreddit1', permalink: '/r/subreddit1/1a/link_info_here', author: 'author1', numComments: 10},
                {id: '2', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2', subreddit: 'subreddit2', permalink: '/r/subreddit1/1a/link_info_here', author: 'author2', numComments: 11},
                {id: '3', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3', subreddit: 'subreddit3', permalink: '/r/subreddit1/1a/link_info_here', author: 'author3', numComments: 12},
            ];
        mockState(feedReturned, 'Title1');
        //action
        render(<Feed />);
        //assert
        expect(screen.getByText('title1')).toBeInTheDocument();
        expect(screen.queryByText('title2')).not.toBeInTheDocument();
        expect(screen.queryByText('title3')).not.toBeInTheDocument();
    });

    it('check feed, correctly pulls through if no searchValue', async () => {
        //arrange
        const feedReturned = [
                {id: '1', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1', subreddit: 'subreddit1', permalink: '/r/subreddit1/1a/link_info_here', author: 'author1', numComments: 10},
                {id: '2', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2', subreddit: 'subreddit2', permalink: '/r/subreddit1/1a/link_info_here', author: 'author2', numComments: 11},
                {id: '3', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3', subreddit: 'subreddit3', permalink: '/r/subreddit1/1a/link_info_here', author: 'author3', numComments: 12},
            ];
        mockState(feedReturned);
        //action
        render(<Feed />);
        //assert
        expect(screen.getByText('title1')).toBeInTheDocument();
        expect(screen.getByText('title2')).toBeInTheDocument();
        expect(screen.getByText('title3')).toBeInTheDocument();
    });

    it('renders the searchTerm and filter components', async () => {
        //arrange
        const listReturned = [
            {title: 'title1', displayName: 'display_name1'},
            {title: 'title2', displayName: 'display_name2'}
        ];
        mockState([], '', listReturned);
        //action
        render(<Feed />);
        const searchBar = screen.getByTestId('mockSearchTerm');
        const filterDropDown = screen.getByTestId('mockFilter');
        //assert
        expect(searchBar).toBeInTheDocument();
        expect(filterDropDown).toBeInTheDocument();
    });

    it('renders a loading message for feed call pending', async () => {
        //arrange
        //Mimic loading state
        mockState([], '', [], true, false, false, false);
        //action
        render(<Feed />);
        const searchBar = screen.getByTestId('mockSearchTerm');
        const filterDropDown = screen.getByTestId('mockFilter');
        expect(screen.getByText(/Please wait while this loads\.\.\./i)).toBeInTheDocument();
        //assert
        expect(searchBar).toBeInTheDocument();
        expect(filterDropDown).toBeInTheDocument();      
    });

    it('renders an error message for feed call rejecting', async () => {
        //arrange
        //Mimic loading state
        mockState([], '', [], true, false, false, false);
        //action
        const {rerender} = render(<Feed />);
        const searchBar = screen.getByTestId('mockSearchTerm');
        const filterDropDown = screen.getByTestId('mockFilter');
        expect(screen.getByText(/Please wait while this loads\.\.\./i)).toBeInTheDocument();
        expect(searchBar).toBeInTheDocument();
        expect(filterDropDown).toBeInTheDocument();  
        //Mimic error state
        mockState([], '', [], false, true, false, false);
        rerender(<Feed />);
        expect(screen.getByText(/Oops\.\.\. something went wrong\. Please try again later/i));
        expect(screen.queryByText(/Please wait while this loads\.\.\./i)).not.toBeInTheDocument();
        //assert
        expect(searchBar).not.toBeInTheDocument();
        expect(filterDropDown).not.toBeInTheDocument();      
    });

    it('renders a loading message for list call pending', async () => {
        //arrange
        //Mimic loading state
        mockState([], '', [], false, false, true, false);
        //action
        render(<Feed />);
        const searchBar = screen.getByTestId('mockSearchTerm');
        expect(screen.queryByTestId('mockFilter')).not.toBeInTheDocument();
        //assert
        expect(searchBar).toBeInTheDocument();    
    });

    it('renders an error message for list call pending', async () => {
        //arrange
        //Mimic loading state
        mockState([], '', [], false, false, true, false);
        //action
        const {rerender} = render(<Feed />);
        const searchBar = screen.getByTestId('mockSearchTerm');
        expect(screen.queryByTestId('mockFilter')).not.toBeInTheDocument();
        expect(searchBar).toBeInTheDocument(); 
        //Mimic rejected state
        mockState([], '', [], false, false, false, true);
        rerender(<Feed />);
        expect(screen.getByText(/Oops\.\.\. something went wrong\. Please try again later/i)).toBeInTheDocument();
        expect(screen.queryByTestId('mockFilter')).not.toBeInTheDocument();
        //assert
        expect(searchBar).not.toBeInTheDocument();    
    });
})