import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import colors from '../../theme/colors';
import images from '../../assets/images';

import { styles } from './style';

const ScrollToTop = ({ onScrollToTop }) => {
  return (
    <TouchableOpacity
      style={[styles.container]}
      activeOpacity={0.8}
      onPress={onScrollToTop}>
      <Icon name={images.icon_back_to_top} color={colors.black} size={26} />
    </TouchableOpacity>
  );
};

export default ScrollToTop;
