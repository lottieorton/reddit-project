import { Feed } from '../features/Feed/Feed.js';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';
import * as redditApi from '../api/reddit.js';

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

    it('check searchedFeed, correctly filters the returned feed with the searchTerm', async () => {
        //arrange
        const feedReturned = [
                {id: '1', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1'},
                {id: '2', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2'},
                {id: '3', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3'},
            ];
        mockState(feedReturned, 'Title1');
        //action
        render(<Feed />);
        //assert
        expect(screen.getByText('title1')).toBeInTheDocument;
        expect(screen.queryByText('title2')).not.toBeInTheDocument();
        expect(screen.queryByText('title3')).not.toBeInTheDocument();
    });

    it('check feed, correctly pulls through if no searchValue', async () => {
        //arrange
        const feedReturned = [
                {id: '1', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1'},
                {id: '2', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2'},
                {id: '3', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3'},
            ];
        mockState(feedReturned);
        //action
        render(<Feed />);
        //assert
        expect(screen.getByText('title1')).toBeInTheDocument;
        expect(screen.getByText('title2')).toBeInTheDocument;
        expect(screen.getByText('title3')).toBeInTheDocument;
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
        expect(searchBar).toBeInTheDocument;
        expect(filterDropDown).toBeInTheDocument;
    })
})