import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, TouchableWithoutFeedback, ScrollView } from 'react-native';
import _ from 'lodash';
import ImageView from '../image-view';
import Utils from '../../commons/utils';
import Images from '../../assets/images';
import styles from './style';

const ImageSwiper = ({
  images = [], // array of url string
  selectedIndex = 0,
  onPress = null,
  renderCustomIndicator = null,
  style = null,
  resizeMode = ImageView.resizeMode.contain,
  itemSpacing = 0,
  itemWidth = Utils.getScreenWidth(),
  borderRadius = 0,
}) => {
  const [index, setIndex] = useState(selectedIndex);
  const [routes, setRoutes] = useState([]);
  const scrollView = useRef(null);

  useEffect(() => {
    setRoutes(images.map((url, i) => ({ key: `tab_${i}`, url, id: i })));
  }, [images]);

  const onImagePress = useCallback(
    _index => {
      if (Utils.isFunction(onPress)) {
        onPress(_index);
      }
    },
    [onPress],
  );

  const renderIndicator = useCallback(
    (currentIndex, allSize) => {
      if (Utils.isFunction(renderCustomIndicator)) {
        return renderCustomIndicator(currentIndex, allSize);
      } else {
        // render default indicator
        const listIndicator = [...Array(allSize)].map((_, i) => (
          <View
            style={[
              styles.normalDot,
              i === currentIndex && styles.activeDot,
              styles.nthDot,
            ]}
            key={`${i}`}
          />
        ));
        return <View style={[styles.indicatorContainer]}>{listIndicator}</View>;
      }
    },
    [renderCustomIndicator],
  );

  const renderScene = useCallback(
    (route, _index) => {
      let source = route.url;
      if (_.isString(route.url)) {
        source = {
          uri: route.url,
          priority: ImageView.priority.normal,
        };
      }
      let imageViewMarginRight = {};

      if (route.id < routes.length - 1) {
        imageViewMarginRight = { marginRight: itemSpacing };
      }

      return (
        <TouchableWithoutFeedback
          key={`${route.id}-${_index}`}
          onPress={() => onImagePress(route.id)}>
          <ImageView
            style={[
              styles.imageView,
              { width: itemWidth, borderRadius },
              imageViewMarginRight,
            ]}
            source={source}
            resizeMode={resizeMode}
            placeholderImage={Images.empty_image_banner}
          />
        </TouchableWithoutFeedback>
      );
    },
    [
      borderRadius,
      itemSpacing,
      itemWidth,
      routes.length,
      onImagePress,
      resizeMode,
    ],
  );

  const onMomentumScrollEnd = useCallback(
    event => {
      const scrollX = event.nativeEvent.contentOffset.x;
      console.log('scrollX - ', scrollX);
      const newPage = Math.floor(
        parseInt(scrollX, 10) / parseInt(itemWidth, 10),
      );
      console.log('currentPage - ', newPage);
      if (newPage !== index) {
        setIndex(newPage);
      }
    },
    [index, itemWidth],
  );

  const scrollToPage = pageIndex => {
    if (scrollView.current) {
      scrollView.current.scrollTo({
        x: itemWidth * pageIndex,
        y: 0,
        animated: true,
      });
    }
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        style={styles.scrollContainer}
        ref={scrollView}
        showsHorizontalScrollIndicator={false}
        horizontal={true}
        pagingEnabled={true}
        scrollEventThrottle={64}
        bounces={false}
        onMomentumScrollEnd={onMomentumScrollEnd}>
        {routes.map((route, _index) => renderScene(route, _index))}
      </ScrollView>
      {routes.length > 1 && renderIndicator(index, routes.length)}
    </View>
  );
};

export default ImageSwiper;
