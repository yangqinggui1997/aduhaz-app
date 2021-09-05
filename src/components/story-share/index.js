import React from 'react';
import { Text, TouchableOpacity, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { styles } from './style';
import { Colors } from '../../theme';
import images from '../../assets/images';
import Screens from '../../screens/screens';

export default function showStoryShareSelection({
  isClosedOnTouchOutside = true,
  onSelectedItem = null,
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
          <StoryShare
            componentId={componentId}
            onClose={hideBottomSheet}
            onSelectedItem={onSelectedItem}
          />
        ),
        height: 160,
      },
    },
  });
}

const OPTIONS = [
  {
    id: 'zalo',
    icon: images.icon_zalo,
  },
  {
    id: 'messenger',
    icon: images.icon_messenger,
  },
  {
    id: 'facebook',
    icon: images.icon_facebook,
  },
  {
    id: 'twitter',
    icon: images.icon_twitter,
  },
  {
    id: 'link',
    icon: images.icon_link,
  },
];

const StoryShare = ({ onSelectedItem, onClose }) => {
  const { t } = useTranslation();

  const onSelectOption = item => {
    if (_.isFunction(onSelectedItem)) {
      onSelectedItem(item);
    }
    if (_.isFunction(onClose)) {
      onClose();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('share_selection_title')}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close-outline" size={28} color={Colors.flatBlack02} />
        </TouchableOpacity>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-around',
          marginTop: 24,
        }}>
        {OPTIONS.map((option, index) => (
          <TouchableOpacity key={index} onPress={() => onSelectOption(option)}>
            <Image style={{ width: 40, height: 40 }} source={option.icon} />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
