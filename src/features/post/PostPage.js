import React, { useEffect } from 'react';
import { useSelector , useDispatch } from 'react-redux';
import { useParams , useNavigate } from 'react-router-dom';
import { getSubredditPostComments } from '../../api/reddit.js';
//import { setFilter } from '../filter/filterSlice.js';
import styles from './PostPage.module.css';

export function PostPage() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    let { id } = useParams();

    const feed = useSelector((state) => state.reddit.feed);
    const allComments = useSelector((state) => state.reddit.comments);
    const selectedPost = feed.find(post => post.id === id); //use find for single item
    const feedIsLoading = useSelector((state) => state.reddit.feedIsLoading);
    const feedHasError = useSelector((state) => state.reddit.feedHasError);
    const commentsIsLoading = useSelector((state) => state.reddit.commentsIsLoading);
    const commentsHasError = useSelector((state) => state.reddit.commentsHasError);

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
        //console.log(selectedPost);
        const {title, subredditNamePrefixed, url, permalink, author, numComments} = selectedPost;
        const comments = allComments ?
            allComments.filter(comment => {
                return comment.body !== undefined && comment.body !== '';
            }).slice(0, 50) 
            : [];

        return  (
            <div className={styles.postPage}>
                <button onClick={handleBackButton} className={styles.postPageButton}>Back to Home Page</button>
                <div className={styles.postPagePost}>
                    <h3>{title}</h3>
                    <img src={url} alt={title} className={styles.postPageImage}/>
                    <div className={styles.postPageInfo}>
                        <p>Author: {author}</p>
                        <p>Comments: {numComments}</p>
                    </div>
                    {commentsHasError ? <p>Oops seems to be an issue with your comments loading! Try again later.</p> : 
                    <div className={styles.postPageComments}>
                        <h4>Comments:</h4>
                        {commentsIsLoading ? <p className={styles.postPageLoading}>Your comments will be ready in just a min...</p> : <></>}
                        <ul className={styles.postPageCommentList}>
                            {comments.map(comment => {
                                const {ups, downs, score, body, name} = comment;
                                return (
                                    <li key={name} className={styles.postPageComment}>
                                        <p>{body}</p>
                                        <p className={styles.postPageCommentInfo}>Up votes: {ups} Down votes: {downs} Score: {score}</p> 
                                    </li>
                                )
                            })}
                        </ul>
                    </div>}
                </div>
            </div>
    )} else if (feedIsLoading) {
        return  (
            <div className={styles.postPage}>
                <button onClick={handleBackButton} className={styles.postPageButton}>Back to Home Page</button>
                <p className={styles.postPageLoading}>Please wait while this post loads...</p>
            </div>
    )} else {
        return  (
            <div className={styles.postPage}>
                <button onClick={handleBackButton}>Back to Home Page</button>
                <p className={styles.postPagePost}>Oopsie seems to be a little error causing mischief here. Try again later is you wanna.</p>
            </div>
    )}
}

//<h3>{id}</h3>
//<h4>{subredditNamePrefixed}</h4>