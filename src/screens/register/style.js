import { words } from 'lodash';
import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(16),
  },
  logo: {
    width: wp(297),
    height: wp(72),
  },
  dots: {
    width: wp(44),
    marginTop: 40,
  },
  title: {
    fontSize: wp(16),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
  },
  borderLeft: {
    borderLeftColor: Colors.primary,
    borderLeftWidth: 5,
    height: wp(24),
  },
  borderBottom: {
    flexDirection: 'row',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },
  iconInput: {
    width: wp(20),
    fontSize: wp(14),
    color: Colors.grey,
    textAlign: 'center',
  },
  iconFontAwesomeInput: {
    width: wp(20),
    fontSize: wp(13),
    textAlign: 'center',
    color: Colors.grey,
  },
  iconEvilIconsInput: {
    width: wp(20),
    fontSize: wp(20),
    textAlign: 'center',
    color: Colors.grey,
  },
  marginTop: {
    marginTop: wp(10),
  },
  registerButtonView: {
    marginVertical: wp(20),
    flex: 1,
  },
  registerButton: {
    padding: wp(10),
    paddingLeft: wp(20),
    paddingRight: wp(20),
    borderRadius: wp(20),
    backgroundColor: Colors.black,
  },
  disabledRegisterButton: {
    padding: wp(10),
    paddingLeft: wp(20),
    paddingRight: wp(20),
    borderRadius: wp(20),
    backgroundColor: Colors.flatGrey01,
  },
  fbBackgroud: {
    backgroundColor: Colors.blueFB,
    flexDirection: 'row',
  },
  appleBackground: {
    backgroundColor: Colors.black,
    flexDirection: 'row',
  },
  ggBackgroud: {
    backgroundColor: Colors.redGoogle,
    flexDirection: 'row',
  },
  textRegisterBy: {
    color: Colors.white,
    fontSize: wp(13),
    paddingLeft: 8,
  },
  registerButtonText: {
    color: Colors.white,
    textTransform: 'uppercase',
    fontSize: wp(13),
    minWidth: wp(100),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  checkbox: {
    height: wp(20),
    width: wp(20),
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  registerTerm: {
    flexDirection: 'row',
  },
  registerTermDes: {
    flexDirection: 'row',
    marginLeft: 5,
  },
  registerTermText: {
    fontSize: wp(13),
  },
  registerTermTextLink: {
    color: Colors.primary,
    textDecorationLine: 'underline',
    fontSize: wp(13),
    // fontWeight: 'bold',
  },
  registerTermMark: {
    fontSize: wp(15),
    width: wp(18),
    height: wp(18),
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.white,
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: wp(3),
    // backgroundColor: Colors.grey,
  },
  registerTermMarkChecked: {
    fontSize: wp(15),
    width: wp(18),
    height: wp(18),
    textAlign: 'center',
    fontWeight: 'bold',
    color: Colors.white,
    backgroundColor: Colors.primary,
  },
  navBar: {
    flexDirection: 'row',
    // justifyContent: 'space-evenly',
  },
  iconNav: {
    fontSize: wp(30),
    color: Colors.black,
  },
  divider: {
    width: '100%',
    height: wp(1),
    backgroundColor: Colors.flatGrey,
    marginVertical: wp(10),
  },
  titleDivider: {
    color: Colors.flatGrey,
    fontSize: wp(14),
    backgroundColor: Colors.white,
    textAlign: 'center',
    paddingRight: wp(10),
    paddingLeft: wp(10),
  },
  titleDividerView: {
    position: 'absolute',
    top: -wp(10),
    alignSelf: 'center',
  },
  textError: {
    color: Colors.red,
  },
});
