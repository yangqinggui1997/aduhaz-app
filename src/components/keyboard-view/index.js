/**
 * Using when in the screen has input(s)
 */
import React from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import style from './style';

const KeyboardView = ({
  children,
  contentContainerStyle = style.container,
}) => {
  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      contentContainerStyle={contentContainerStyle}
      extraScrollHeight={32}
    >
      {children}
    </KeyboardAwareScrollView>
  );
};

export default KeyboardView;
