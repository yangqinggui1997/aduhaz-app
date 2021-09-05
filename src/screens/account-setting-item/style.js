import { StyleSheet } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(16),
    // zIndex: 1,
  },
  header: {
    paddingBottom: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  titleHeader: {
    marginHorizontal: wp(10),
    fontWeight: 'bold',
  },
  save: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  borderBottom: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  disableButton: {
    color: colors.grey,
    fontSize: wp(18),
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    zIndex: 1,
  },
  itemContent: {
    paddingVertical: wp(10),
    marginBottom: wp(10),
    // backgroundColor: 'red'
    flexDirection: 'row',
  },
  titleItem: {
    fontSize: wp(14),
  },
  detailItem: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  valueItem: {
    color: colors.grey,
  },
  saveButton: {
    color: colors.green,
    fontSize: wp(18),
  },
  inputData: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: wp(5),
    padding: wp(10),
    paddingLeft: wp(15),
    paddingRight: wp(25),
  },
  inputDataPassword: {
    borderColor: colors.grey,
    borderBottomWidth: 2,
    padding: wp(10),
    paddingLeft: wp(5),
  },
  loadingText: {
    fontSize: wp(14),
    color: colors.grey,
  },
  marginTop: {
    marginTop: wp(10),
  },
  descriptionText: {
    fontStyle: 'italic',
    fontSize: wp(14),
  },
  textButtonDes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: wp(13),
  },
  colorRed: {
    color: colors.red,
  },
  sendButtonView: {
    flex: 1,
  },
  nextButton: {
    padding: wp(10),
    borderRadius: wp(5),
    backgroundColor: colors.primary,
  },
  forgotPasswordButtonText: {
    color: colors.white,
    textTransform: 'uppercase',
    fontSize: wp(13),
    minWidth: wp(100),
    textAlign: 'center',
    fontWeight: 'bold',
  },
  itemLinkAccount: {
    flexDirection: 'row',
    borderBottomColor: colors.grey,
    borderBottomWidth: 2,
    paddingBottom: wp(5),
    marginVertical: wp(5),
  },
  containerLink: {},
  linkItemText: {
    paddingLeft: wp(10),
    fontSize: wp(14),
    padding: wp(5),
  },
  linkItemButton: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  linkItemButtonTxt: {
    color: colors.redGoogle,
    textTransform: 'uppercase',
    paddingLeft: wp(10),
    fontSize: wp(14),
    padding: wp(5),
  },
  icon: {
    width: wp(25),
    height: wp(25),
  },
  viewPicker: {
    zIndex: 999,
    height: wp(200),
  },
  dropDownPicker: {
    // zIndex: 3
  },
  itemDropDownPicker: {
    justifyContent: 'flex-start',
  },
  dropDownActivePicker: {
    // zIndex: 4
  },
  errText: {
    color: colors.red,
    fontStyle: 'italic',
    textAlign: 'center',
    flex: 1,
  },
  error: {
    color: colors.red,
  },
});
