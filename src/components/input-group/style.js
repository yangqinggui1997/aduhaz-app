import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { wp } from '../../commons/responsive';

const EYE_ICON_SIZE = wp(20);
const CLEAR_ICON_SIZE = wp(16);

export default StyleSheet.create({
  container: {
    marginVertical: wp(8),
  },
  input: {
    flex: 1,
    paddingVertical: wp(10),
    paddingHorizontal: wp(8),
    fontSize: wp(13),
    fontFamily: Fonts.Book,
    color: Colors.flatBlack,
  },
  inputFocused: {
    borderBottomColor: Colors.flatBlack,
  },
  inputError: {
    borderBottomColor: Colors.flatRed01,
  },
  inputContainer: {
    height: wp(37),
    flexDirection: 'row',
    alignItems: 'center',
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: wp(20),
    paddingLeft: wp(8),
    paddingRight: wp(8),
  },
  eye: {
    width: EYE_ICON_SIZE,
    height: EYE_ICON_SIZE,
  },
  iconContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightFlatGrey,
    paddingVertical: wp(8),
  },
  clearContainer: {
    position: 'absolute',
    bottom: wp(8),
    right: 0,
  },
  clearFocused: {
    borderBottomColor: Colors.flatBlack,
  },
  clearIcon: {
    marginBottom: 3,
    width: CLEAR_ICON_SIZE,
    height: CLEAR_ICON_SIZE,
  },
  edit: {
    fontSize: wp(13),
    color: Colors.flatSeaGreen,
  },
  requiredLbl: {
    fontFamily: Fonts.Regular,
    fontSize: wp(13),
    fontWeight: '400',
    color: Colors.flatBlack,
  },
});
