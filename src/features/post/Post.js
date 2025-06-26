import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import styles from './Counter.module.css';


export function Post({id, category, title, url}) {
    
    return  (
        <>
            <h3>{title}</h3>
            <h4>{category}</h4>
            <img src={url} alt={title}/>
        </>
    )
}