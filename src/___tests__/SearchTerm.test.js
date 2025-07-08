import { SearchTerm } from '../features/searchTerm/SearchTerm.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { setSearchTerm, clearSearchTerm } from '../features/searchTerm/searchTermSlice.js';

//Mock the Redux useDispatch -- combines the two steps creating mock fctn and replacing real function
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
}));
//Mock the action creators
jest.mock('../features/searchTerm/searchTermSlice.js', () => ({
  setSearchTerm: jest.fn(),
  clearSearchTerm: jest.fn(),
}));

describe('SearchTerm Component', () => {
    let user;
    let mockDispatch;
    const originalReload = window.location.reload; //the original reload function, to allow clean up after tests

    //beforeAll and afterAll are all for monitoring page refreshes
    beforeAll(() => {
        //Mock window.location.reload, need to use this method as window.location is a special read-only object 
        Object.defineProperty(window, 'location', {
            configurable: true, // Allows the property to be redefined
            value: {
                ...window.location, // Keep other properties of window.location
                reload: jest.fn(),  // Replace reload with a Jest mock function
            },
        });
    });

    afterAll(() => {
    // Restore the original window.location.reload after all tests
        Object.defineProperty(window, 'location', {
            configurable: true,
            value: {
                ...window.location,
                reload: originalReload,
            },
        });
    });

    beforeEach(() => {
        // Reset mocks before each test
        user = userEvent.setup(); //creates an instance of the user event library, refreshed before each test. setup() means that methods called on this user instance share device state, therefore can use in replicating multi-step interactions, without userEvents are treated as individual events 
        mockDispatch = jest.fn(); //creates a new Jest mock function, ensures call count and arguments are reset for each test
        useDispatch.mockReturnValue(mockDispatch); //configures the mocked useDispatch to return our mockDispatch function
        setSearchTerm.mockClear(); //clears any previous calls or mock implementations on the action creator mocks
        clearSearchTerm.mockClear();
        window.location.reload.mockClear(); //reset's the mock's call count before each test
    });

    it('renders the search input and buttons correctly', () => {
        //arrange
        render(<SearchTerm />);
        const searchText = screen.getByPlaceholderText(/search/i);
        const searchInput = screen.getByLabelText('Search posts');
        const searchButton = screen.getByRole('img', { name: 'Search button' });
        const clearButton = screen.getByRole('img', {name: 'Clear Search button' });
        //assert
        expect(searchText).toBeInTheDocument();
        //expect(screen.getByLabelText(/search:/i)).toBeInTheDocument();
        expect(searchInput).toBeInTheDocument();
        expect(searchButton).toBeInTheDocument();
        expect(clearButton).toBeInTheDocument();
    });

    it('updates input value on change', async () => {
        //arrange
        render(<SearchTerm />);
        const searchInput = screen.getByLabelText('Search posts');
        const expectedOutputValue = 'hello world'
        //act
        await user.type(searchInput, 'hello world');
        //assert
        expect(searchInput).toHaveValue(expectedOutputValue);
    });

    it('dispatches setSearchTerm action on "Search" button click with non-empty input', async () => {
        //arrange
        render(<SearchTerm />);
        const searchInput = screen.getByLabelText('Search posts');
        const searchButton = screen.getByRole('img', { name: 'Search button' });
        const expectedCalledValue = {value: 'hello'};
        //action
        await user.type(searchInput, 'hello');
        await user.click(searchButton);
        //assert
        //Expect page not to have refreshed
        expect(window.location.reload).not.toHaveBeenCalled();
        //Expect setSearchTerm to have been called with the correct payload
        expect(setSearchTerm).toHaveBeenCalledWith(expectedCalledValue)
        //Expect useDispatch to have been called with search input
        expect(mockDispatch).toHaveBeenCalledWith(setSearchTerm(expectedCalledValue));
    });

    it('dispatches clearSearchTerm action on "Search" button click with empty input', async () => {
        //arrange
        render(<SearchTerm />);
        const searchInput = screen.getByLabelText('Search posts');
        const searchButton = screen.getByRole('img', { name: 'Search button' });
        //action
        await user.clear(searchInput);
        await user.click(searchButton);
        //assert
        //Expect page not to have refreshed
        expect(window.location.reload).not.toHaveBeenCalled();
        //Expect clearSearchTerm to have been called
        expect(clearSearchTerm).toHaveBeenCalledTimes(1);
        expect(clearSearchTerm).toHaveBeenCalledWith();
        //Expect useDispatch to have been called
        expect(mockDispatch).toHaveBeenCalledWith(clearSearchTerm());
    })

    it('clears input and dispatches clearSearchTerm when clear button is clicked', async () => {
        //arrange
        render(<SearchTerm />);
        const searchInput = screen.getByLabelText('Search posts');
        const clearButton = screen.getByRole('img', {name: 'Clear Search button' });
        //action
        await user.type(searchInput, 'heya');
        expect(searchInput).toHaveValue('heya');
        await user.click(clearButton);
        //assert
        //Expect page not to have refreshed
        expect(window.location.reload).not.toHaveBeenCalled();
        //Expect input to have cleared
        expect(searchInput).toHaveValue('');
        //Expect clearSearchTerm to have been called
        expect(clearSearchTerm).toHaveBeenCalledTimes(1);
        //Expect useDispatch to have been called
        expect(mockDispatch).toHaveBeenCalledWith(clearSearchTerm());

    })
 })