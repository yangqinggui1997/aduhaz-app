import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: wp(20),
    bottom: wp(20),
    width: wp(32),
    height: wp(32),
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: wp(16),
    borderWidth: wp(2),
    borderColor: colors.black,
    backgroundColor: colors.white,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 0,
      height: wp(1),
    },
    shadowRadius: wp(1),
    shadowOpacity: 1,
  },
  icon: {
    color: '#fff',
    fontSize: wp(40),
  },
});
