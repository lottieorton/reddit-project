import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
//import styles from './Counter.module.css';


export function Post({id, category, description, img}) {
    
    return  (
        <>
            <h3>{description}</h3> 
            <img src={img} />
        </>
    )
}