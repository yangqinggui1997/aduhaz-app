import { random } from 'lodash';
import { Dimensions, Platform, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.flatGrey11,
  },
  postButtonText: {
    fontWeight: 'bold',
  },
  videoContainer: {
    flex: 1,
    backgroundColor: colors.black,
  },
  stickersContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  sticker: {
    width: wp(150),
    height: wp(150),
    resizeMode: 'contain',
  },
  header: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 10,
    height: wp(80),
    alignItems: 'center',
  },
  footer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: wp(80),
    // backgroundColor: colors.transparent80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButton: {
    width: wp(60),
    alignItems: 'center',
  },
  footerIcon: {
    height: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.white,
    fontSize: 10,
    textAlign: 'center',
  },
  addTextStickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
  },
});
