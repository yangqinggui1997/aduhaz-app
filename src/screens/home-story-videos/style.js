import { Dimensions, StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  positionAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  container: {
    flex: 1,
    marginTop: -initialWindowMetrics.insets.top,
  },
  safeAreaCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    borderColor: 'white',
    borderBottomWidth: 1,
    height: initialWindowMetrics.insets.top,
    backgroundColor: colors.white,
    zIndex: 99999,
  },
  logo: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35 / 2),
    borderColor: colors.red,
    borderWidth: wp(1),
  },
  navBar: {
    width: '100%',
    height: wp(44),
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  animatedNavBar: {
    zIndex: 999,
    elevation: 10,
  },
  fixedNavBar: {
    zIndex: 99999,
    elevation: 10,
  },
  userStoriesContainer: {
    flex: 1,
    backgroundColor: 'green',
    flexDirection: 'row',
  },
  storyPicturesView: {
    height: '100%',
    width: Dimensions.get('screen').width,
  },
  storyRow: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
