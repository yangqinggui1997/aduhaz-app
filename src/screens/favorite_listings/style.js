import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentView: {
    flex: 1,
    paddingHorizontal: wp(14),
  },
  filterView: {
    flexDirection: 'row',
    marginBottom: wp(10),
    alignItems: 'center',
  },
  filter: {
    fontSize: wp(12),
    marginRight: wp(5),
    color: Colors.flatGrey01,
  },
  filterLocation: {
    fontSize: wp(12),
    marginLeft: wp(5),
    color: Colors.flatGrey01,
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'column',
    marginBottom: wp(10),
  },
  lastItem: {
    marginBottom: wp(30),
  },
  itemImage: {
    width: '100%',
    height: wp(200),
  },
  itemName: {
    width: '90%',
    marginTop: wp(10),
    fontSize: wp(13),
    fontWeight: '500',
  },
  priceView: {
    marginTop: wp(4),
    flexDirection: 'row',
  },
  price: {
    color: Colors.crimsonRed,
    fontSize: wp(14),
    fontWeight: 'bold',
    marginRight: wp(3)
  },
  currency: {
    fontWeight: 'bold',
    color: Colors.crimsonRed,
    fontSize: wp(14),
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: wp(5),
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5)
  },
  time: {
    flexWrap: 'wrap',
    lineHeight: wp(22),
    color: Colors.flatGrey03,
    marginLeft: wp(5),
    marginRight: wp(7),
  },
  imageContainer: {
    width: '100%',
    backgroundColor: Colors.flatGrey10,
  },
  iconImage: {
    width: wp(26),
    height: wp(26),
    alignItems:'center',
    justifyContent: 'center',
    position: 'absolute',
    top: wp(10),
    right: wp(10),
  },
  imageCount: {
    color: Colors.white,
    fontSize: wp(13),
    fontWeight: '500',
    marginRight: wp(2)
  },
  innerView: { 
    flexDirection: 'column'
  },
  favoriteImage: {
    marginTop: wp(10),
  },
  nameView: {
    flexDirection:'row',
    justifyContent: 'space-between', 
    alignItems: 'center'
  }
});
