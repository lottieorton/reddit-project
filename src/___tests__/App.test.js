import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from '../App.js';
import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider, createMemoryRouter } from 'react-router-dom';
import { MainPage } from '../features/MainPage/MainPage.js';
//Mock components rendered by the routes
// jest.mock('../features/Feed/Feed.js', () => ({
jest.mock('../features/Feed/Feed.js', () => ({
    Feed: () => <div data-testid="mockFeedComponent">Mock Feed Component</div>
}));
jest.mock('../features/MainPage/MainPage.js', () => {
    const { Outlet } = require('react-router-dom');
    return {
        MainPage: () => (
            <div data-testid="mockMainPage">
                Mock Main Page Component
                <Outlet />
            </div>
        )
    }
});
jest.mock('../features/post/PostPage.js', () => ({
    PostPage: () => <div data-testid="mockPostPage">Mock Post Page Component</div>
}));

describe('App component Routing', () => {
    it('renders the Main Page and Feed component on the root path "/" ', async () => {
        //arrange
        const MockMainPage = require('../features/MainPage/MainPage.js').MainPage;
        const MockFeed = require('../features/Feed/Feed.js').Feed;
        const MockPostPage = require('../features/post/PostPage.js').PostPage;
        //Create a specific router for this test
        const testRouter = createBrowserRouter(createRoutesFromElements([
          <Route path='/' element={<MockMainPage />}>
            <Route index element={<MockFeed />} />
            <Route path='postpage/:id' element={<MockPostPage />} />
          </Route>
        ]), { initialEntries: ['/'] }); //Sets the initial URL for this test
        //action
        render(<RouterProvider router={testRouter} />);
        //assert
        await waitFor(() => {
            const mainPageComponent = screen.getByTestId('mockMainPage');
            const feedComponent = screen.getByTestId('mockFeedComponent');
            expect(mainPageComponent).toBeInTheDocument();
            expect(feedComponent).toBeInTheDocument();
        })
        expect(screen.queryByTestId('mockPostPage')).not.toBeInTheDocument();
    });

    it('renders the Main Page and Post Page component on the path "/postpage/:id" ', async () => {
        //arrange
        const postId = '123';
        const MockMainPage = require('../features/MainPage/MainPage.js').MainPage;
        const MockFeed = require('../features/Feed/Feed.js').Feed;
        const MockPostPage = require('../features/post/PostPage.js').PostPage;
        //Create a specific router for this test
        //Note need to use createMemoryRouter here to get the route/initialEntries to work, otherwise jsut going to default url
        //This manages navigation in memory without touching broswer history
        const testRouter = createMemoryRouter(createRoutesFromElements([
          <Route path='/' element={<MockMainPage />}>
            <Route index element={<MockFeed />} />
            <Route path='postpage/:id' element={<MockPostPage />} />
          </Route>
        ]), { initialEntries: [`/postpage/${postId}`] }); //Sets the initial URL for this test
        //action
        render(<RouterProvider router={testRouter} />);
        //assert
        await waitFor(() => {
            //screen.debug();
            const mainPageComponent = screen.getByTestId('mockMainPage');
            const postPageComponent = screen.getByTestId('mockPostPage');
            expect(mainPageComponent).toBeInTheDocument();
            expect(postPageComponent).toBeInTheDocument();
        })
        expect(screen.queryByTestId('mockFeedComponent')).not.toBeInTheDocument();
    });
});