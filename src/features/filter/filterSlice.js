import { createSlice } from '@reduxjs/toolkit';

export const filterSlice = createSlice({
    name: 'filter',
    initialState: '',
    reducers: {
        setFilter: (state, action) => {
            return action.payload.value;
        }
    }
})

export default filterSlice.reducer;
export const {setFilter} = filterSlice.actions;