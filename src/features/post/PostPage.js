import React from 'react';
import { useSelector } from 'react-redux';
import { useParams , useNavigate } from 'react-router-dom';
//import styles from './Counter.module.css';

export function PostPage() {
    const navigate = useNavigate();
    let {id} = useParams();
    //console.log(id);

    const feed = useSelector((state) => state.reddit.feed);
    //console.log(feed);
    const handleBackButton = e => {
        navigate(-1);
    }

    if(feed.length != 0) {
        const selectedPost = feed.filter(post => post.id === id);
        //console.log(selectedPost);
        const {title, subredditNamePrefixed, url} = selectedPost[0];
        return  (
            <>
                <button onClick={handleBackButton}>Back to Home Page</button>
                <h3>{title}</h3>
                <h3>{id}</h3>
                <h4>{subredditNamePrefixed}</h4>
                <img src={url} alt={title}/>
            </>
    )} else {
        return  (
            <>
                <button onClick={handleBackButton}>Back to Home Page</button>
            </>
    )}
}