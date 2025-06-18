import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../post/Post.js';
import { SearchTerm } from '../searchTerm/SearchTerm.js';
import { Filter } from '../filter/Filter.js';
import { getSubredditPosts } from '../../api/reddit.js';
import { store } from '../../app/store.js';
//import { } from './homePageSlice';
//import styles from './Counter.module.css';

const fakePosts = [
    {id: 1, category: 'funny', title: 'title_1', subreddit_name_prefixed: 'Heya this is a fake post', url: '../../../testImgs/dolphin.jpg'},
    {id: 2, category: 'serious', title: 'title_2', subreddit_name_prefixed: 'Heya this is another fake post', url: '../../testImgs/turtle.jpg'},
    {id: 3, category: 'funny', title: 'title_3', subreddit_name_prefixed: 'Heya this one last fake post', url: '../../testImgs/hippo.jpg'}
]
const subredditDefault = '/r/pics/';

export function Feed() {
    //const [redditFeed, setRedditFeed] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getSubredditPosts(subredditDefault));
    }, []
    );

    const feed = store.getState().reddit.feed;

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