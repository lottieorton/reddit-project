import React, { useEffect } from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { useParams , useNavigate } from 'react-router-dom';
import { getSubredditPostComments } from '../../api/reddit.js';
//import { setFilter } from '../filter/filterSlice.js';
//import styles from './Counter.module.css';

export function PostPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let { id } = useParams();

    const feed = useSelector((state) => state.reddit.feed);
    const allComments = useSelector((state) => state.reddit.comments);
    const selectedPost = feed.find(post => post.id === id); //use find for single item

    useEffect(() => {
        if(selectedPost && selectedPost.permalink) {//WILL NEED TO ALTER COMMENTS LOGIC AS NEED TO CHECK SAME NOT JUST EXIST 
            dispatch(getSubredditPostComments(selectedPost.permalink));
        }
    }, [feed]);

    const handleBackButton = e => {
        navigate(-1);
    }

    //UPDATE CRITERIA TO CHECK THAT SUBREDDIT MATCHES VALUE WANT AS WELL
    if(feed.length != 0) {
        console.log(selectedPost);
        const {title, subredditNamePrefixed, url, permalink} = selectedPost;
        const comments = allComments ? allComments.slice(0, 50) : [];

        return  (
            <>
                <button onClick={handleBackButton}>Back to Home Page</button>
                <h3>{title}</h3>
                <h3>{id}</h3>
                <h4>{subredditNamePrefixed}</h4>
                <img src={url} alt={title}/>

                <h4>Comments:</h4>
                    <ul>
                        {comments.map(comment => {
                            const {ups, downs, score, body, name} = comment;
                            return (
                                <li key={name} >
                                    <p>{body}</p>
                                    <p>Up votes: {ups} Down votes: {downs} Score: {score}</p> 
                                </li>
                            )
                        })}
                    </ul>
            </>
    )} else {
        return  (
            <>
                <button onClick={handleBackButton}>Back to Home Page</button>
            </>
    )}
}