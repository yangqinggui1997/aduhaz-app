import { Dimensions, PixelRatio, Platform } from 'react-native';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

// size of designs (pt)
const designWidth = 375;
const designHeight = 667;

export const widthPercentageToDP = widthPercent => {
  const elemWidth =
    typeof widthPercent === 'number' ? widthPercent : parseFloat(widthPercent);
  return PixelRatio.roundToNearestPixel((screenWidth * elemWidth) / 100);
};

export const heightPercentageToDP = heightPercent => {
  const elemHeight =
    typeof heightPercent === 'number'
      ? heightPercent
      : parseFloat(heightPercent);
  return PixelRatio.roundToNearestPixel((screenHeight * elemHeight) / 100);
};

export const wp = dimension => {
  return widthPercentageToDP((dimension / designWidth) * 100 + '%');
};
export const hp = dimension => {
  return heightPercentageToDP((dimension / designHeight) * 100 + '%');
};

const wScale = screenWidth / designWidth;
const hScale = screenHeight / designHeight;
const isIOS = Platform.OS === 'ios';

export const resPx = (size, based = 'width') => {
  const newSize = based === 'height' ? size * hScale : size * wScale;
  if (isIOS) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

export const resPxW = size => {
  return resPx(size);
};
export const resPxH = size => resPx(size, 'height');
