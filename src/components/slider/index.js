import React from 'react';
import { TouchableOpacity, View } from 'react-native';
import { color } from 'react-native-reanimated';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

import { styles } from './style';
import Slider from 'rn-range-slider';

const AppSlider = ({
  style,
  rangeSlider = false,
  min = 0,
  selectedMin = 0,
  selectedMax = 0,
  max = 0,
  step = 1,
  onValueChanged,
  renderThumb,
  renderRail,
  renderRailSelected,
  ...props
}) => {
  console.log('###min, max: ', min, max);
  console.log('###selectedMin, selectedMax: ', selectedMin, selectedMax);
  return (
    <Slider
      {...props}
      style={style}
      disableRange={rangeSlider === false}
      min={min}
      low={selectedMin}
      max={max}
      high={selectedMax}
      step={step}
      renderThumb={renderThumb ?? (() => <View style={styles.thumb} />)}
      renderRail={renderRail ?? (() => <View style={styles.track} />)}
      renderRailSelected={renderRailSelected ?? (() => <View style={styles.highlightTrack} />)}
      onValueChanged={onValueChanged}
    />
  );
};

export default AppSlider;
