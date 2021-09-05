import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentView: {
    flex: 1,
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 10,
    paddingHorizontal: wp(14),
  },
  list: {
    flex: 1,
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
  },
  // item post
  itemContainer: {
    flexDirection: 'column',
    marginBottom: wp(10),
    width: '50%',
  },
  evenItemContainer: {
    paddingLeft: wp(5),
    paddingRight: wp(14),
  },
  oddItemContainer: {
    paddingRight: wp(5),
    paddingLeft: wp(14),
  },
  itemImage: {
    width: '100%',
    height: wp(200),
    alignItems: 'flex-end',
  },
  itemName: {
    width: '80%',
    marginTop: wp(10),
    fontSize: wp(13),
    fontWeight: '500',
  },
  priceView: {
    flexDirection: 'row',
  },
  price: {
    lineHeight: wp(25),
    color: Colors.crimsonRed,
    fontSize: wp(14),
    fontWeight: 'bold',
    marginRight: wp(3),
  },
  currency: {
    fontWeight: 'bold',
    lineHeight: wp(25),
    color: Colors.crimsonRed,
    fontSize: wp(14),
  },
  pushToTopView: {
    width: '80%',
    alignItems: 'center',
    marginBottom: wp(5),
    backgroundColor: Colors.lightFlatGrey,
    borderRadius: wp(4),
    paddingVertical: wp(5),
  },
  pushToTop: {
    color: Colors.flatGreen,
  },
  iconImage: {
    width: wp(26),
    height: wp(26),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(10),
    marginBottom: wp(5),
  },
  imageCount: {
    color: Colors.white,
    fontSize: wp(13),
    fontWeight: '500',
    marginRight: wp(2),
  },
  innerView: {
    flexDirection: 'column',
  },
  menu: {
    position: 'absolute',
    bottom: wp(25),
    right: wp(10)
  },
  nameView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chartView: {
    alignItems: 'center',
    flexDirection: 'row',
    marginTop: wp(5),
  },
  bottomSeparator: {
    height: wp(10),
    width: '100%',
    backgroundColor: Colors.lightFlatGrey,
  },
  statistical: {
    fontSize: wp(12),
    marginLeft: wp(5),
    fontWeight: 'bold',
  },
  time: {
    position: 'absolute',
    right: wp(0),
    fontSize: wp(12),
    color: Colors.flatGrey01,
  },
  missingInfo: {
    fontWeight: 'bold',
    color: Colors.crimsonRed,
    textDecorationLine: 'underline',
  },
  listFilter: {
    flexGrow: 0,
    marginVertical: wp(5),
    borderBottomWidth: wp(1),
    borderBottomColor: Colors.flatGrey01,
    paddingHorizontal: wp(14),
  },
  tab: {
    flexDirection: 'row',
    marginBottom: wp(5),
    marginRight: wp(10),
  },
  selectedTab: {
    borderBottomWidth: wp(2),
    borderBottomColor: Colors.primary,
  },
  selectedTabTitle: {
    fontSize: wp(14),
    fontWeight: 'bold',
  },
  tabTitle: {
    fontSize: wp(14),
    fontWeight: 'normal',
  },
  rechargePackage: {
    paddingHorizontal: wp(14),
    marginBottom: wp(14),
  },
  bottomContent: {
    paddingHorizontal: 5,
    marginBottom: 10,
  },
});
