import { useRef, useEffect } from 'react';
import { Animated, LogBox } from 'react-native';

export const useRingAnimation = () => {
  const ringAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    LogBox.ignoreLogs(['Animated: `useNativeDriver`']);
    Animated.loop(
      Animated.sequence([
        Animated.timing(ringAnim, {
          toValue: -1,
          duration: 100,
          delay: 800,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: -1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: 1,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.timing(ringAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [ringAnim]);

  const rotation = ringAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: ['-30deg', '30deg'],
  });

  return rotation;
};
