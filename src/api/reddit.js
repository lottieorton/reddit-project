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

export const getSubredditPosts = createAsyncThunk(
    'reddit/getSubredditPosts',
    async (subreddit) => {
    try {
        const response = await fetch(`${apiBaseURL}${subreddit}.json`);
        if (response.ok) {
            const jsonResponse = await response.json();
            const output = jsonResponse.data.children.map(post => ({
                id: post.data.id,
                subreddit: post.data.subreddit,
                title: post.data.title,
                subredditNamePrefixed: post.data.subreddit_name_prefixed,
                preview: post.data.preview,
                subredditId: post.data.subreddit_id,
                url: post.data.url,
                permalink: post.data.permalink,
                author: post.data.author,
                numComments: post.data.num_comments
            }));
            //console.log(output);
            return output;
        } else {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
    } catch (error) {
        console.log(error);
        throw error;
    }
});

export const getSubredditPostComments = createAsyncThunk(
    'reddit/getSubredditPostComments',
    async (subredditCommentLinkString) => {
    try {
        const response = await fetch(`${apiBaseURL}${subredditCommentLinkString}.json`);
        if (response.ok) {
            const jsonResponse = await response.json();
            const output = jsonResponse[1].data.children.map(comment => ({
                subreddit: comment.data.subreddit,
                subreddit_name_prefixed: comment.data.subreddit_name_prefixed,
                name: comment.data.name,//t1_ID
                ups: comment.data.ups,
                downs: comment.data.downs,
                score: comment.data.score,
                subreddit_id: comment.data.subreddit_id,
                id: comment.data.id,
                parent_id: comment.data.parent_id, //t3_IDOFPOST
                permalink: comment.data.permalink, //url of json for post inc.s post id (in the first one it does not)
                body: comment.data.body,
                body_html: comment.data.body_html,
            }));
            console.log(output);
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