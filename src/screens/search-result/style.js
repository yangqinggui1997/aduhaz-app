import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: wp(16),
    backgroundColor: colors.white,
    padding: wp(10),
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
  rightButton: {
    alignItems: 'center',
    minWidth: wp(70),
    marginLeft: wp(10),
  },
  rightButtonTitle: {
    fontWeight: 'bold',
    color: colors.flatBlack02,
  },
  filterBar: {
    width: '100%',
    flexDirection: 'row',
    height: wp(40),
    borderTopWidth: 1,
    borderColor: colors.lightFlatGrey,
    borderBottomWidth: 1,
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  postView: {
    flexDirection: 'row',
    paddingHorizontal: wp(12),
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
    paddingVertical: wp(5),
    marginBottom: wp(5),
  },
  postImage: {
    width: wp(120),
    height: wp(90),
    borderRadius: wp(10),
  },
  postDetails: {
    marginLeft: wp(10),
    width: wp(screenWidth - 180),
    justifyContent: 'center',
  },
  postTime: {
    fontSize: wp(12),
    color: colors.flatGrey01,
  },
  postName: {
    fontSize: wp(13),
    fontWeight: '500',
  },
  priceView: {
    flexDirection: 'row',
  },
  currency: {
    fontWeight: 'bold',
    color: colors.crimsonRed,
    fontSize: wp(14),
  },
  price: {
    color: colors.crimsonRed,
    fontSize: wp(14),
    fontWeight: 'bold',
  },
});
