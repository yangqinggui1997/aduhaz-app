import _ from 'lodash';
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { IMAGE_TYPE } from '../../commons/constants';
import { wp } from '../../commons/responsive';
import Utils from '../../commons/utils';
import colors from '../../theme/colors';
import AppImages from '../../assets/images';
import style from './style';

const ImageThumbnailsView = ({ images, onSelectImage, ...props }) => {
  const [imageSizes, setImagesSize] = useState(
    images.map(image => {
      return {
        width: image.width,
        height: image.height,
      };
    }),
  );

  const onPressedImage = index => {
    if (_.isFunction(onSelectImage)) {
      onSelectImage({ image: images[index], index });
    }
  };

  const renderImage = (image, imageStyle) => {
    let url;
    if (_.isString(image.directory)) {
      url = image.directory;
    } else if (_.isString(image)) {
      url = image;
    }
    let source = AppImages.empty;
    if (url) {
      if (url.startsWith('http')) {
        source = {
          uri: Utils.getResizedImageUri(
            url,
            images.length <= 2 ? IMAGE_TYPE.MEDIUM : IMAGE_TYPE.SMALL,
          ),
        };
      } else if (url.startsWith('file://')) {
        source = { uri: url };
      }
    }
    return (
      <View style={imageStyle}>
        <FastImage
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: colors.black,
          }}
          source={source}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={style.transparentMask} />
      </View>
    );
  };
  const renderLayout1 = () => {
    const image = images[0];
    let url;
    if (_.isString(image.directory)) {
      url = image.directory;
    } else if (_.isString(image)) {
      url = image;
    }
    let source = AppImages.empty;
    if (url) {
      if (url.startsWith('http')) {
        source = {
          uri: Utils.getResizedImageUri(
            url,
            images.length <= 2 ? IMAGE_TYPE.MEDIUM : IMAGE_TYPE.SMALL,
          ),
        };
      } else if (url.startsWith('file://')) {
        source = { uri: url };
      }
    }
    return (
      <TouchableWithoutFeedback
        onPress={() => onPressedImage(0)}
        style={{ flex: 1 }}>
        <View
          style={{
            ...style.image,
            height: '100%',
            justifyContent: 'center',
            backgroundColor: colors.black,
          }}>
          <FastImage
            style={
              imageSizes[0].width > imageSizes[0].height
                ? {
                    width: '100%',
                    aspectRatio: imageSizes[0].width / imageSizes[0].height,
                  }
                : { width: '100%', height: '100%' }
            }
            source={source}
            resizeMode={FastImage.resizeMode.cover}
          />
          <View style={style.transparentMask} />
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const renderLayout2 = () => {
    if (imageSizes.length === 0) {
      return <View />;
    }
    const horizontal = imageSizes[0].width < imageSizes[0].height;
    return (
      <View style={[horizontal ? { flexDirection: 'row' } : {}, { flex: 1 }]}>
        <TouchableWithoutFeedback
          onPress={() => onPressedImage(0)}
          style={{ flex: 1 }}>
          {renderImage(
            images[0],
            horizontal
              ? { ...style.image, height: '100%' }
              : { ...style.image, width: '100%' },
          )}
        </TouchableWithoutFeedback>
        <View style={horizontal ? { width: 1 } : { height: 1 }} />
        <TouchableWithoutFeedback
          onPress={() => onPressedImage(1)}
          style={{ flex: 1 }}>
          {renderImage(
            images[1],
            horizontal
              ? { ...style.image, height: '100%' }
              : { ...style.image, width: '100%' },
          )}
        </TouchableWithoutFeedback>
      </View>
    );
  };

  const renderLayout3 = () => {
    if (imageSizes.length === 0) {
      return <View />;
    }
    const landscape = imageSizes[0].width > imageSizes[0].height;
    return (
      <View style={{ flex: 1, flexDirection: landscape ? 'column' : 'row' }}>
        <TouchableWithoutFeedback
          style={{ flex: 1 }}
          onPress={() => onPressedImage(0)}>
          {renderImage(images[0], { ...style.image, height: '100%' })}
        </TouchableWithoutFeedback>
        <View style={landscape ? { height: 1 } : { width: 1 }} />
        <View style={{ flex: 1, flexDirection: landscape ? 'row' : 'column' }}>
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => onPressedImage(1)}>
            {renderImage(images[1], { ...style.image, width: '100%' })}
          </TouchableWithoutFeedback>
          <View style={landscape ? { width: 1 } : { height: 1 }} />
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => onPressedImage(2)}>
            {renderImage(images[2], { ...style.image, width: '100%' })}
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  };

  const renderLayout4 = () => {
    if (imageSizes.length === 0) {
      return <View />;
    }
    if (imageSizes.find(s => s.width > s.height) == null) {
      return (
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <TouchableWithoutFeedback
            style={{ flex: 1 }}
            onPress={() => onPressedImage(0)}>
            {renderImage(images[0], { ...style.image, height: '100%' })}
          </TouchableWithoutFeedback>
          <View style={{ width: 1 }} />
          <View style={{ flex: 1 }}>
            {images.slice(1, 4).map((image, index) => (
              <View key={index} style={{ flex: 1 }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => onPressedImage(index + 1)}>
                  {renderImage(image, { ...style.image, width: '100%' })}
                </TouchableWithoutFeedback>
                {index < 2 && <View style={{ height: 1 }} />}
              </View>
            ))}
          </View>
        </View>
      );
    }
    if (
      imageSizes[0].width > imageSizes[0].height &&
      imageSizes[1].width > imageSizes[1].height
    ) {
      return (
        <View style={{ flex: 1 }}>
          {images.slice(0, 2).map((image, index) => (
            <View key={index} style={{ flex: 1 }}>
              <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={() => onPressedImage(index)}>
                {renderImage(image, { ...style.image, width: '100%' })}
              </TouchableWithoutFeedback>
              {index === 0 && <View style={{ height: 1 }} />}
            </View>
          ))}
          <View style={{ height: 1 }} />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {images.slice(2, 4).map((image, index) => (
              <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => onPressedImage(index + 2)}>
                  {renderImage(image, { ...style.image, height: '100%' })}
                </TouchableWithoutFeedback>
                {index === 0 && <View style={{ width: 1 }} />}
              </View>
            ))}
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {images.slice(0, 2).map((image, index) => (
              <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => onPressedImage(index)}>
                  {renderImage(image, { ...style.image, width: '100%' })}
                </TouchableWithoutFeedback>
                {index === 0 && <View style={{ width: 1 }} />}
              </View>
            ))}
          </View>
          <View style={{ height: 1 }} />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {images.slice(2, 4).map((image, index) => (
              <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => onPressedImage(index + 2)}>
                  {renderImage(image, { ...style.image, height: '100%' })}
                </TouchableWithoutFeedback>
                {index === 0 && <View style={{ width: 1 }} />}
              </View>
            ))}
          </View>
        </View>
      );
    }
  };

  const renderLayout5 = () => {
    if (imageSizes.length === 0) {
      return <View />;
    }
    if (imageSizes[0].width <= imageSizes[0].height) {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => onPressedImage(0)}>
              {renderImage(images[0], { ...style.image, height: '100%' })}
            </TouchableWithoutFeedback>
            <View style={{ width: 1 }} />
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => onPressedImage(1)}>
              {renderImage(images[1], { ...style.image, height: '100%' })}
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: 1 }} />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            {images.slice(2, 5).map((image, index) => (
              <View key={index} style={{ flex: 1, flexDirection: 'row' }}>
                <TouchableWithoutFeedback
                  style={{ flex: 1 }}
                  onPress={() => onPressedImage(index + 2)}>
                  {renderImage(image, { ...style.image, height: '100%' })}
                </TouchableWithoutFeedback>
                {index < 2 && <View style={{ width: 1 }} />}
              </View>
            ))}
          </View>
        </View>
      );
    } else {
      return (
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1 }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => onPressedImage(0)}>
              {renderImage(images[0], { ...style.image, width: '100%' })}
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: 1 }} />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => onPressedImage(1)}>
              {renderImage(images[1], { ...style.image, height: '100%' })}
            </TouchableWithoutFeedback>
            <View style={{ width: 1 }} />
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => onPressedImage(2)}>
              {renderImage(images[2], { ...style.image, height: '100%' })}
            </TouchableWithoutFeedback>
          </View>
          <View style={{ height: 1 }} />
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => onPressedImage(3)}>
              {renderImage(images[3], { ...style.image, height: '100%' })}
            </TouchableWithoutFeedback>
            <View style={{ width: 1 }} />
            <TouchableWithoutFeedback
              style={{ flex: 1 }}
              onPress={() => onPressedImage(4)}>
              {renderImage(images[4], { ...style.image, height: '100%' })}
            </TouchableWithoutFeedback>
          </View>
        </View>
      );
    }
  };

  const renderLayout6AndMore = () => {
    const imageRows = [
      [images[0], images[1]],
      [images[2], images[3]],
      [images[4], images[5]],
    ];
    return (
      <View style={{ flex: 1 }}>
        {imageRows.map((row, index) => (
          <View style={{ flex: 1 }} key={index}>
            <View
              style={{ flexDirection: 'row', flex: 1, alignItems: 'center' }}>
              <TouchableWithoutFeedback
                style={{ flex: 1 }}
                onPress={() => onPressedImage(index * 2)}>
                {renderImage(row[0], { ...style.image, height: '100%' })}
              </TouchableWithoutFeedback>
              <View style={{ width: 1 }} />
              <TouchableOpacity
                activeOpacity={1}
                style={{ flex: 1 }}
                onPress={() => onPressedImage(index * 2 + 1)}>
                {renderImage(row[1], { ...style.image, height: '100%' })}
                {images.length > 6 && index === imageRows.length - 1 && (
                  <View style={style.moreMask}>
                    <Text style={style.moreText}>
                      {'+' + (images.length - 6)}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {index < imageRows.length - 1 && <View style={{ height: 1 }} />}
          </View>
        ))}
      </View>
    );
  };

  if (images.length === 1) {
    return renderLayout1();
  }
  if (images.length === 2) {
    return renderLayout2();
  }
  if (images.length === 3) {
    return renderLayout3();
  }
  if (images.length === 4) {
    return renderLayout4();
  }
  if (images.length === 5) {
    return renderLayout5();
  }
  if (images.length >= 6) {
    return renderLayout6AndMore();
  }
  return <View />;
};

export default ImageThumbnailsView;
