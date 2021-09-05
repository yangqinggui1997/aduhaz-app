import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import Colors from '../../theme/colors';
export default StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 16,
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
    borderLeftWidth: wp(5),
    height: wp(24),
  },
  borderBottom: {
    flexDirection: 'row',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },
  inputData: {
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: wp(20),
    padding: wp(10),
    paddingLeft: wp(15),
    paddingRight: wp(25),
  },
  marginTop: {
    marginTop: wp(10),
  },
  textButtonDes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: wp(13),
  },
  loginButtonView: {
    flexDirection: 'row-reverse',
  },
  loginButton: {
    padding: wp(10),
    paddingLeft: wp(20),
    paddingRight: wp(20),
    borderRadius: wp(20),
    backgroundColor: Colors.black,
    alignItems: 'center',
  },
  loginButtonText: {
    color: Colors.white,
    textTransform: 'uppercase',
    fontSize: wp(13),
    minWidth: wp(100),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  fbBackgroud: {
    backgroundColor: Colors.blueFB,
    flexDirection: 'row',
  },
  ggBackgroud: {
    backgroundColor: Colors.redGoogle,
    flexDirection: 'row',
  },
  appleBackground: {
    backgroundColor: Colors.black,
    flexDirection: 'row',
  },
  textLoginBy: {
    color: Colors.white,
    fontSize: wp(13),
    paddingLeft: wp(8),
    alignItems: 'flex-end',
    // fontWeight: 'bold',
  },
  iconGG: {
    fontSize: wp(15),
    color: Colors.white,
  },
  iconFb: {
    fontSize: wp(15),
    color: Colors.white,
  },
  colorRed: {
    color: colors.red,
    fontSize: wp(12),
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
});
