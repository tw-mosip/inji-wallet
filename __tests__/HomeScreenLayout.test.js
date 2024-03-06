import React from 'react';
import renderer from 'react-test-renderer';
import {HomeScreenLayout} from '../screens/HomeScreenLayout';

jest.mock('@react-navigation/native-stack');

describe('<HomeScreenLayout />', () => {
  it('Testing the HomeScreenLayout component', () => {
    // Render the component
    const homeScreenLayoutComponent = renderer
      .create(<HomeScreenLayout />)
      .toJSON();
    expect(homeScreenLayoutComponent).toMatchSnapshot();
  });
});
