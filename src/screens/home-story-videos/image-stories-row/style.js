import { Dimensions, StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

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
    marginTop: -initialWindowMetrics.insets.top
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
  userStoriesContainer: {
    flex: 1,
    backgroundColor: 'green',
    flexDirection: 'row',
  },
  storyVideoView: {
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
