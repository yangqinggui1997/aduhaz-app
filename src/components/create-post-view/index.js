import React from 'react';
import { ScrollView, Text, TouchableOpacity, View, Image } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { styles } from './style';
import { Colors } from '../../theme';
import images from '../../assets/images';
import Screens from '../../screens/screens';
import { CREATE_POST_IDS } from '../../commons/constants';

export default function showCreatePostSelection({
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
          <CreatePostView
            componentId={componentId}
            onClose={hideBottomSheet}
            onSelectedItem={onSelectedItem}
          />
        ),
        height: 350,
      },
    },
  });
}

const OPTIONS = [
  {
    id: CREATE_POST_IDS.VIDEO_POST,
    title: 'create_post_video',
    icon: images.icon_upload,
  },
  {
    id: CREATE_POST_IDS.IMAGE_POST,
    title: 'create_post_image',
    icon: images.icon_upload,
  },
  {
    id: CREATE_POST_IDS.VIDEO_STORY,
    title: 'create_story_video',
    icon: images.icon_upload,
  },
  {
    id: CREATE_POST_IDS.IMAGE_STORY,
    title: 'create_story_image',
    icon: images.icon_upload,
  },
];

const CreatePostView = ({ onSelectedItem, onClose }) => {
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
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{t('create_post_title')}</Text>
        <TouchableOpacity onPress={onClose}>
          <Ionicons name="close-outline" size={28} color={Colors.flatBlack02} />
        </TouchableOpacity>
      </View>
      {OPTIONS.map(option => (
        <TouchableOpacity
          key={option.id}
          style={styles.optionRow}
          onPress={() => onSelectOption(option)}>
          <View style={styles.iconContainer}>
            <Image source={option.icon} />
          </View>
          <Text style={styles.optionText}>{t(option.title)}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};
