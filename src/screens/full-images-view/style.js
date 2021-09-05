import { Dimensions, StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.black,
  },
  imageList: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.transparent,
  },
  imageContainer: {
    width: Dimensions.get('screen').width, 
    height: Dimensions.get('screen').height,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  closeButton: {
    position: 'absolute',
    top: wp(initialWindowMetrics.insets.top),
    right: wp(16),
    width: 50,
    height: 50,
    justifyContent: 'center',
  },
});
