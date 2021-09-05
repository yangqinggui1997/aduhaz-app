import { Platform } from 'react-native';

const AndroidFonts = {
  Bold: 'OpenSans-Bold',
  BoldItalic: 'OpenSans-BoldItalic',
  ExtraBold: 'OpenSans-ExtraBold',
  ExtraBoldItalic: 'OpenSans-ExtraBoldItalic',
  Italic: 'OpenSans-Italic',
  Light: 'OpenSans-Light',
  LightItalic: 'OpenSans-LightItalic',
  Regular: 'OpenSans-Regular',
  SemiBold: 'OpenSans-SemiBold',
  SemiBoldItalic: 'OpenSans-SemiBoldItalic',
};

const IOSFonts = {
  Bold: 'OpenSans-Bold',
  BoldItalic: 'OpenSans-BoldItalic',
  ExtraBold: 'OpenSans-ExtraBold',
  ExtraBoldItalic: 'OpenSans-ExtraBoldItalic',
  Italic: 'OpenSans-Italic',
  Light: 'OpenSans-Light',
  LightItalic: 'OpenSans-LightItalic',
  Regular: 'OpenSans-Regular',
  SemiBold: 'OpenSans-SemiBold',
  SemiBoldItalic: 'OpenSans-SemiBoldItalic',
};

export const STORY_FONTS = [
  {
    title: 'Madurai',
    name: 'ArimaMadurai-ExtraBold',
  },
  {
    title: 'Bangers',
    name: 'Bangers-Regular',
  },
  {
    title: 'Charm',
    name: 'Charm-Regular',
  },
  {
    title: 'Amatic',
    name: 'AmaticSC-Bold',
  },
  {
    title: 'Dancing',
    name: 'DancingScript-Regular',
  },
  {
    title: 'Mali',
    name: 'Mali-Regular',
  },
  {
    title: 'Pacifico',
    name: 'Pacifico-Regular',
  },
  {
    title: 'Truculenta',
    name: 'Truculenta-Regular',
  },
  {
    title: 'Kaffee',
    name: 'YanoneKaffeesatz-Regular',
  },
];

const Fonts = Platform.select({
  android: AndroidFonts,
  ios: IOSFonts,
});

export default Fonts;
