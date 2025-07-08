import { Post } from '../features/post/Post.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BrowserRouter } from 'react-router-dom';
//Need to use the Browser Router - because the Link component relies on context provided by React Router, therefore wrap it in Browser Router below

describe('Post component', () => {
    it('renders a post with given attributes', () => {
        //arrange
        //action
        render(
            <BrowserRouter>
                <Post key={'123'} id={'123'} category={'subredditNamePrefixed1'} title={'title1'} url={'http://test.com'} subreddit={'subreddit'} author={'author1'} numComments = {10} />
            </BrowserRouter>
        );
        const h3Header = screen.getByText('title1');
        const image = screen.getByRole('img', {alt: 'title1'});
        const authorText = screen.getByText('Author: author1');
        const numCommentsText = screen.getByText(/Comments: 10/i);
        //assert
        expect(h3Header).toBeInTheDocument();
        expect(image).toBeInTheDocument();
        expect(authorText).toBeInTheDocument();
        expect(numCommentsText).toBeInTheDocument();
    })
});