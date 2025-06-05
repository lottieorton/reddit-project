export const apiBaseURL = 'https://www.reddit.com';

export const getSubredditList = async () => {
    try {
        const response = await fetch(`${apiBaseURL}/subreddits.json`);
        if (response.ok) {
            const jsonResponse = await response.json();
            const output = jsonResponse.data.children.map(subreddit => ({
                title: subreddit.data.title, 
                display_name: subreddit.data.display_name}));
            console.log(output);
            return output;
        }
        //throw new Error('Request Failed')
    } catch (error) {
        console.log(error);
    }
}

const subredditDefault = '/r/pics/'; //default value for posts

export const getSubredditPosts = async (subreddit) => {
    try {
        const response = await fetch(`${apiBaseURL}${subreddit}.json`);
        if (response.ok) {
            const jsonResponse = await response.json();
            const output = jsonResponse.data.children.map(post => ({
                id: post.data.id,
                title: post.data.title,
                subreddit_name_prefixed: post.data.subreddit_name_prefixed,
                preview: post.data.preview,
                subreddit_id: post.data.subreddit_id,
                url: post.data.url
            }));
            console.log(output);
            return output;
        }
        //throw new Error('Request Failed')
    } catch (error) {
        console.log(error);
    }
}

//getSubredditList();
getSubredditPosts(subredditDefault);