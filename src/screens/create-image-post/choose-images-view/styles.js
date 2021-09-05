import { Dimensions, Platform, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
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
  imagesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: wp(16),
  },
  imageItem: {
    width: Dimensions.get('screen').width / 3,
    height: Dimensions.get('screen').width / 3,
    padding: wp(4),
  },
  addImageContainer: {
    width: '100%',
    height: Dimensions.get('screen').width / 3,
    paddingHorizontal: wp(12),
    paddingVertical: wp(4)
  },
  notice: {
    marginTop: wp(5)
  },
  imageContainer: {
    borderRadius: wp(5),
    flex: 1,
    overflow: 'hidden',
  },
  addImageButton: {
    flex: 1,
    borderColor: colors.black,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageIcon: {
    width: 21,
    height: 21,
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
  buttonNext: {
    width: '100%',
    height: wp(40),
    backgroundColor: colors.flatGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(16),
  },
  buttonNextTitle: {
    color: colors.white,
  },
});
