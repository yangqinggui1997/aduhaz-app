import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  inputBox: {
    borderWidth: 1,
    borderRadius: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    height: wp(40),
    marginTop: wp(6),
    paddingHorizontal: wp(6),
  },
  inputBoxDisabled: {
    borderColor: colors.flatGrey11,
  },
  textDisabled: {
    color: colors.flatGrey11,
  },
  input: {
    flex: 1,
  },
  touchMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
});
