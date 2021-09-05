import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
const screenWidth = Dimensions.get('window').width;

export const POPUP_WIDTH = wp(50);

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: wp(12),
    justifyContent: 'space-between',
  },
  headerView: {
    alignItems: 'center',
    paddingVertical: wp(5)
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.flatBlack,
  },
  closeButton: {
    position: 'absolute',
    right: wp(12),
    top: wp(0),
    bottom: wp(0),
  },
  // item post
  postView: {
    flexDirection: 'row',
    paddingHorizontal: wp(12),
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
    paddingVertical: wp(5),
    marginBottom: wp(5),
  },
  postImage: {
    width: wp(120),
    height: wp(90),
  },
  postDetails: {
    marginLeft: wp(10),
    width: wp(screenWidth - 180),
    justifyContent: 'center',
  },
  postTime: {
    color: colors.flatGrey01,
  },
  postName: {
    fontSize: wp(13),
    fontWeight: '500',
  },
  priceView: {
    flexDirection: 'row',
  },
  currency: {
    fontWeight: 'bold',
    color: colors.crimsonRed,
    fontSize: wp(14),
  },
  price: {
    color: colors.crimsonRed,
    fontSize: wp(14),
    fontWeight: 'bold',
  },
  locationView: {
    paddingHorizontal: wp(12),
    paddingBottom: wp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
  },
  locationTitle: {
    textAlign: 'left',
    marginRight: 10,
  },
  location: {
    color: colors.flatGrey01,
    textAlign: 'right',
  },
  effectView: {
    paddingHorizontal: wp(12),
    paddingVertical: wp(5),
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
  },
  effect: {
    marginRight: 10,
    textAlign: 'left',
  },
  updateAt: {
    color: colors.flatGrey01,
    textAlign: 'right',
  },
  viewsView: {
    flexDirection: 'row',
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
  },
  viewsContainer: {
    paddingVertical: wp(15),
    width: '50%',
    alignItems: 'center',
  },
  impressionsView: {
    borderRightColor: colors.flatGrey01,
    borderRightWidth: wp(1),
  },
  viewTitle: {
    marginBottom: wp(20),
    fontSize: wp(16),
  },
  view: {
    fontSize: wp(22),
    color: colors.appYellow,
    fontWeight: '600',
  },
  linearGradientView: {
    paddingVertical: wp(5),
    paddingHorizontal: wp(12),
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
  },
  linearGradient: {
    height: wp(15),
    width: '100%',
    borderRadius: wp(7),
  },
  pageView: {
    marginTop: wp(5),
    marginBottom: wp(10),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  firstPage: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#41d103',
    marginRight: wp(5),
  },
  redDot: {
    width: wp(10),
    height: wp(10),
    borderRadius: wp(5),
    backgroundColor: '#b20217',
    marginLeft: wp(5),
  },
  iconPage: {
    width: POPUP_WIDTH,
    height: wp(30),
    alignItems: 'center',
  },
  page: {
    fontSize: 12,
    marginTop: 5,
    color: colors.flatBlack03,
  },
});
