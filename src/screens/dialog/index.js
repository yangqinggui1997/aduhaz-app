import React from 'react';
import { View, Text } from 'react-native';
import _ from 'lodash';

import style from './style';
import { useBackHandler } from '../../hooks';

const Dialog = ({
  renderBody = null,
  onTouchOutside = null,
  onRequestToClose = null,
  componentId,
  ...props
}) => {
  const handleBackPress = () => {
    if (_.isFunction(onRequestToClose)) {
      onRequestToClose(componentId);
    }
    return true;
  };
  useBackHandler(handleBackPress);

  const onOverlayPress = () => {
    if (_.isFunction(onTouchOutside)) {
      onTouchOutside(componentId);
    }
  };

  return (
    <View style={[style.container, props.style]}>
      <Text style={style.overlay} onPress={onOverlayPress} />
      {_.isFunction(renderBody) && renderBody(componentId)}
    </View>
  );
};

export default Dialog;
