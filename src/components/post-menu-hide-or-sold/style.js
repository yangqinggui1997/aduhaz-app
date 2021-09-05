import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: wp(12),
    justifyContent: 'space-between',
  },
  headerView: {
    alignItems: 'center',
    paddingVertical: wp(5)
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.flatBlack,
  },
  closeButton: {
    position: 'absolute',
    right: wp(12),
    top: wp(0),
    bottom: wp(0),
  },
  hidePostDetails: {
    marginTop: wp(10),
    textAlign: 'center',
    marginHorizontal: wp(12)
  },
  selectReason: {
    textAlign: 'left',
    fontWeight: 'bold',
    marginTop: wp(20),
    marginHorizontal: wp(12)
  },
  itemReasonContainer: {
    flexDirection: 'row',
    height: wp(40),
    paddingHorizontal: wp(12),
    paddingVertical: wp(5),
    alignItems: 'center',
  },
  currency: {
    fontSize: 15,
    fontWeight: 'bold',
    position: 'absolute',
    right: wp(0),
  },
  selectedItemLabel: {
    fontWeight: 'bold'
  },
  itemLabel: {
    marginLeft: wp(5)
  },
  footerView: {
    paddingHorizontal: wp(12),
    marginVertical: wp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerButton: {
    paddingVertical: wp(5),
    width: '49%',
    borderColor: colors.flatBlack03,
    borderWidth: wp(1),
    borderRadius: wp(5),
    alignItems: 'center'
  },
  footerButtonTitle: {
    fontWeight: 'bold'
  },
  footerButtonEnable: {
    backgroundColor: colors.flatBlack03,
  },
  footerButtonTitleEnable: {
    color: colors.white,
  },
});
