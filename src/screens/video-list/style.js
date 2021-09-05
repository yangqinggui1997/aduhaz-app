import { StyleSheet, Platform } from 'react-native';
import colors from '../../theme/colors';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.flatBlack01,
  },
  navBar: {
    backgroundColor: colors.flatBlack01,
    marginTop: Platform.OS === 'ios' ? initialWindowMetrics.insets.top : 0,
  },
  safeAreaCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    borderColor: 'white',
    borderBottomWidth: 1,
    height: initialWindowMetrics.insets.top,
    backgroundColor: colors.flatBlack01,
    zIndex: 99999,
  },
  contentView: {
    flex: 1,
    backgroundColor: colors.flatBlack01,
  },
  videoContainer: {
    width: '100%',
  },
  itemSeparator: {
    height: wp(10),
    backgroundColor: colors.black,
  },
  listFooter: {
    width: wp(10),
  },
  placeholder: {
    height: 200,
    backgroundColor: colors.white,
  },
});
