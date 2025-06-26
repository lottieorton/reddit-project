import { Post } from '../features/post/Post.js';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Post component', () => {
    it('renders a post with given attributes', () => {
        //arrange
        //action
        render(<Post key={'123'} id={'123'} category={'subredditNamePrefixed1'} title={'title1'} url={'http://test.com'} />);
        const h3Header = screen.getByText('title1');
        const h4Header = screen.getByText('subredditNamePrefixed1');
        const image = screen.getByRole('img', {alt: 'title1'});
        //assert
        expect(h3Header).toBeInTheDocument();
        expect(h4Header).toBeInTheDocument();
        expect(image).toBeInTheDocument();
    })
});