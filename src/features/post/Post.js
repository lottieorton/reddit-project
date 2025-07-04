import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
//import styles from './Counter.module.css';


export function Post({id, category, title, url, subreddit}) {
    
    return  (
        <>
            <Link to={`/subreddit/${subreddit}/postpage/${id}`}><h3>{title}</h3></Link>
            <h3>{id}</h3>
            <h4>{category}</h4>
            <img src={url} alt={title}/>
        </>
    )
}