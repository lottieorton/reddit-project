import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { getSubredditPosts, getSubredditList } from '../../api/reddit.js';
import { Outlet , useParams } from 'react-router-dom';
import { setFilter } from '../filter/filterSlice.js';
import RedditLogo from '../../imgs/b_w_reddit_logo.png';
import styles from './MainPage.module.css';

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
    }, [dispatch, subreddit]
    );

    return  (
        <>
            <div className={styles['MainPage-div']}>
                <img src={RedditLogo} alt='Reddit Logo in black' className={styles['MainPage-logo']}/>
                <h1 className={styles['MainPage-h1']}>Reddit? No? Well you've come to the right place</h1>
            </div>
            <Outlet />
        </>
    )
}