import { Platform, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  contentInput: {
    width: '100%',
    paddingHorizontal: wp(16),
    marginVertical: Platform.OS === 'ios' ? wp(16) : 0,
  },
  descriptionContainer: {
    marginTop: wp(6),
    marginHorizontal: wp(6),
    padding: wp(6),
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
    backgroundColor: '#d3f3fc',
  },
  buttonNext: {
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
