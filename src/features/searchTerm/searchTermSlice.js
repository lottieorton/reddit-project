import { createSlice } from '@reduxjs/toolkit';

export const searchTermSlice = createSlice({
    name: 'searchTerm',
    initialState: '',
    reducers: {
        setSearchTerm: (state, action) => {
            return action.payload.value;
        },
        clearSearchTerm: (state) => {
            return '';
        }
    }
})

export default searchTermSlice.reducer;
export const {setSearchTerm, clearSearchTerm} = searchTermSlice.actions;