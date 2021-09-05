import React from 'react';
import { View } from 'react-native';
import styles from './styles';
import LoadingDots from '../../../lib/react-native-loading-dots';
import Colors from '../../theme/colors';

export default function LoadMore({ loadingMore = false, ...props }) {
  return (
    <View style={[styles.container, props.style]}>
      {loadingMore && (
        <View style={styles.indicator}>
          <LoadingDots
            dots={3}
            colors={[Colors.red, Colors.red, Colors.red]}
            size={8}
          />
        </View>
      )}
    </View>
  );
}
