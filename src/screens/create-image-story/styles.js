import { Dimensions } from 'react-native';
import { Platform, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.black,
  },
  separator: {
    height: 1,
    backgroundColor: colors.flatGrey11,
  },
  postButtonText: {
    fontWeight: 'bold',
  },
  imageListContainer: {
    height: wp(100),
    width: '100%',
    paddingVertical: 2,
  },
  imageItem: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 5,
    overflow: 'hidden',
  },
  imageItemHighlight: {
    borderWidth: 3,
    borderColor: colors.appYellow,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: -wp(0),
    right: -wp(0),
    width: wp(21),
    height: wp(21),
    justifyContent: 'center',
    alignItems: 'center',
  },
  addImageItem: {
    height: '100%',
    aspectRatio: 1,
    borderRadius: 5,
    overflow: 'hidden',
    borderColor: colors.white,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: wp(2)
  },
  editImageContainer: {
    width: Dimensions.get('screen').width,
    height: '100%',
    justifyContent: 'center',
  },
  footer: {
    height: wp(80),
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerButton: {
    width: wp(60),
    alignItems: 'center',
  },
  footerIcon: {
    height: wp(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    color: colors.white,
    fontSize: 10,
    textAlign: 'center',
  },
  addTextStickerContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    width: '100%',
  },
});
