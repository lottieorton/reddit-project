import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../post/Post.js';
import { SearchTerm } from '../searchTerm/SearchTerm.js';
import { Filter } from '../filter/Filter.js';
import { getSubredditPosts, getSubredditList } from '../../api/reddit.js';
import { store } from '../../app/store.js';
//import { } from './homePageSlice';
//import styles from './Counter.module.css';

const subredditDefault = '/r/pics/';

export function Feed() {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubredditPosts(subredditDefault)); //Default subreddit title used when page first loads
        dispatch(getSubredditList());
    }, []
    );

    const feed = useSelector((state) => state.reddit.feed);

    return  (
        <>
            
            <SearchTerm />
            <Filter />

            {feed.map((post) => {
                const {id, subreddit_name_prefixed, title, url} = post;
                return <Post id={id} category={subreddit_name_prefixed} title={title} url={url} />
                
            })}

        </>
    )
}