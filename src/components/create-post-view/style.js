import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import { Colors } from '../../theme';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    paddingHorizontal: wp(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
  },
  optionText: {
    fontSize: 15,
    fontWeight: '500',
    marginLeft: wp(10)
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  iconContainer: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    backgroundColor: colors.lightFlatGrey,
    alignItems: 'center',
    justifyContent: 'center'
  },
});
