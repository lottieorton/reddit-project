import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setFilter } from './filterSlice'
//import { } from './homePageSlice';
//import styles from './Counter.module.css';

export function Filter() {
    const dispatch = useDispatch();
    const [filterCategory, setFilterCategory] = useState("");
    const handleChange = (e) => {
        //e.preventDefault();
        setFilterCategory(e.target.value);
        dispatch(setFilter({value: e.target.value}));
    }

    return  (
        <>
            <form>
                <label htmlFor="filterSearch" >Filter category: </label>
                <select id ="filterSearch" onChange={handleChange} value={filterCategory}>
                    <option value="">Filter...</option>
                    <option value="funny">Funny</option>
                    <option value="serious">Serious</option>
                </select>
            </form>
        </>
    )
}