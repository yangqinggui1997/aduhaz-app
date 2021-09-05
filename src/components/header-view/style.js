import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  navBar: {
    width: '100%',
    height: wp(44),
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey,
    zIndex: 99999,
    elevation: 10,
    overflow: 'hidden',
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  leftItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  spinningLogo: {
    width: wp(64),
    height: wp(64),
    marginLeft: -16,
  },
  logo: {
    width: wp(44),
    height: wp(44),
  },
  rightItems: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rightItem: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
  },
  notifyNumber: {
    position: 'absolute',
    right: -5,
    top: 0,
    width: 20,
    height: 20,
    zIndex: 999,
    backgroundColor: colors.red,
    borderRadius: 20 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notifyNumberText: {
    textAlign: 'center',
    fontSize: 8,
    fontWeight: 'bold',
    color: colors.white,
  },
});
