import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    height: wp(100),
    width: wp(100),
    backgroundColor: colors.white,
    borderRadius: wp(10),
  },
  textProgress: {
    color: colors.appYellow,
    marginTop: wp(10),
  },
});
