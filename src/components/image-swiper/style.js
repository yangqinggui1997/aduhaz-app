import { StyleSheet } from 'react-native';
import PaletteColor from '../../theme/colors';

const DOT_SIZE = 8;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletteColor.white,
  },
  scrollContainer: {
    overflow: 'visible',
  },
  normalDot: {
    backgroundColor: PaletteColor.flatGrey,
    width: DOT_SIZE,
    height: DOT_SIZE,
    borderRadius: DOT_SIZE / 2,
  },
  activeDot: {
    backgroundColor: PaletteColor.red,
  },
  nthDot: {
    marginLeft: DOT_SIZE / 2,
  },
  lastDot: {
    marginLeft: DOT_SIZE + 2,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PaletteColor.transparent,
  },
  imageView: {
    borderRadius: 12,
  },
});
