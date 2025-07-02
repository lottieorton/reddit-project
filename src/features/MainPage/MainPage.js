import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../post/Post.js';
import { getSubredditPosts, getSubredditList } from '../../api/reddit.js';
import { Outlet } from 'react-router-dom';
//import styles from './Counter.module.css';

const subredditDefault = '/r/pics/';

export function MainPage() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubredditPosts(subredditDefault)); //Default subreddit title used when page first loads
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