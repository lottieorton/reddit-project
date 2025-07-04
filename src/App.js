import React from 'react';
import './App.css';
import { Feed } from './features/Feed/Feed.js';
import { RouterProvider, createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import { PostPage } from './features/post/PostPage.js';
import { MainPage } from './features/MainPage/MainPage.js';

const router = createBrowserRouter(createRoutesFromElements([
  <Route path='/' element={<MainPage />}>
    <Route index element={<Feed />} />
    <Route path='subreddit/:subreddit/postpage/:id' element={<PostPage />} />
  </Route>
]));

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}

// function App() {
//   return (
//     <div className="App">
//       <Feed />
//     </div>
//   );
// }

// export default App;
