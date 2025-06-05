import filterReducer, {
    setFilter
} from '../features/filter/filterSlice.js';


//DON'T NEED TEST THIS HERE - TEST THE STORE ITSELF
// it("should return the initial state", () => {
//     //arrange
//     const expectedInitialState = '';
//     //act
//     //assert
//     expect(initialState).toEqual(expectedInitialState);
// });

it("should set the filter value", () => {
    //arrange
    const previousState = '';
    const filterValue = "Filter Value";
    //act
    //assert
    expect(filterReducer(previousState, setFilter({value: filterValue}))).toEqual(filterValue);
});


//Additional values? What if selects the default