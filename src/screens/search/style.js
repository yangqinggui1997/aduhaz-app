import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: wp(10),
  },
  rightButton: {
    alignItems: 'center',
    marginLeft: wp(10),
    marginRight: wp(10),
  },
  searchInputContainer: {
    borderRadius: wp(20),
    flexDirection: 'row',
    flex: 1,
    height: wp(40),
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.flatBlack02,
    alignItems: 'center',
    paddingLeft: 16,
    paddingRight: 8,
  },
  searchInput: {
    height: '100%',
    flex: 1,
    borderWidth: 0,
  },
  searchItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchItemText: {
    marginHorizontal: 10,
    fontWeight: 'bold',
    flex: 1,
  },
  rightButtonTitle: {
    fontWeight: 'bold',
    color: colors.flatBlack02,
  },
  listView: {
    padding: wp(16),
  },
  viewAllHistoryButton: {
    paddingHorizontal: wp(16),
    paddingTop: wp(16),
    alignItems: 'flex-end',
  },
  viewAllHistoryText: {
    fontWeight: 'bold',
    color: colors.flatBlack02,
    textDecorationLine: 'underline',
  },
});
