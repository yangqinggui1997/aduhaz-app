import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
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
  topView: {
    flexDirection: 'row',
    paddingHorizontal: wp(14),
    paddingVertical: wp(7),
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
    borderTopWidth: wp(0.5),
    borderTopColor: colors.flatGrey01
  },
  balance: {
    color: Colors.primary,
    textTransform: 'uppercase',
    fontWeight: 'bold',
    fontSize: wp(12)
  },
  balanceNumber: {
    marginLeft: wp(30),
    fontSize: wp(12)
  },
  list: {
    flex: 1,
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5)
  },
  headerView: {
    flexDirection: 'row',
    paddingHorizontal: wp(14),
    paddingVertical: wp(7),
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
  },
  headerText: {
    width: '33.3%',
    color: colors.primary,
    textTransform: 'uppercase',
    fontSize: wp(12)
  },
  itemContainer: {
    flexDirection: 'row',
    paddingHorizontal: wp(14),
    paddingVertical: wp(5),
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
  },
  paymentCode: {
    fontSize: wp(11),
    width: '35%',
    textAlignVertical: 'center'
  },
  paymentDetailsView: {
    width: '50%',
  },
  paymentDetails: {
    fontSize: wp(11)
  },
  statusView: {
    width: '15%',
    alignItems: 'center',
    justifyContent: 'center'
  },
  rechargePackage: {
    paddingHorizontal: wp(14),
    marginBottom: wp(14),
  },
});
