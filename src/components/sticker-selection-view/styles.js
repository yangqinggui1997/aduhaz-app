import { Dimensions, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(12),
  },
  listSeparator: {
    height: wp(1),
    marginVertical: wp(16),
    backgroundColor: colors.flatGrey11,
  },
  stickerContainer: {
    width: parseInt((Dimensions.get('screen').width - wp(36)) / 3),
    aspectRatio: 1,
    padding: wp(8),
  },
  stickerImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
