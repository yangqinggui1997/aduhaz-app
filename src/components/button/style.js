import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 8,
  },
  text: {
    lineHeight: 20,
  },
  hasIcon: {
    flexDirection: 'row',
    position: 'relative',
  },
  leftIcon: {
    position: 'absolute',
    left: wp(17),
    top: wp(10),
  },
  disabled: {
    backgroundColor: Colors.transparentBlack10,
  },
});
