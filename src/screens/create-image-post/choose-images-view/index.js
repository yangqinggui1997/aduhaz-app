import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import FastImage from 'react-native-fast-image';

import styles from './styles';
import colors from '../../../theme/colors';
import Images from '../../../assets/images';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import _ from 'lodash';
import { checkAndResizeImage } from '../../../commons/image-picker-helper';
import Utils from '../../../commons/utils';

const MAX_IMAGES = 20;

const ChooseImagesView = ({
  property,
  images = [],
  onNext,
  onUpdate = null,
}) => {
  const { t } = useTranslation();
  const [label, setLabel] = useState(null);
  const [selectedImages, setSelectedImages] = useState(images);

  useEffect(() => {
    if (property && !_.isEmpty(property.items)) {
      setLabel(property.items.find(item => item.type_control === 'label'));
    }
  }, [property]);

  useEffect(() => {
    if (_.isFunction(onUpdate)) {
      onUpdate(selectedImages);
    }
  }, [selectedImages]);

  const onPressNext = () => {
    if (_.isFunction(onNext)) {
      onNext(selectedImages);
    }
  };

  const onPressAddImage = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        isPreview: false,
        selectedAssets: [],
        maxSelectedAssets: MAX_IMAGES - selectedImages.length,
      });
      const maxFiles = MAX_IMAGES - selectedImages.length;
      if (response.length > maxFiles) {
        response.splice(maxFiles);
      }
      const resizeRequests = response.map(res => {
        if (Utils.isAndroid()) {
          res.path = res.realPath;
          res.filename = res.fileName;
        }
        return checkAndResizeImage(res);
      });
      const resizeImages = await Promise.all(resizeRequests);
      setSelectedImages(selectedImages.concat(resizeImages));
    } catch (e) {
      console.log(e);
    }
  };

  const onPressRemoveImage = index => {
    var images = [...selectedImages];
    images.splice(index, 1);
    setSelectedImages(images);
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imagesContainer}>
          {selectedImages.map((image, index) => (
            <View key={image.uri} style={styles.imageItem}>
              <View style={styles.imageContainer}>
                <FastImage
                  source={{ uri: image.uri }}
                  style={{ width: '100%', height: '100%' }}
                />
              </View>
              <TouchableOpacity
                style={styles.removeImageButton}
                onPress={() => onPressRemoveImage(index)}>
                <Image
                  source={Images.icon_minus}
                  style={{ width: 18, height: 18 }}
                />
              </TouchableOpacity>
            </View>
          ))}
          {selectedImages.length < MAX_IMAGES && (
            <TouchableOpacity
              style={styles.addImageContainer}
              onPress={() => onPressAddImage()}>
              <View style={styles.addImageButton}>
                <Image source={Images.icon_add_image} />
                <Text style={styles.notice}>{t('youMustUploadAtLeast')}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {label && (
          <View style={styles.descriptionContainer}>
            <Text>{label.title.replace(/\\u2022/g, '\u2022')}</Text>
          </View>
        )}
      </ScrollView>

      <TouchableOpacity
        disabled={selectedImages.length < 2}
        style={[
          styles.buttonNext,
          selectedImages.length < 2
            ? { backgroundColor: colors.flatGrey11 }
            : {},
        ]}
        onPress={() => onPressNext()}>
        <Text style={styles.buttonNextTitle}>
          {t('createImagePostButtonNext')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ChooseImagesView;
