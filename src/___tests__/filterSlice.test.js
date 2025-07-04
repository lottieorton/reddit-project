import filterReducer, {
    setFilter
} from '../features/filter/filterSlice.js';

describe('filterReducer', () => {
    const initialState = '';
    
    it('should check the initial state', () => {
        expect(filterReducer(undefined, {type: 'UNKNOWN_ACTION'})).toEqual(initialState); //calling reducer with undefined state and unknown action should return the initial state 
    })
    
    it("should set the filter value", () => {
        //arrange
        const previousState = '';
        const filterValue = "Filter Value";
        //act
        const action = setFilter({value: filterValue});
        const newState = filterReducer(previousState, action);
        //assert
        expect(newState).toEqual(filterValue);
    });
});
