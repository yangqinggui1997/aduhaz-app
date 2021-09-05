import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import Colors from '../../theme/colors';
export default StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: wp(16),
    marginBottom: wp(10),
  },
  logo: {
    width: wp(297),
    height: wp(72),
  },
  dots: {
    width: wp(44),
    marginTop: wp(40),
  },
  title: {
    fontSize: wp(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: wp(10),
    paddingLeft: wp(10),
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
  dropDown: {
    height: wp(40),
    borderWidth: wp(1),
    borderColor: Colors.grey,
    borderRadius: wp(20),
    marginTop: wp(10),
  },
  profileEditButtonView: {
    flexDirection: 'row-reverse',
    marginHorizontal: wp(16),
  },
  profileEdiText: {
    color: colors.white,
    fontWeight: 'bold',
  },
  profileEditButton: {
    padding: wp(10),
    paddingLeft: wp(20),
    paddingRight: wp(20),
    borderRadius: wp(20),

    backgroundColor: Colors.black,
  },
  profileEditButtonText: {
    color: Colors.white,
    textTransform: 'uppercase',
    fontSize: wp(13),
    minWidth: wp(100),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  textName: {
    fontSize: wp(15),
  },
  viewPicker: {
    zIndex: 10,
  },
  dropDownPicker: {
    // height: wp(90),
  },
  itemDropDownPicker: {
    justifyContent: 'flex-start',
  },
  dropDownActivePicker: {
    height: wp(90),
  },
  chooseFileButton: {
    // backgroundColor: Colors.grey,
    borderWidth: 0.5,
    borderRadius: wp(8),
    padding: wp(8),
    textAlign: 'center',
    borderColor: 'black',
    marginLeft: wp(16),
  },
  chooseFileButtonView: {
    flex: 1,
    paddingTop: wp(23),
  },
  fileInput: {
    flexDirection: 'row',
  },
  photoDes: {
    marginLeft: wp(5),
  },
  avatarView: {
    width: 'auto',
    height: wp(100),
    flexDirection: 'row',
  },
  postImage: {
    width: wp(80),
    height: wp(80),
  },
  avatarUpload: {
    width: wp(100),
    height: wp(100),
    // borderWidth: 1,
    zIndex: 1,
  },
  clearIcon: {
    position: 'absolute',
    left: wp(70),
    zIndex: 2,
    backgroundColor: colors.white,
    borderRadius: wp(20),
    top: -wp(5),
    width: wp(20),
    height: wp(20),
  },
  disabledButton: {
    backgroundColor: Colors.grey,
    padding: wp(10),
    paddingLeft: wp(20),
    paddingRight: wp(20),
    borderRadius: wp(20),
  },
  error: {
    color: Colors.red,
    // textAlign: 'right',
    margin: wp(16),
  },
});
