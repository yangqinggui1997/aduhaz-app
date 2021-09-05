import { Dimensions, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import { Colors } from '../../theme';
import colors from '../../theme/colors';

const textColor = '#333';
const textColor2 = '#565656';
const textColor3 = '#0c9bd0';
const textColor4 = '#666';
const textColor5 = '#292929';
const ONLINE_STATUS_WIDTH = 10;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  bgWhite: {
    backgroundColor: '#fff',
  },
  scrollView: {
    backgroundColor: '#f4f4f4',
  },
  images: {
    width: Dimensions.get('window').width,
    height: wp(280),
  },
  authorContainer: {
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  authorAvatar: {
    width: 36,
    height: 36,
    borderRadius: 36 / 2,
  },
  authorName: {
    fontSize: wp(13),
    lineHeight: wp(25),
    color: textColor,
  },
  postTitle: {
    fontSize: wp(17),
    lineHeight: wp(23),
    color: textColor,
    fontWeight: '600',
  },
  chude: {
    fontSize: wp(13),
    lineHeight: wp(20),
    fontWeight: '500',
    color: textColor2,
  },
  chudeContent: {
    fontSize: wp(13),
    lineHeight: wp(20),
    fontWeight: '600',
    color: textColor3,
  },
  price: {
    color: '#f00',
    fontWeight: '600',
    fontSize: wp(15),
  },
  ngaydangTxt: {
    color: textColor4,
    fontSize: wp(13),
    lineHeight: wp(22),
  },
  viewCount: {
    color: textColor5,
    fontSize: wp(12),
    lineHeight: wp(20),
  },
  viewCountNum: {
    fontWeight: 'bold',
  },
  commentContainer: {
    paddingHorizontal: wp(30),
    paddingVertical: wp(10),
    justifyContent: 'space-between',
    borderBottomWidth: wp(2),
    borderTopWidth: wp(1),
    borderColor: '#dcdcdc',
    borderStyle: 'solid',
  },
  bodyTxt: {
    fontSize: wp(13),
    lineHeight: wp(23),
  },
  bodyTxtBold: {
    fontWeight: 'bold',
  },
  bodyTxtNormal: {
    fontWeight: 'normal',
  },
  callNowBtn: {
    backgroundColor: '#00afef',
    width: wp(120),
    height: wp(26),
    borderRadius: wp(100),
    alignItems: 'center',
    justifyContent: 'center',
  },
  callNowTxt: {
    fontSize: wp(13),
    lineHeight: wp(26),
    color: '#fff',
    // marginBottom: wp(5),
  },
  callNowBox: {
    position: 'relative',
    justifyContent: 'center',
    paddingBottom: wp(4),
  },
  phoneIconBox: {
    position: 'absolute',
    top: wp(-5),
    left: wp(-45),
    width: wp(40),
    height: wp(40),
    borderRadius: wp(100),
    backgroundColor: '#00afef',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneIcon: {
    // marginTop: wp(-3),
  },
  khuyenCaoBtn: {
    borderWidth: wp(1),
    borderColor: '#00afef',
    paddingHorizontal: wp(20),
    borderRadius: wp(20),
    width: wp(200),
    height: wp(28),
    alignItems: 'center',
    justifyContent: 'center',
  },
  khuyencaoText: {
    fontSize: wp(13),
    lineHeight: wp(25),
    color: '#333',
    marginLeft: wp(6),
  },

  bottomContainer: {
    borderTopWidth: wp(3),
    borderColor: '#dcdcdc',
    paddingTop: wp(15),
    marginTop: wp(15),
  },
  adsHeader: {
    borderBottomWidth: wp(1),
    borderColor: '#E0E0E0',
  },
  adsHeading: {
    fontSize: wp(14),
    lineHeight: wp(25),
    fontWeight: '600',
    color: '#f90909',
  },
  borderBottom: {
    height: wp(1),
    backgroundColor: '#f90909',
    marginBottom: wp(-1),
  },
  userStatus: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  userStatusTxt: {
    fontSize: wp(12),
    lineHeight: wp(25),
    fontWeight: '500',
    color: '#333',
    textTransform: 'capitalize',
  },
  userStatusItem: {
    width: '33.33%',
  },
  userStatusItemBorder: {
    borderLeftWidth: wp(1),
    borderRightWidth: wp(1),
    borderColor: '#ccc',
    borderStyle: 'solid',
  },
  sendCommentBtn: {
    backgroundColor: '#FF9800',
    borderRadius: wp(7),
    height: wp(39),
    justifyContent: 'center',
    paddingVertical: wp(7),
    paddingHorizontal: wp(10),
    marginTop: wp(10),
  },
  sendCommentBtnBody: {
    position: 'relative',
  },
  sendCommentBtnTxt: {
    fontSize: wp(16),
    lineHeight: wp(25),
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: wp(12),
  },
  moreVideo: {
    backgroundColor: '#fff',
    marginTop: wp(20),
    shadowColor: 'rgba(0,0,0,0.2)',
    shadowOffset: {
      width: 0,
      height: wp(1),
    },
    shadowRadius: wp(1),
    shadowOpacity: 1,
  },
  closeBtn: {
    position: 'absolute',
    top: wp(10),
    left: wp(10),
    zIndex: 9999,
    width: wp(34),
    height: wp(34),
    borderRadius: wp(34 / 2),
    borderColor: colors.flatGrey13,
    borderWidth: 1 / 2,
    backgroundColor: colors.flatWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: colors.flatGrey13,
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingPoint: {
    fontWeight: 'bold',
  },
  progressIndicatorContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: ONLINE_STATUS_WIDTH,
    height: ONLINE_STATUS_WIDTH,
    backgroundColor: Colors.yellow,
    borderRadius: ONLINE_STATUS_WIDTH / 2,
  },
});
