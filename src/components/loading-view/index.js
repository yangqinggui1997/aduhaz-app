import React, { useCallback } from 'react';
import { View, Text } from 'react-native';

import Colors from '../../theme/colors';
import style from './style';
import LoadingDots from '../../../lib/react-native-loading-dots';

const Loading = ({ loading = false, fullscreen = false, ...props }) => {
  const renderDots = useCallback(() => {
    if (fullscreen) {
      return (
        <View style={style.dotsWrapper}>
          <LoadingDots
            dots={3}
            colors={[Colors.red, Colors.red, Colors.red]}
            size={8}
          />
        </View>
      );
    } else {
      return (
        <View style={style.indicator}>
          <LoadingDots
            dots={3}
            colors={[Colors.red, Colors.red, Colors.red]}
            size={8}
          />
        </View>
      );
    }
  }, [fullscreen]);

  return (
    <View style={style.centerOverlap}>
      {loading && (
        <Text style={[style.overlay, !fullscreen && style.overlayDark]} />
      )}
      {loading && renderDots()}
    </View>
  );
};

export default Loading;
