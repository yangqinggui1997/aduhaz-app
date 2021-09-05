import React, { useEffect, useRef } from 'react';
import { Animated } from 'react-native';
import FastImage from 'react-native-fast-image';
import { Easing } from 'react-native-reanimated';
import _ from 'lodash';

const SpinningImage = ({
  source,
  style,
  imageStyle,
  stopAnimation,
  ...props
}) => {
  const spinValue = useRef(new Animated.Value(0));
  spinValue.current.addListener(value => {
    currentSpinValue = value['value'];
  });

  const loopAnim = useRef(
    Animated.loop(
      Animated.timing(spinValue.current, {
        toValue: 1,
        duration: 10000,
        easing: Easing.linear,
        useNativeDriver: true, // To make use of native driver for performance
      }),
    ),
  ).current;

  var spin = spinValue.current.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    if (!stopAnimation) {
      loopAnim.start();
    }
  }, []);

  useEffect(() => {
    if (stopAnimation) {
      loopAnim.stop();
      spinValue.current.setValue(0);
    } else {
      loopAnim.start();
    }
  }, [stopAnimation]);

  return (
    <Animated.View style={[style, { transform: [{ rotate: spin }] }]}>
      <FastImage
        style={imageStyle}
        source={source}
        resizeMode={FastImage.resizeMode.cover}
      />
    </Animated.View>
  );
};

SpinningImage.propTypes = {};

export default SpinningImage;
