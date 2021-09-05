import { StyleSheet, Platform } from 'react-native';
import PaletteColor from '../../theme/colors';
import Utils from '../../commons/utils';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: PaletteColor.transparent,
  },
  normalDot: {
    backgroundColor: PaletteColor.flatGrey,
    width: 5,
    height: 5,
    borderRadius: 5 / 2,
    marginLeft: 7,
    marginRight: 7,
  },
  activeDot: {
    backgroundColor: PaletteColor.red,
  },
  closeButton: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 40,
    height: 40,
    backgroundColor: PaletteColor.black,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
  },
  closeImage: {
    width: 20,
    height: 20,
  },
  indicatorContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: PaletteColor.transparent,
  },
  closeBtn: {
    position: 'absolute',
    top: wp(32),
    left: wp(10),
    zIndex: 9999,
    width: wp(34),
    height: wp(34),
    borderRadius: wp(34 / 2),
    borderColor: PaletteColor.flatGrey13,
    borderWidth: 1 / 2,
    backgroundColor: PaletteColor.flatWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: PaletteColor.flatGrey13,
  },
});
