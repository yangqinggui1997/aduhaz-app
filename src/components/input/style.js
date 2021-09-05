import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import { wp } from '../../commons/responsive';

const EYE_ICON_SIZE = 20;
const CLEAR_ICON_SIZE = 16;

export default StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  label: {
    fontSize: 12,
    color: Colors.flatBlack,
    fontFamily: Fonts.Light,
    marginBottom: 0,
  },
  input: {
    flex: 1,
    paddingVertical: wp(8),
    paddingHorizontal: wp(8),
    fontSize: wp(16),
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
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.lightFlatGrey,
    paddingHorizontal: wp(8),
  },
  eye: {
    width: EYE_ICON_SIZE,
    height: EYE_ICON_SIZE,
  },
  iconContainer: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightFlatGrey,
    paddingVertical: 12,
  },
  clearContainer: {
    position: 'absolute',
    bottom: wp(10),
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
    fontSize: 13,
    color: Colors.flatSeaGreen,
  },
  requiredLbl: {
    fontFamily: Fonts.Regular,
    fontSize: wp(12),
    fontWeight: '400',
    color: Colors.flatBlack,
  },
});
