import React from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  Dimensions,
  FlatList,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash';

import { styles } from './styles';
import images from '../../assets/images';
import Screens from '../../screens/screens';

export default function showStickerSelectionView({
  isClosedOnTouchOutside = true,
  onSelected = null,
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
          <StickerSelectionView
            componentId={componentId}
            onClose={hideBottomSheet}
            onSelected={onSelected}
          />
        ),
        height: Dimensions.get('screen').height * 0.7,
      },
    },
  });
}

const StickerSelectionView = ({ onSelected, onClose }) => {
  const onSelectSticker = sticker => {
    if (_.isFunction(onSelected)) {
      onSelected(sticker);
    }
    if (_.isFunction(onClose)) {
      onClose();
    }
  };

  const renderStickerGroup = stickerGroup => {
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {stickerGroup.stickers.map((sticker, index) => (
          <TouchableOpacity
            key={index.toString()}
            style={styles.stickerContainer}
            onPress={() => onSelectSticker(sticker)}>
            <Image source={sticker} style={styles.stickerImage} />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={images.STICKERS}
        renderItem={({ item, index }) => renderStickerGroup(item)}
        ItemSeparatorComponent={() => <View style={styles.listSeparator} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
      />
    </View>
  );
};
