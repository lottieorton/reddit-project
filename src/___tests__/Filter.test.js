import { Filter } from '../features/filter/Filter.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch , useSelector } from 'react-redux';
import userEvent from '@testing-library/user-event';
import { setFilter } from '../features/filter/filterSlice.js';
import { getSubredditPosts } from '../api/reddit.js';

//Mock useDispatch and useSelector
jest.mock('react-redux', () => ({
    useDispatch: jest.fn(),
    useSelector: jest.fn()
}));
//Mock action creators
jest.mock('../features/filter/filterSlice.js', () => ({
    setFilter: jest.fn()
}));
jest.mock('../api/reddit.js', () => ({
    getSubredditPosts: jest.fn()
}));


describe('Filter component', () => {
    let user;
    let mockDispatch;

    beforeEach(() => {
        user = userEvent.setup(); //creates an instance of the user event library, refreshed before each test. setup() means that methods called on this user instance share device state, therefore can use in replicating multi-step interactions, without userEvents are treated as individual events 
        mockDispatch = jest.fn(); //creates a new Jest mock function, ensures call count and arguments are reset for each test
        useDispatch.mockReturnValue(mockDispatch); //configures the mocked useDispatch to return our mockDispatch function
        useSelector.mockClear(); //clears any previous calls or mock implementations on the action creator mocks
        getSubredditPosts.mockClear();
        setFilter.mockClear(); 
    })

    //Tell the mocked useSelector what to return. selectorFn represents the arg it will receive in this case will be the state: (state) => state.reddit.list
    //Helper to set up common mock state for useSelector
    const mockInitialState = (currentCategory = "pics", filterOptions = []) => {
        useSelector.mockImplementation((selectorFn) => selectorFn({
            filter: currentCategory,
            reddit: {
                list: filterOptions
            }
        }))
    };
    
    it('renders the filter label and dropdown correctly with default filter value and dropdown values', () => {
        //arrange
        const mockFilterListData = [
            {displayName: 'displayName1', title: 'title1'},
            {displayName: 'displayName2', title: 'title2'},
            {displayName: 'displayName3', title: 'title3'}
        ];
        mockInitialState("pics", mockFilterListData); //Set the initial state for this test
        render(<Filter />);
        const filterBox = screen.getByRole('combobox', {name: /filter category:/i});
        const filterLabel = screen.getByText(/filter category:/i);
        const filterDropdown = screen.getByLabelText(/filter category:/i);
        const filterDefaultValue = screen.getByRole('option', { name: /filter\.\.\./i });
        const filterDropdownValue1 = screen.getByRole('option', { name: 'displayName1' });
        const filterDropdownValue2 = screen.getByRole('option', { name: 'displayName2' });
        const filterDropdownValue3 = screen.getByRole('option', { name: 'displayName3' });
        //assert
        //Expect it to render the filter label and dropdown element
        expect(filterLabel).toBeInTheDocument();
        expect(filterDropdown).toBeInTheDocument();
        expect(filterBox).toBeInTheDocument;
        //Expect it to render the default text 'Filter...'
        expect(filterDefaultValue).toBeInTheDocument();
        expect(filterBox).toHaveValue('pics');
        //Expect the list options to be present in the dropdown
        expect(filterDropdownValue1).toBeInTheDocument();
        expect(filterDropdownValue2).toBeInTheDocument();
        expect(filterDropdownValue3).toBeInTheDocument();
    });

    it('setFilter and getSubredditPosts dispatched and setFilterCategory actioned on filter selection', async () => {
        //arrange
        const mockFilterListData = [
            {displayName: 'displayName1', title: 'title1'},
            {displayName: 'displayName2', title: 'title2'},
            {displayName: 'displayName3', title: 'title3'}
        ];
        mockInitialState("pics", mockFilterListData); //Set the initial state for this test
        render(<Filter />);
        const filterBox = screen.getByRole('combobox', {name: /filter category:/i});
        const filterValue = {value: 'displayName1'};
        const subredditURLExtension = `/r/displayName1/`;
        expect(filterBox).toHaveValue('pics');
        //action
        await user.selectOptions(filterBox, 'displayName1')
        //assert
        //Expect the select's value to have changed -- tests the effect of setFilterCategory
        expect(filterBox).toHaveValue('displayName1');
        //Expect setFilter and getSubreddit posts to have been called with correct values
        expect(setFilter).toHaveBeenCalledWith(filterValue);
        expect(getSubredditPosts).toHaveBeenCalledWith(subredditURLExtension);
        //Expect useDispatch to have been called with filter values x2
        expect(useDispatch).toHaveBeenCalledTimes(2);
        expect(mockDispatch).toHaveBeenCalledWith(setFilter(filterValue));
        expect(mockDispatch).toHaveBeenCalledWith(getSubredditPosts(subredditURLExtension));
    });

    it('resets filterCategory state to default `pics` when `Filter...` selected', async () => {
        //arrange
        const mockFilterListData = [
            {displayName: 'displayName1', title: 'title1'},
            {displayName: 'displayName2', title: 'title2'},
            {displayName: 'displayName3', title: 'title3'}
        ];
        mockInitialState("pics", mockFilterListData); //Set the initial state for this test
        render(<Filter />);
        const filterBox = screen.getByRole('combobox', {name: /filter category:/i});
        expect(filterBox).toHaveValue('pics');   
        //action
        await user.selectOptions(filterBox, 'displayName1');
        expect(filterBox).toHaveValue('displayName1');
        await user.selectOptions(filterBox, 'pics');
        //assert
        //Expect the select's value to have changed back to original
        expect(filterBox).toHaveValue('pics');
        //Expect setFilter and getSubreddit posts to have been called with correct values
        expect(setFilter).toHaveBeenCalledTimes(2);
        expect(getSubredditPosts).toHaveBeenCalledTimes(2);
        expect(setFilter).toHaveBeenCalledWith({value: 'pics'});
        expect(getSubredditPosts).toHaveBeenCalledWith(`/r/pics/`);
        //Expect useDispatch to have been called with filter values x2
        expect(mockDispatch).toHaveBeenCalledTimes(4);
        expect(mockDispatch).toHaveBeenCalledWith(setFilter({value: 'displayName1'}));
        expect(mockDispatch).toHaveBeenCalledWith(getSubredditPosts(`/r/displayName1/`));
        expect(mockDispatch).toHaveBeenCalledWith(setFilter({value: 'pics'}));
        expect(mockDispatch).toHaveBeenCalledWith(getSubredditPosts(`/r/pics/`));
    });
})   