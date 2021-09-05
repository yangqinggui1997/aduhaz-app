import { Platform, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  inputContainer: {
    marginHorizontal: wp(12),
    marginTop: wp(20),
  },
  buttonNext: {
    // marginTop: wp(12),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: wp(40),
    backgroundColor: colors.flatGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNextTitle: {
    color: colors.white,
  },
});
