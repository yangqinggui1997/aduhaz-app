import { Platform, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.flatGrey11,
  },
  postButtonText: {
    fontWeight: 'bold',
  },
  contentInput: {
    width: '100%',
    paddingHorizontal: wp(16),
    marginVertical: Platform.OS === 'ios' ? wp(16) : 0,
  },
  categoryButton: {
    marginLeft: wp(16),
    paddingHorizontal: wp(10),
    paddingVertical: wp(4),
    borderWidth: 1,
    borderColor: colors.black,
    borderRadius: wp(5),
    alignSelf: 'baseline',
    marginTop: wp(4),
    flexDirection: 'row',
    alignItems: 'center',
  },
  videoContainer: {
    height: wp(200),
    backgroundColor: colors.flatGrey11,
    marginTop: wp(16),
  },
});
