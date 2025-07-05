import React from 'react';
import { useSelector } from 'react-redux';
import { Post } from '../post/Post.js';
import { SearchTerm } from '../searchTerm/SearchTerm.js';
import { Filter } from '../filter/Filter.js';
//import { getSubredditPosts, getSubredditList } from '../../api/reddit.js';
//import { store } from '../../app/store.js';
//import styles from './Counter.module.css';

export function Feed() {

    const posts = useSelector((state) => state.reddit.feed);
    const searchValue = useSelector((state) => state.searchTerm);
    const feedIsLoading = useSelector((state) => state.reddit.feedIsLoading);
    const feedHasError = useSelector((state) => state.reddit.feedHasError);
    const listIsLoading = useSelector((state) => state.reddit.listIsLoading);
    const listHasError = useSelector((state) => state.reddit.listHasError);
    //console.log(searchValue);

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

    if(feedHasError || listHasError) {
            return (
                <>
                    <p>Oops... something went wrong. Please try again later</p>
                </>
            )
    }
    
    return  (
        <>
            
            <SearchTerm />

            {!listIsLoading ? <Filter /> : <></>}

            {!feedIsLoading ? 
                <>
                    {feed.map((post) => {
                        const {id, subredditNamePrefixed, title, url, subreddit} = post;
                        return <Post key={id} id={id} category={subredditNamePrefixed} title={title} url={url} subreddit={subreddit} /> 
                    })}
                </> 
            : <p>Please wait while this loads...</p> }
            

        </>
    )
}