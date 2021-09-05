import { Dimensions, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import { pdV } from '../../commons/styles';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import colors from '../../theme/colors';

export default StyleSheet.create({
  positionAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
  logo: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35 / 2),
    borderColor: colors.red,
    borderWidth: wp(1),
  },
  safeAreaCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    borderColor: 'white',
    borderBottomWidth: 1,
    height: initialWindowMetrics.insets.top,
    backgroundColor: 'white',
    zIndex: 99999,
  },
  navBar: {
    width: '100%',
    height: wp(44),
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  animatedNavBar: {
    zIndex: 999,
    elevation: 10,
  },
  fixedNavBar: {
    zIndex: 99999,
    elevation: 10,
  },
  stories_container: {
    ...pdV(10),
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: colors.lightFlatGrey,
  },
  story: {
    width: 100,
    height: 150,
  },
  separator: {
    width: wp(10),
  },
  categoryList: {
    marginVertical: wp(10),
  },
  categoryItem: {
    paddingHorizontal: wp(12),
    height: wp(36),
    backgroundColor: 'red',
    borderRadius: wp(8),
    overflow: 'hidden',
    justifyContent: 'center',
  },
  categoryItemHighlight: {
    paddingHorizontal: wp(12),
    height: wp(36),
    backgroundColor: 'red',
    borderRadius: wp(8),
    overflow: 'hidden',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.primary
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.white,
  },
  featuredVideo: {
    width: '100%',
  },
  progressIndicatorContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
  socialPostItem: {
    width: '100%',
    borderBottomWidth: 1,
    borderColor: colors.lightFlatGrey,
  },
  imagePostsContainer: {
    width: Dimensions.get('window').width,
    borderBottomWidth: 1,
    borderColor: colors.lightFlatGrey,
    marginTop: wp(12)
  },
  videoMask: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
    backgroundColor: 'transparent',
  },
  videoSeparator: {
    height: wp(10),
    backgroundColor: colors.lightFlatGrey,
  }
});
