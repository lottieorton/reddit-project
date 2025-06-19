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
                    <option value="">Filter...</option>
                    {filterList.map(filterOption => {
                        const {display_name, title} = filterOption;
                        return <option value={display_name}>{display_name}</option>
                    })}
                </select>
            </form>
        </>
    )
}