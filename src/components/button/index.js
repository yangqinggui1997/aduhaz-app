import React from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import style from './style';
import { Colors } from '../../theme';

const CustomButton = ({
  status = 'primary',
  title = '',
  titleStyle = null,
  titleStatus = 'black',
  titleProps = {},
  leftIcon = null,
  ...props
}) => {
  return (
    <TouchableOpacity
      {...props}
      style={[
        style.container,
        { backgroundColor: Colors[status] },
        leftIcon ? style.hasIcon : {},
        props.disabled ? style.disabled : {},
        props.style,
      ]}>
      {leftIcon ? <View style={style.leftIcon}>{leftIcon}</View> : null}
      <Text
        style={[style.text, titleStyle]}
        status={titleStatus}
        numberOfLines={1}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
