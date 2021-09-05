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
  backButton: {
    alignItems: 'center',
    marginLeft: wp(10),
  },
  clearButton: {
    alignItems: 'center',
    width: wp(70),
    marginLeft: wp(10),
  },
  screenTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.flatBlack02,
    textAlign: 'center',
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
    color: colors.flatBlack,
  },
  listView: {
    padding: wp(16),
  },
});
