import React from 'react';
import { Text, View } from 'react-native';

import style from './style';

const MoreHeader = ({ heading, noBorder = false, headingStyle = {} }) => {
  return (
    <View style={[style.container, noBorder ? {} : style.border]}>
      <View style={[style.borderLeft]}>
        <Text style={[style.heading, headingStyle]}>{heading}</Text>
      </View>
    </View>
  );
};

export default MoreHeader;
