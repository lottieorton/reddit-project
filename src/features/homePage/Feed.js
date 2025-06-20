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

    const posts = useSelector((state) => state.reddit.feed);
    const searchValue = useSelector((state) => state.searchTerm);
    console.log(searchValue);

    const searchedFeed = searchValue => {
        const lowercaseSearchValue = searchValue.toLowerCase();
        return posts.filter(post => {
            const lowercaseTitle = post.title.toLowerCase();
            return lowercaseTitle.includes(lowercaseSearchValue);
        })
    }

    let feed;
    if(searchValue) {
        feed = searchedFeed(searchValue);
    } else {
        feed = posts;
    }

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