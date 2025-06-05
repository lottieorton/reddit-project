// import React from 'react';
// import { render } from '@testing-library/react';
// import { Provider } from 'react-redux';
// import { store } from './app/store';
// import App from './App';

// test('renders learn react link', () => {
//   const { getByText } = render(
//     <Provider store={store}>
//       <App />
//     </Provider>
//   );

//   expect(getByText(/learn/i)).toBeInTheDocument();
// });


it("A fake test to see if works", () => {
    //arrange
    const input = "hi";
    const expected = input;
    //act
    const actual = "hi";
    //assert
    expect(actual).toEqual(expected);
});