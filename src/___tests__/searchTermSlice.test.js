import searchTermReducer, {
    setSearchTerm, 
    clearSearchTerm,
    initialState
} from '../features/searchTerm/searchTermSlice.js';


//DON'T NEED TEST THIS HERE - TEST THE STORE ITSELF
// it("should return the initial state", () => {
//     //arrange
//     const expectedInitialState = '';
//     //act
//     //assert
//     expect(initialState).toEqual(expectedInitialState);
// });

it("should set the searchterm", () => {
    //arrange
    const previousState = '';
    const searchTerm = "hello";
    //act
    //assert
    expect(searchTermReducer(previousState, setSearchTerm({value: searchTerm}))).toEqual(searchTerm);
});

it("should clear the searchterm", () => {
    //arrange
    const previousState = 'hello';
    const expectedState = '';
    //act
    //assert
    expect(searchTermReducer(previousState, clearSearchTerm())).toEqual(expectedState);
});

//Additional values? What if searchterm blank? This already covered when this is implemented in diff file with if