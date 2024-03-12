import React from 'react';
import renderer from 'react-test-renderer';
import App from '../App';

describe('<App />', () => {
  it('Testing the App component', () => {
    // Render the component
    const appComponent = renderer.create(<App />).toJSON();
    expect(appComponent).toMatchSnapshot();
  });
});
