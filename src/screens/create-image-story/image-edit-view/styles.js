import { StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  stickersContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: wp(60),
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
});
