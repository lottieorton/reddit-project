import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from './filterSlice.js';
import { getSubredditPosts } from '../../api/reddit.js';
//import { } from './homePageSlice';
//import styles from './Counter.module.css';

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

    return  (
        <>
            <form>
                <label htmlFor="filterSearch" >Filter category: </label>
                <select id ="filterSearch" onChange={handleChange} value={filterCategory}>
                    <option key={"a"} value={"pics"}>Filter...</option>
                    {filterList.map((filterOption, index) => {
                        const {displayName, title} = filterOption;
                        return <option key={index} value={displayName}>{displayName}</option>
                    })}
                </select>
            </form>
        </>
    )
}