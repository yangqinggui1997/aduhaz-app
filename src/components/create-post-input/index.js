import React from 'react';
import { View, TouchableOpacity, TextInput, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import _ from 'lodash';
import colors from '../../theme/colors';

const CreatePostInput = ({
  title,
  placeholder,
  type = 'textInput',
  value,
  onPress = null,
  disabled = false,
  onChangeText = null,
  rightText = '',
  keyboardNumber = false,
  ...props
}) => {
  const onPressInput = () => {
    if (_.isFunction(onPress)) {
      onPress();
    }
  };

  return (
    <View style={props.style}>
      {!_.isEmpty(title) && (
        <Text style={disabled ? styles.textDisabled : {}}>{title}</Text>
      )}
      <View style={[styles.inputBox, disabled ? styles.inputBoxDisabled : {}]}>
        <TextInput
          style={styles.input}
          value={value}
          placeholder={placeholder}
          editable={type === 'textInput'}
          focusable={type === 'textInput'}
          onChangeText={onChangeText}
          keyboardType={keyboardNumber ? 'numeric' : 'default' }
        />
        {!_.isEmpty(rightText) && <Text>{rightText}</Text>}
        {type !== 'textInput' && (
          <Ionicons
            name={'chevron-forward-outline'}
            size={20}
            color={disabled ? colors.flatGrey11 : colors.black}
          />
        )}
        {_.isFunction(onPress) && !disabled && (
          <TouchableOpacity style={styles.touchMask} onPress={onPressInput} />
        )}
      </View>
    </View>
  );
};

export default CreatePostInput;
