import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
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
  flexColum: {
    flexDirection: 'column',
  },
  title: {
    fontSize: wp(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 10,
    paddingLeft: 10,
  },
  borderBottom: {
    flexDirection: 'row',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },
  borderLeft: {
    borderLeftColor: Colors.primary,
    borderLeftWidth: 5,
    height: wp(24),
  },
  marginTop: {
    marginTop: 10,
  },
  des: {
    fontSize: wp(15),
  },
  sendButtonView: {
    // flexDirection: 'row-reverse',
  },
  forgotPasswordButton: {
    padding: wp(10),
    paddingLeft: wp(20),
    paddingRight: wp(20),
    borderRadius: wp(20),
    backgroundColor: Colors.primary,
  },
  forgotPasswordButtonText: {
    color: Colors.white,
    textTransform: 'uppercase',
    fontSize: wp(13),
    minWidth: wp(100),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  optionText: {
    color: Colors.primary,
    fontStyle: 'italic',
    fontSize: wp(13),
    maxWidth: wp(170),
  },
  changeOption: {
    flexDirection: 'row',
    paddingTop: wp(5),
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
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
