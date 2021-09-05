import { Platform, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingBottom: wp(12),
  },
  separator: {
    height: 1,
    backgroundColor: colors.flatGrey11,
  },
  itemRow: {
    height: wp(34),
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemText: {
    fontSize: 13,
    color: colors.flatGrey05,
  },
  buttonNext: {
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
