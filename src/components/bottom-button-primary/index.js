import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';

import style from './style';

const BottomButtonPrimary = ({ title, disabled, onPress, isBordered }) => {
  return (
    <View style={style.container}>
      <TouchableOpacity
        style={[style.buttonGrey, disabled ? style.buttonPrimary : {}, isBordered ? style.buttonHaveBorder : {}]}
        onPress={onPress}>
        <Text style={style.buttonTitle}>
          {title}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomButtonPrimary;
