import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import styles from './Counter.module.css';
import { setSearchTerm, clearSearchTerm } from './searchTermSlice.js';


export function SearchTerm() {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const handleSearchClick = (e) => {
        e.preventDefault();
        if (searchValue.length === 0) {
            dispatch(clearSearchTerm());
            return;
        }
        dispatch(setSearchTerm({value: searchValue}));
    }
    const handleClearSearchClick = (e) => {
        e.preventDefault();
        setSearchValue('');
        dispatch(clearSearchTerm());
    }

    return  (
        <>
            <form>
                <label htmlFor="searchBar" >Search: </label>
                <input id ="searchBar" name="searchBar" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <button onClick={handleSearchClick}>Search</button>
                <button onClick={handleClearSearchClick}>Clear</button>
            </form>
        </>
    )
}