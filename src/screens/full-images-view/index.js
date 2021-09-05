import React, { useRef } from 'react';
import {
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import colors from '../../theme/colors';
import style from './style';
import _ from 'lodash';
import { Navigation } from 'react-native-navigation';

const FullImagesView = ({ images, selectedIndex, ...props }) => {
  const imageList = useRef(null);

  const onPressedClose = () => {
    Navigation.dismissAllOverlays();
  };

  const renderImage = (image, index) => {
    return (
      <View style={style.imageContainer}>
        <FastImage
          style={style.image}
          source={{
            uri: image,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.contain}
        />
      </View>
    );
  };

  return (
    <View style={style.container}>
      <FlatList
        ref={imageList}
        style={style.imageList}
        data={images}
        renderItem={({ item, index }) => renderImage(item, index)}
        keyExtractor={(_, index) => 'key' + index.toString()}
        initialScrollIndex={selectedIndex}
        onScrollToIndexFailed={info => {
          const wait = new Promise(resolve => setTimeout(resolve, 500));
          wait.then(() => {
            imageList.current?.scrollToIndex({ index: info.index, animated: false });
          });
        }}
        horizontal
        pagingEnabled
      />
      <TouchableOpacity style={style.closeButton} onPress={onPressedClose}>
        <Ionicons name="close-outline" size={50} color={colors.white} />
      </TouchableOpacity>
    </View>
  );
};

FullImagesView.propTypes = {};

export default FullImagesView;
