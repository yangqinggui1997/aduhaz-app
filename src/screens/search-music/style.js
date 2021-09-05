import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(16),
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  backButton: {
    alignItems: 'center',
    width: wp(60),
    marginLeft: wp(10),
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
    paddingHorizontal: 20,
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
      flex: 1
  }
});
