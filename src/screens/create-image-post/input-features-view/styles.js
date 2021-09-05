import { Dimensions, Platform, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollViewContainer: {
    paddingBottom: wp(12),
  },
  featureItem: {
    marginHorizontal: wp(12),
    marginTop: wp(20),
  },
  imageItem: {
    width: Dimensions.get('screen').width / 3,
    height: Dimensions.get('screen').width / 3,
  },
  imageContainer: {
    borderRadius: wp(5),
    flex: 1,
    overflow: 'hidden',
  },
  removeImageButton: {
    position: 'absolute',
    top: -wp(5),
    right: -wp(5),
    width: wp(21),
    height: wp(21),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageButton: {
    flex: 1,
    borderColor: colors.black,
    borderWidth: 1,
    borderRadius: wp(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  descriptionContainer: {
    flex: 1,
    // marginTop: wp(6),
    marginHorizontal: wp(6),
    padding: wp(6),
    borderWidth: 1,
    borderColor: colors.black,
    justifyContent: 'center',
    backgroundColor: '#d3f3fc',
  },
  listOptions: {
    borderWidth: 1,
    borderRadius: wp(4),
    width: '100%',
    marginTop: wp(6),
  },
  listOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 40,
    paddingHorizontal: 6,
    alignItems: 'center',
  },
  listOptionSeparator: { height: 1, backgroundColor: colors.flatGrey11 },
  buttonNext: {
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
