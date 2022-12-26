import React from 'react';
import YouTubeVideo from '../src/screens/MovieScreen/YouTubeVideo';
import renderer from 'react-test-renderer';
import { Linking, TouchableOpacity } from 'react-native';

describe('<YouTubeVideo />', () => {
  const youTubeKey = 'test_key';
  let testRenderer: renderer.ReactTestRenderer;
  beforeEach(() => {
    testRenderer = renderer.create(
      <YouTubeVideo title="Test Title" youTubeKey={youTubeKey} />,
    );
  });

  it('renders correctly', () => {
    const snapshot = testRenderer.toJSON();
    expect(snapshot).toMatchSnapshot();
  });

  it('opens url when it is pressed', () => {
    const spyFn = jest.spyOn(Linking, 'openURL');
    const touchableOpacity = testRenderer.root.findByType(TouchableOpacity);
    touchableOpacity.props.onPress();
    expect(spyFn).toHaveBeenCalledWith(
      `https://www.youtube.com/watch?v=${youTubeKey}`,
    );
  });
});
