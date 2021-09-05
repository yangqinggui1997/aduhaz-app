import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash';

import style from './style';
import { Colors } from '../../theme';
import images from '../../assets/images';
import Screens from '../../screens/screens';

export default function showMenuNotification({
  isClosedOnTouchOutside = true,
  onSelectedItem = null,
  menuItems = [],
  componentId,
}) {
  Navigation.showOverlay({
    component: {
      name: Screens.BottomSheet,
      options: {
        overlay: {
          interceptTouchOutside: _.isBoolean(isClosedOnTouchOutside)
            ? isClosedOnTouchOutside
            : false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        renderBody: ({ hideBottomSheet }) => (
          <MenuNotification
            componentId={componentId}
            onClose={hideBottomSheet}
            onSelectedItem={onSelectedItem}
            menuItems={menuItems}
          />
        ),
        height: 200,
      },
    },
  });
}

const MenuNotification = ({ onSelectedItem, onClose, menuItems }) => {
  const onSelectOption = item => {
    console.log(item);
    if (_.isFunction(onSelectedItem)) {
      onSelectedItem(item);
    }
    if (_.isFunction(onClose)) {
      onClose();
    }
  };

  return (
    <ScrollView style={style.container}>
      {menuItems.map(option => (
        <TouchableOpacity
          key={option.id.toString()}
          style={style.optionRow}
          onPress={() => onSelectOption(option)}>
          <View style={style.iconContainer}>
            <Ionicons name={option.icon} size={28} color={Colors.flatBlack02} />
          </View>
          <Text style={style.optionText}>{option.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
