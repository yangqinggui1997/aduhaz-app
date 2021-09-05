import React from 'react';
import { View, Text } from 'react-native';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash';

import style from './style';
import Button from '../button';
import Screens from '../../screens/screens';
import Utils from '../../commons/utils';

export default function showAlert({
  title = '',
  message = '',
  buttons = [], // [{ text, onPress, isPrimary }]
  onTouchOutside = null,
  isClosedOnTouchOutside = false,
  style: customStyle,
}) {
  Navigation.showOverlay({
    component: {
      name: Screens.Dialog,
      options: {
        overlay: {
          interceptTouchOutside: isClosedOnTouchOutside,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        renderBody: componentId => (
          <AlertDialog
            title={title}
            message={message}
            buttons={buttons.map(button => {
              return {
                ...button,
                onPress: () => {
                  Navigation.dismissOverlay(componentId);
                  if (Utils.isFunction(button.onPress)) {
                    button.onPress();
                  }
                },
              };
            })}
            style={customStyle}
          />
        ),
        onRequestToClose: componentId => {
          if (isClosedOnTouchOutside) {
            Navigation.dismissOverlay(componentId);
          }
        },
        onTouchOutside: componentId => {
          if (isClosedOnTouchOutside) {
            Navigation.dismissOverlay(componentId);
          }
          if (_.isFunction(onTouchOutside)) {
            onTouchOutside(componentId);
          }
        },
      },
    },
  });
}

const AlertDialog = ({
  title = '',
  message = '',
  buttons = [], // [{ text, onPress, isPrimary }]
  ...props
}) => {
  return (
    <View style={[style.container, props.style]}>
      {!Utils.isEmptyString(title) && (
        <Text style={style.title}>
          {title}
        </Text>
      )}
      {!Utils.isEmptyString(message) && (
        <Text style={style.message}>
          {message}
        </Text>
      )}
      <View style={style.buttons}>
        {!Utils.isEmptyArray(buttons) &&
          buttons.map((button, index) => (
            <Button
              key={`key-${index}`}
              style={style.buttonContainer}
              status={button.isPrimary ? 'primary' : 'transparent'}
              title={button.text}
              titleStyle={style.buttonTitle}
              titleCategory={button.isPrimary ? 'm5' : 'p3'}
              onPress={button.onPress}
            />
          ))}
      </View>
    </View>
  );
};
