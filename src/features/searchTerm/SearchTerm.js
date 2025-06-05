import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import { } from './homePageSlice';
//import styles from './Counter.module.css';
import { setSearchTerm, clearSearchTerm } from './searchTermSlice';


export function SearchTerm() {
    const dispatch = useDispatch();
    const [searchValue, setSearchValue] = useState("");
    const handleSearchClick = (e) => {
        e.preventDefault();
        if (searchValue.length === 0) {
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
                <input id ="searchBar" type="text" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} />
                <button onClick={handleSearchClick}>Search</button>
                <button onClick={handleClearSearchClick}>Clear</button>
            </form>
        </>
    )
}






