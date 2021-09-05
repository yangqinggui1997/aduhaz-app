import React, { useState } from 'react';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import images from '../../assets/images';
import Utils from '../../commons/utils';

const ImageView = ({
  placeholderImage,
  source,
  children,
  height,
  width,
  ...props
}) => {
  const [isError, setError] = useState(false);

  const onError = () => {
    console.log('on load error: ', source);
    setError(true);
  };

  let imageSrc = source;
  if (
    isError ||
    (imageSrc.hasOwnProperty('uri') && Utils.isEmptyString(imageSrc.uri))
  ) {
    imageSrc = placeholderImage;
  }

  return (
    <FastImage
      {...props}
      onError={onError}
      source={imageSrc}
      style={props.style}>
      {children}
    </FastImage>
  );
};

ImageView.resizeMode = {
  ...FastImage.resizeMode,
};

ImageView.priority = {
  ...FastImage.priority,
};

ImageView.preload = sources => {
  FastImage.preload(sources);
};

ImageView.propTypes = {
  ...FastImage.propTypes,
  placeholderImage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};

ImageView.defaultProps = {
  placeholderImage: images.empty,
  children: null,
};

export default ImageView;
