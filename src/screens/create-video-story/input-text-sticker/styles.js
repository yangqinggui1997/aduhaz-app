import { Platform, Dimensions, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  doneButton: {
    position: 'absolute',
    top: 9,
    right: 0,
    padding: 16,
  },
  inputContainer: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    fontWeight: 'normal',
    textAlign: 'center',
    fontSize: 40,
    textAlignVertical: 'center',
    justifyContent: 'center',
    color: colors.white,
  },
  toolbarContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'android' ? 30 : 0,
    width: '100%',
    left: 0,
    height: wp(60),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fontButton: {
    marginLeft: wp(20),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: colors.white,
    width: wp(80),
    height: wp(36),
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconColor: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeListButton: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 2,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp(16),
  },
  selectedDot: {
    width: wp(8),
    height: wp(8),
    borderRadius: wp(4),
    backgroundColor: colors.white,
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
