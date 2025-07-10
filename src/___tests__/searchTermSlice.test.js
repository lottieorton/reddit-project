import searchTermReducer, {
    setSearchTerm, 
    clearSearchTerm
} from '../features/searchTerm/searchTermSlice.js';

describe('searchTermSlice', () => {
    const initialState = '';

    it('should check the initial state', () => {
        expect(searchTermReducer(undefined, {type: 'UNKNOWN_ACTION'})).toEqual(initialState); //calling reducer with undefined state and unknown action should return the initial state 
    });

    it("should set the searchterm", () => {
        //arrange
        const previousState = '';
        const searchTerm = "hello";
        //act
        const action = setSearchTerm({value: searchTerm});
        const newState = searchTermReducer(previousState, action);
        //assert
        expect(newState).toEqual(searchTerm);
    });

    it("should clear the searchterm", () => {
        //arrange
        const previousState = 'hello';
        const expectedState = '';
        //act
        const action = clearSearchTerm();
        const newState = searchTermReducer(previousState, action);
        //assert
        expect(newState).toEqual(expectedState);
    });
})
