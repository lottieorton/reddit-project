import { createSlice } from '@reduxjs/toolkit';

export const searchTermSlice = createSlice({
    name: 'searchTerm',
    initialState: '',
    reducers: {
        setSearchTerm: (state, action) => {
            // state = action.payload.value;
            // return state;
            return action.payload.value;
        },
        clearSearchTerm: (state) => {
            return '';
        }
    }
})

export default searchTermSlice.reducer;
export const {setSearchTerm} = searchTermSlice.actions;