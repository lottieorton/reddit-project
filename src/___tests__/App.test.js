import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App.js';

//Mock Feed component
jest.mock('../features/homePage/Feed.js', () => ({
    Feed: () => <div data-testid="mockFeedComponent">MockFeedComponent</div>
}));

describe('App component', () => {
    it('renders the Feed component', () => {
        //arrange
        //action
        render(<App />);
        const feedComponent = screen.getByTestId('mockFeedComponent');
        //assert
        expect(feedComponent).toBeInTheDocument();
    })
});