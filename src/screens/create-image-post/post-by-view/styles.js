import { Platform, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  optionList: {
    marginTop: wp(6),
    marginHorizontal: wp(12),
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: colors.black,
  },
  optionContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
  },
  optionText: {
    fontWeight: 'bold',
    marginLeft: wp(10),
  },
  descriptionContainer: {
    marginTop: wp(6),
    marginHorizontal: wp(12),
    padding: wp(6),
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
    backgroundColor: '#d3f3fc',
  },
  buttonNext: {
    // marginTop: wp(12),
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    width: '100%',
    height: wp(40),
    backgroundColor: colors.flatGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonNextTitle: {
    color: colors.white,
  },
});
