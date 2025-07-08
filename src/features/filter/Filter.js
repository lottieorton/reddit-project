import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from './filterSlice.js';
import { getSubredditPosts } from '../../api/reddit.js';
import styles from './Filter.module.css';

export function Filter() {
    const dispatch = useDispatch();
    const [filterCategory, setFilterCategory] = useState("");
    const handleChange = (e) => {
        //e.preventDefault();
        setFilterCategory(e.target.value);
        dispatch(setFilter({value: e.target.value}));
        const subredditFilter = `/r/${e.target.value}/`;
        dispatch(getSubredditPosts(subredditFilter));
    }

    const filterList = useSelector((state) => state.reddit.list);
    //Removes the double return of pics as I manually add this in as the default value
    const filteredList = filterList.filter((item) => {
        return item.displayName !== 'pics'
    });

    return  (
        <>
            <form className={styles.FilterForm}>
                <label htmlFor="filterSearch" className={styles.FilterLabel}>Subreddit: </label>
                <select id ="filterSearch" onChange={handleChange} value={filterCategory} className={styles.FilterDropdown}>
                    <option key={"a"} value={"pics"}>pics</option>
                    {filteredList.map((filterOption, index) => {
                        const {displayName, title} = filterOption;
                        return <option key={index} value={displayName}>{displayName}</option>
                    })}
                </select>
            </form>
        </>
    )
}

//<label htmlFor="filterSearch" >Filter category: </label>
//<option key={"a"} value={"pics"}>Filter...</option>