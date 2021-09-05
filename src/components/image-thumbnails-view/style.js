import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  image: {
    flex: 1,
    borderRadius: 5,
    overflow: 'hidden'
  },
  moreMask: {
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.flatGrey01,
    borderRadius: 5,
    opacity: 0.9
  },
  moreText: {
    fontSize: wp(20),
    fontWeight: 'bold',
    color: colors.white
  },
  transparentMask: {
    backgroundColor: 'rgba(0, 0, 0, 0.12)',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  }
});
