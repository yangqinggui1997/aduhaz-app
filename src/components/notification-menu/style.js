import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Utils from '../../commons/utils';
import { flexRow, ml, pdH, pdV } from '../../commons/styles';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    paddingHorizontal: wp(16),
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
