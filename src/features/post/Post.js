import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import styles from './Counter.module.css';


export function Post({id, subreddit_name_prefixed, title, url}) {
    
    return  (
        <>
            <h3>{title}</h3> 
            <img src={url} />
        </>
    )
}