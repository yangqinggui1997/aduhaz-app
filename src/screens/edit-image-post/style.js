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
  scrollContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  childContainer: {
    height: '100%',
    width: Dimensions.get('screen').width,
  },
});
