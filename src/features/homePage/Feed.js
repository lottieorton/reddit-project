import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Post } from '../post/Post'
import { SearchTerm } from '../searchTerm/SearchTerm'
//import { } from './homePageSlice';
//import styles from './Counter.module.css';

const fakePosts = [
    {id: 1, category: 'funny', description: 'Heya this is a fake post', img: '../../../testImgs/dolphin.jpg'},
    {id: 2, category: 'serious', description: 'Heya this is another fake post', img: '../../testImgs/turtle.jpg'},
    {id: 3, category: 'funny', description: 'Heya this one last fake post', img: '../../testImgs/hippo.jpg'}
]


export function Feed() {
    return  (
        <>
            
            <SearchTerm />

            {fakePosts.map((post) => {
                const {id, category, description, img} = post;
                return <Post id={id} category={category} description={description} img={img} />
                
            })}

        </>
    )
}