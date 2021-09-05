import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  accountView: {
    height: wp(80),
    flexDirection: 'row',
    marginHorizontal: wp(14),
    alignItems: 'center',
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
    marginBottom: wp(10),
  },
  avatar: {
    width: wp(60),
    height: wp(60),
    borderRadius: wp(30),
    overflow: 'hidden',
    tintColor: Colors.flatGray,
    borderWidth: wp(1),
    borderColor: Colors.flatGray,
  },
  viewYourAccount: {
    fontSize: wp(14),
    color: Colors.flatGrey,
    marginLeft: wp(15),
  },
  paymentButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  flexDirectionRow: {
    flexDirection: 'row',
  },
  darkmodeView: {
    justifyContent: 'space-between',
  },
  balance: {
    color: Colors.flatGrey01,
  },
  meunuItem: {
    flexDirection: 'row',
    height: wp(38),
    alignItems: 'center',
    marginHorizontal: wp(14),
    marginTop: wp(10),
  },
  menuTitle: {
    fontSize: wp(13),
    fontWeight: '500',
    textAlignVertical: 'center',
    color: Colors.black,
    marginLeft: wp(10),
  },
  menuIcon: {
    width: wp(30),
    height: wp(30),
  },
  favoriteList: {
    paddingLeft: wp(30),
  },
  topBorder: {
    borderBottomColor: Colors.flatGrey01,
    borderTopWidth: wp(0.5),
  },
  logout: {
    marginBottom: wp(20),
  },
  list: {
    marginBottom: wp(10),
  },
  languageRow: {
    justifyContent: 'space-between',
  },
  selectedLanguage: {
    color: Colors.flatGrey01,
  },
});
