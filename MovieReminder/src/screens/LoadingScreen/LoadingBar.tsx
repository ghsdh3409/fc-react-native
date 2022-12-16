import OpenColor from 'open-color';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

const styles = StyleSheet.create({
  outer: {
    height: 10,
    borderWidth: 1,
    borderColor: OpenColor.black,
  },
  inner: {
    height: '100%',
    backgroundColor: OpenColor.black,
  },
});

interface LoadingBarProps {
  width: number;
  total: number;
  now: number;
}

const LoadingBar = ({ width, now, total }: LoadingBarProps) => {
  const loadingAnimRef = useRef(new Animated.Value(0));

  const startAnimation = useCallback(() => {
    Animated.timing(loadingAnimRef.current, {
      toValue: now / total,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  }, [now, total]);

  useEffect(() => {
    startAnimation();
  }, [startAnimation]);

  const progressWidth = useMemo(() => {
    return loadingAnimRef.current.interpolate({
      inputRange: [0, 1],
      outputRange: [0, width],
      extrapolate: 'clamp',
    });
  }, [width]);

  const outerStyle = useMemo<StyleProp<ViewStyle>>(
    () => [styles.outer, { width }],
    [width],
  );

  return (
    <View style={outerStyle}>
      <Animated.View style={[styles.inner, { width: progressWidth }]} />
    </View>
  );
};

export default LoadingBar;
