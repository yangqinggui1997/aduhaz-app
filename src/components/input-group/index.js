import React, { useState, forwardRef, useEffect } from 'react';
import { TextInput, View, Text, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import Utils from '../../commons/utils';
import style from './style';
import ImageView from '../image-view';
import Images from '../../assets/images';
import { Colors } from '../../theme';
import { alignCenter, flexRow, justifyBetween } from '../../commons/styles';

const InputGroup = forwardRef(
  (
    {
      accessoryRight = null,
      accessoryLeft = null,
      caption = null,
      captionIcon = null,
      label = null,
      labelUpperCase = true,
      secureTextEntry = null,
      showEditButton = false,
      onPressEditButton = null,
      value = '',
      onChangeText: onChangeTextProps = null,
      error = false,
      errorMessage = '',
      required = false,
      maxLength = 100,
      ...props
    },
    ref,
  ) => {
    const { t } = useTranslation();
    const [secureText, setSecureText] = useState(
      secureTextEntry !== null ? secureTextEntry : false,
    );
    const [text, setText] = useState('');

    useEffect(() => {
      setText(value);
    }, [value]);

    const onShowPassword = () => {
      setSecureText(!secureText);
    };

    const onChangeText = txt => {
      setText(txt);

      if (Utils.isFunction(onChangeTextProps)) {
        onChangeTextProps(txt);
      }
    };

    const renderShowPassword = () => {
      if (secureTextEntry !== null) {
        return (
          <TouchableOpacity
            onPress={onShowPassword}
            style={style.iconContainer}>
            <ImageView
              source={secureText ? Images.icon_eye : Images.icon_eye_off}
              style={style.eye}
            />
          </TouchableOpacity>
        );
      } else if (showEditButton === true) {
        return (
          <TouchableOpacity
            style={style.iconContainer}
            onPress={onPressEditButton}>
            <Text style={style.edit}>{t('edit')}</Text>
          </TouchableOpacity>
        );
      }
    };

    return (
      <View style={[style.container, props.containerStyle]}>
        <View style={style.inputContainer}>
          {accessoryLeft}
          <TextInput
            {...props}
            ref={ref}
            style={[style.input, error && style.inputError, props.style]}
            placeholderTextColor={Colors.flatGrey}
            secureTextEntry={secureText}
            value={text}
            onChangeText={onChangeText}
            maxLength={maxLength}
          />
          {renderShowPassword()}
        </View>
        {error ? <Text style={props.feedbackStyle}>{errorMessage}</Text> : null}
      </View>
    );
  },
);

export default InputGroup;
