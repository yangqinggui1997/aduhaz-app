import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import Utils from '../../commons/utils';

export default StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 10,
    backgroundColor: colors.white,
    paddingBottom: Utils.isIOS() ? initialWindowMetrics.insets.bottom : 0,
  },
  header: {
    height: wp(45),
    width: '100%',
    backgroundColor: colors.flatGrey04,
    paddingHorizontal: wp(12),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: wp(10),
    right: wp(15),
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.flatGrey05,
  },
  itemRow: {
    height: wp(34),
    paddingHorizontal: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    backgroundColor: colors.flatGrey11,
  },
  itemText: {
    fontSize: 13,
    color: colors.flatGrey05,
  },
});
