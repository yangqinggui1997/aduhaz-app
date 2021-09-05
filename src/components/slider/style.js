import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  thumb: {
    width: 12 * 2,
    height: 12 * 2,
    borderRadius: 12,
    backgroundColor: colors.white,
    shadowColor: 'rgba(0,0,0,0.4)',
    shadowOffset: {
      width: 0,
      height: wp(1),
    },
    shadowRadius: wp(1),
    shadowOpacity: 1,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.flatGrey11,
  },
  highlightTrack: {
    height: 4,
    backgroundColor: colors.primary,
    borderRadius: 2,
  },
});
