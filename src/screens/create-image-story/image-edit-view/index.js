import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, Dimensions, Image, View } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import PinchableImage from '../../../components/pinchable-image';

import styles from './styles';
import colors from '../../../theme/colors';
import { wp } from '../../../commons/responsive';

import _ from 'lodash';

const ImageEditView = ({ imageFile, stickers, onDeleteSticker }) => {
  const { t } = useTranslation();

  const [showDeleteSticker, setShowDeleteSticker] = useState(false);
  const [canDeleteSticker, setCanDeleteSticker] = useState(false);

  const onStickerTouchEnd = (offset, index) => {
    const screenWidth = Dimensions.get('screen').width;
    const deletePositionY =
      (screenWidth * imageFile.height) / imageFile.width / 2 - wp(30);
    console.log(deletePositionY, offset);

    if (
      Math.abs(offset.x) <= 10 &&
      Math.abs(offset.y - deletePositionY) <= 30
    ) {
      if (_.isFunction(onDeleteSticker)) {
        onDeleteSticker(index);
      }
    }
    setShowDeleteSticker(false);
  };

  const renderStickerView = (sticker, index) => {
    const screenWidth = Dimensions.get('screen').width;
    const leftPosition = (screenWidth - (sticker.width ?? wp(100))) / 2;
    const deletePositionY = imageFile.height / 2;
    return (
      <View
        key={JSON.stringify(sticker)}
        style={{
          position: 'absolute',
          left: leftPosition,
        }}>
        <PinchableImage
          imageStyle={{
            width: sticker.width ?? wp(100),
            height: sticker.height ?? wp(100),
          }}
          imageSource={sticker.source ?? sticker.uri}
          onTouchStart={() => {
            setShowDeleteSticker(true);
          }}
          onTouchMove={offset => {
            const canDelete =
              Math.abs(offset.x) <= 10 &&
              Math.abs(offset.y - deletePositionY) <= 20;
            if (canDelete !== canDeleteSticker) {
              setCanDeleteSticker(canDelete);
            }
          }}
          onTouchEnd={offset => onStickerTouchEnd(offset, index)}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={{ uri: imageFile.uri }} />
      {stickers &&
        stickers.map((sticker, index) => renderStickerView(sticker, index))}
      {showDeleteSticker && (
        <View
          style={[
            styles.footer,
            { transform: [{ scale: canDeleteSticker ? 1.2 : 1 }] },
          ]}>
          <View style={styles.footerIcon}>
            <Ionicons name="trash-outline" size={26} color={colors.white} />
          </View>
          <Text style={styles.footerText}>{t('createStoryToolbarDelete')}</Text>
        </View>
      )}
    </View>
  );
};

export default ImageEditView;
