import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: wp(12),
    paddingHorizontal: wp(12),
    justifyContent: 'space-between',
  },
  closeButton: {
    alignItems: 'flex-end'
  },
  pushPostPackage: {
    marginTop: wp(20),
    borderWidth: wp(1),
    borderRadius: wp(4),
    borderColor: colors.flatGrey01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp(10),
    paddingHorizontal: wp(14),
    marginBottom: wp(10),
  },
  pushPostDetails: {
    width: '80%',
  },
  pushPostIcon: {
    width: '20%',
    alignItems: 'flex-end',
  },
  icon: {
    width: wp(30),
    height: wp(30),
  },
  pushPostTitle: {
    fontSize: wp(14),
    fontWeight: '600',
  },
  pushPostPrice: {
    color: colors.flatGreen,
    fontSize: wp(14),
    marginTop: wp(5),
  },
  pushPostDes: {
    fontSize: wp(12),
    color: colors.flatGrey01,
    marginTop: wp(5),
  },
  selectDateTitle: {
    fontSize: wp(18),
    fontWeight: 'bold',
  },
  datePushView: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
    borderColor: colors.flatGrey,
    borderWidth: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDatePushView: {
    backgroundColor: colors.flatGreen,
    borderColor: colors.flatGreen,
    borderWidth: wp(1),
  },
  dateAmount: {
    color: colors.black,
  },
  itemDateContainer: {
    marginRight: wp(10),
  },
  discountView: {
    width: wp(30),
    height: wp(20),
    borderRadius: wp(9),
    borderColor: colors.red,
    borderWidth: wp(1),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(10)
  },
  discount: {
    fontSize: wp(10),
    color: colors.red,
  },
  actionButton: {
    height: 40,
    backgroundColor: colors.lightFlatGrey,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: wp(10)
  },
  actionButtonTitle: {
    color: colors.flatGrey01,
    textTransform: 'uppercase'
  }
});
