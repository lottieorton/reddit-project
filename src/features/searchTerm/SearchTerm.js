import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setSearchTerm, clearSearchTerm } from './searchTermSlice.js';
import styles from './SearchTerm.module.css';
import searchIcon from '../../imgs/search_icon.png';
import clearSearchIcon from '../../imgs/clear_search_icon.png';


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
            <form className={styles.SearchBarForm}>
                <input id="searchBar" className={styles.SearchBarInput} name="searchBar" type="text" value={searchValue} placeholder="Search" aria-label="Search posts" onChange={(e) => setSearchValue(e.target.value)} />
                <img src={searchIcon} className={styles.searchIcons} onClick={handleSearchClick} alt='Search button' />
                <img src={clearSearchIcon} className={styles.searchIcons} onClick={handleClearSearchClick} alt='Clear Search button' />
            </form>
        </>
    )
}