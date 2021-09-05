import { Dimensions, StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    height: 480,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  header: {
    height: wp(45),
    width: '100%',
    backgroundColor: colors.flatGrey04,
    paddingHorizontal: wp(12),
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 15,
    fontWeight: 'bold',
    color: colors.flatGrey05,
  },
  resetText: {
    fontWeight: '500',
    color: colors.primary,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.flatBlack01,
    marginLeft: 12,
  },
  listOptions: {
    marginHorizontal: 12,
    marginTop: 8,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.flatGrey11,
  },
  listOptionsSeparator: {
    height: 1,
    backgroundColor: colors.flatGrey11,
  },
  filterItem: {
    height: 34,
    paddingHorizontal: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterItemText: {
    fontSize: 13,
    marginLeft: 6,
  },
  applyButton: {
    height: wp(41),
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyText: {
    color: colors.white,
  },
  categoryContainer: {
    marginHorizontal: wp(12),
    marginVertical: wp(16),
    padding: wp(12),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: colors.flatGrey11,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  categoryTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.flatBlack01,
  },
  categoryName: {
    fontSize: 13,
    color: colors.primary,
    marginTop: wp(6),
  },
});
