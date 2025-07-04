import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
//import { Post } from '../post/Post.js';
import { getSubredditPosts, getSubredditList } from '../../api/reddit.js';
import { Outlet , useParams } from 'react-router-dom';
import { setFilter } from '../filter/filterSlice.js';
//import styles from './Counter.module.css';

const subredditDefault = '/r/pics/';

export function MainPage() {
    let { subreddit } = useParams();
    console.log(subreddit);
    const dispatch = useDispatch();

    useEffect(() => {
        if(subreddit) {
            dispatch(setFilter({value: subreddit}));
            const subredditFilter = `/r/${subreddit}/`;
            dispatch(getSubredditPosts(subredditFilter));
        } else {
            dispatch(getSubredditPosts(subredditDefault)); //Default subreddit title used when page first loads
        }
        dispatch(getSubredditList());
    }, []
    );

    return  (
        <>
            <h1>Reddit? No? Well you've come to the right place</h1>
            <Outlet />
        </>
    )
}