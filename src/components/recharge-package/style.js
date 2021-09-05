import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  rechargePackage: {
    marginTop: wp(10),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.flatGrey01
  },
  rechargeTitle: {
    fontSize: wp(14),
    fontWeight: 'bold',
    paddingVertical: wp(10)
  },
  iconDropDown: {
    right: wp(10),
    position:'absolute',
    justifyContent: 'center'
  },
  itemRechargeContainer: {
    flexDirection: 'row',
    height: wp(50),
    paddingHorizontal: wp(10),
    paddingVertical: wp(5),
    alignItems: 'center',
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(1)
  },
  currency: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    right: wp(0),
  },
  list: {
    marginTop: wp(10),
   
    flexGrow: 0,
  },
  selectedItemLabel: {
    fontWeight: 'bold'
  },
  itemLabel: {
    marginLeft: wp(5)
  },
  depositNowContainer: {
    marginTop: wp(10),
    width: '100%',
    borderRadius: wp(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  depositNowButtonDisableColor: {
    backgroundColor: Colors.flatGrey01
  },
  depositNowButtonEnableColor: {
    backgroundColor: Colors.flatGreen,
  },
  depositNow: {
    fontSize: wp(14),
    fontWeight: 'bold',
    paddingVertical: wp(10),
    color: Colors.white
  },
  imageWallet: {
    width: wp(60),
    height: wp(60),
  },
  walletDetail: {
    marginTop: wp(20),
    justifyContent: 'space-around'
  },
  walletCoin: {
    fontSize: wp(14),
    fontWeight: 'bold'
  },
});
