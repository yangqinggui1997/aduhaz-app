import { StyleSheet, Dimensions } from 'react-native';
import Colors from '../../theme/colors';
import Utils from '../../commons/utils';
import { flexRow, ml, pdH, pdV } from '../../commons/styles';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

const ONLINE_STATUS_WIDTH = 10;

export default StyleSheet.create({
  header: {
    flex: 1,
    flexDirection: 'row',
    // alignItems: 'center',
    justifyContent: 'space-between',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  time: {
    ...ml(4),
    color: colors.flatGrey,
    fontSize: 12,
  },
  description: {
    fontWeight: 'bold',
    fontSize: 12,
    ...pdV(10),
    lineHeight: 20,
    // height: 60,
  },
  videoContainer: {
    width: '100%',
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
  footer: {
    ...flexRow,
    height: 40,
    alignItems: 'center',
  },
  footerItemText: {
    fontSize: 12,
    marginLeft: 4,
  },
  commentsContainers: {
    borderTopWidth: wp(2),
    borderColor: colors.flatGray07,
  },
  commentsList: {
    marginVertical: wp(16),
    paddingHorizontal: wp(12),
    width: '100%',
    flex: 1,
  },
  commentInputContainer: {
    height: wp(40),
    width: '100%',
    paddingHorizontal: wp(12),
    borderTopWidth: wp(2),
    borderColor: colors.flatGray07,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: '100%',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: ONLINE_STATUS_WIDTH / 2,
    right: 0,
    width: ONLINE_STATUS_WIDTH,
    height: ONLINE_STATUS_WIDTH,
    backgroundColor: colors.yellow,
    borderRadius: ONLINE_STATUS_WIDTH / 2,
  },
  playTimeContainer: {
    position: 'absolute',
    bottom: 20,
    right: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  playTimeText: {
    backgroundColor: colors.black,
    color: colors.white,
    paddingHorizontal: wp(4),
    paddingVertical: wp(2),
    borderRadius: wp(4),
    fontSize: 11,
    overflow: 'hidden',
    marginLeft: wp(6),
    textAlign: 'center',
  },
  nameContainer: {
    flexDirection: 'row',
  },
  followContainer: {
    flexDirection: 'row',
  },
});
