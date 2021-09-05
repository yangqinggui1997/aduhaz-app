import React from 'react';
import { TouchableOpacity } from 'react-native';
import ImageView from '../image-view';

import style from './style';

const AdsBanner = ({ id, title, image }) => {
  return (
    <TouchableOpacity style={[style.adsBannerBtn]}>
      <ImageView
        source={image}
        resizeMode={ImageView.resizeMode.cover}
        style={style.image}
      />
    </TouchableOpacity>
  );
};

export default AdsBanner;
