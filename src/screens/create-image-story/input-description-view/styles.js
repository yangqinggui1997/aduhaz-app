import { Platform, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

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
    fontWeight: 'normal',
    padding: wp(16),
    marginVertical: wp(16),
    marginHorizontal: wp(16),
    backgroundColor: colors.flatGrey11,
    borderRadius: wp(5),
    textAlignVertical: 'center',
    minHeight: wp(50)
  },
  imagesContainer: {
    backgroundColor: colors.black,
    marginTop: wp(16),
    flex: 1,
  },
  stickerMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    resizeMode: 'stretch',
  },
  toolbarContainer: {
    width: '100%',
    height: wp(60),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: wp(16),
  },
  fontButton: {
    marginLeft: wp(20),
    borderRadius: wp(5),
    borderWidth: 1,
    borderColor: colors.black,
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
    borderColor: colors.flatGrey11,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeListButton: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(10),
    borderWidth: 2,
    borderColor: colors.flatGrey11,
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
  songAndTrimContainer: {
    height: wp(120),
  },
  songContainer: {
    height: wp(60),
    flexDirection: 'row',
    alignItems: 'center',
  },
  footer: {
    height: wp(60),
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: colors.flatGrey11,
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
    color: colors.black,
    fontSize: 10,
    textAlign: 'center',
  },
  musicIconContainer: {
    width: wp(50),
    height: wp(50),
    marginLeft: wp(10),
    borderRadius: wp(10),
    borderWidth: 1,
    borderColor: colors.flatGrey11,
    justifyContent: 'center',
    alignItems: 'center'
  },
  musicIcon: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
  },
  musicDetail: {
    marginLeft: wp(8),
    flex: 1,
  },
  author: {
    color: colors.flatGrey,
    fontSize: wp(12),
  },
  removeSongButton: {
    width: wp(20),
    height: wp(20),
    marginHorizontal: wp(8),
    justifyContent: 'center',
    alignItems: 'center',
  },
  trimSongContainer: {
    flex: 1,
    padding: wp(5),
  },
  trimSongTitle: {
    fontSize: 12,
    marginHorizontal: wp(5),
  },
  playButtonr: {
    padding: wp(5),
  },
  sliderStyle: {
    marginTop: wp(10),
  },
  sliderRailContainer: {
    height: wp(10),
    flex: 1,
    borderRadius: wp(5),
    backgroundColor: colors.flatGrey01,
  },
  sliderRailSelectedContainer: {
    height: wp(10),
    backgroundColor: colors.flatGrey,
  },
  sliderThumbContainer: {
    height: wp(20),
    width: wp(20),
    borderRadius: wp(20 / 2),
    backgroundColor: colors.flatBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderThumbInside: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(20 / 2),
    backgroundColor: colors.flatBlack,
  },
});
