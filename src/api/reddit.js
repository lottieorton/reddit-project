import { createAsyncThunk } from "@reduxjs/toolkit";

export const apiBaseURL = 'https://www.reddit.com';

export const getSubredditList = createAsyncThunk(
    'reddit/getSubredditList',
    async () => {
    try {
        const response = await fetch(`${apiBaseURL}/subreddits.json`);
        if (response.ok) {
            const jsonResponse = await response.json();
            const output = jsonResponse.data.children.map(subreddit => ({
                title: subreddit.data.title, 
                displayName: subreddit.data.display_name}));
            //console.log(output);
            return output;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.log(error);
        throw error; //Important to re-throw error so createAsyncThunk catches it
    }
});

//MAYBE DON'T WRITE THE ABOVE AS TESTS LIKE THESE, MAYBE HAVE IT FULFILLED WITH A DIFFERENT MESSAGE ON THE PAGE??

//const subredditDefault = '/r/pics/'; //default value for posts /r/SUBREDDIT displayname

export const getSubredditPosts = createAsyncThunk(
    'reddit/getSubredditPosts',
    async (subreddit) => {
    try {
        const response = await fetch(`${apiBaseURL}${subreddit}.json`);
        if (response.ok) {
            const jsonResponse = await response.json();
            const output = jsonResponse.data.children.map(post => ({
                id: post.data.id,
                title: post.data.title,
                subredditNamePrefixed: post.data.subreddit_name_prefixed,
                preview: post.data.preview,
                subredditId: post.data.subreddit_id,
                url: post.data.url
            }));
            //console.log(output);
            return output;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        //throw new Error('Request Failed')
    } catch (error) {
        console.log(error);
        throw error;
    }
});