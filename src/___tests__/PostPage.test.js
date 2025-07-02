import { PostPage } from '../features/post/PostPage';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useSelector } from 'react-redux';
import { useParams , useNavigate } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

const mockNavigateFunction = jest.fn();
//Mock useSelector, useParams and useNavigate
jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));
jest.mock('react-router-dom', () => ({
    //...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useNavigate: () => mockNavigateFunction
}));

describe('PostPage component', () => {
    beforeEach(() => {
        jest.clearAllMocks(); //clears any previous calls or mock implementations on the action creator mocks
        mockNavigateFunction.mockClear();
    })
    
    //Tell the mocked useSelector what to return. selectorFn represents the arg it will receive in this case will be the state: (state) => state.reddit.feed
    //Helper to set up common mock state for useSelector
    const mockState = (redditFeed = []) => {
        useSelector.mockImplementation((selectorFn) => selectorFn({
            filter: '',
            searchTerm: '',
            reddit: {
                feed: redditFeed,
                list: [],
                feedIsLoading: false,
                feedHasError: false,
                listIsLoading: false,
                listHasError: false
            }
        }))
    };

    it('renders the component with post properties when feed not empty', () => {
        //arrange
        const testFeed = [
                {id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1'},
                {id: '2b', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2'},
                {id: '3c', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3'},
        ];
        mockState(testFeed);
        useParams.mockReturnValue({id: '1a'});
        //action
        render(<PostPage />);
        const backButton = screen.getByRole('button', {name: /Back to Home Page/i});
        const titleText = screen.getByText(/title1/i);
        const idText = screen.getByText(/1a/i);
        const category = screen.getByText(/subredditNamePrefixed1/i);
        const img = screen.getByRole('img', {name: /title1/i});        
        //assert
        expect(backButton).toBeInTheDocument();
        expect(titleText).toBeInTheDocument();
        expect(idText).toBeInTheDocument();
        expect(category).toBeInTheDocument();
        expect(img).toBeInTheDocument();
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
        expect(screen.queryByText('title1')).not.toBeInTheDocument();
        expect(screen.queryByText('1a')).not.toBeInTheDocument();
        expect(screen.queryByText('subredditNamePrefixed1')).not.toBeInTheDocument();
        expect(screen.queryByAltText(/title1/i)).not.toBeInTheDocument();
    })

    it('pressing the back button triggers the useNavigate call', async () => {
        //arrange
        const testFeed = [
                {id: '1a', title: 'title1', subredditNamePrefixed: 'subredditNamePrefixed1', preview: 'preview1', subredditId: 'subredditId1', url: 'url1'},
                {id: '2b', title: 'title2', subredditNamePrefixed: 'subredditNamePrefixed2', preview: 'preview2', subredditId: 'subredditId2', url: 'url2'},
                {id: '3c', title: 'title3', subredditNamePrefixed: 'subredditNamePrefixed3', preview: 'preview3', subredditId: 'subredditId3', url: 'url3'},
        ];
        mockState(testFeed);
        useParams.mockReturnValue({id: '1a'});
        //action
        render(<PostPage />);
        const backButton = screen.getByRole('button', {name: /Back to Home Page/i});
        await userEvent.click(backButton);
        //assert
        expect(mockNavigateFunction).toHaveBeenCalledTimes(1);
    })
});