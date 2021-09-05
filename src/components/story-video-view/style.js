import { StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

const ONLINE_STATUS_WIDTH = 10;

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.flatGrey05,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  playButtonContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playButton: {
    width: wp(60),
    height: wp(60),
  },
  actionButtonContainer: {
    position: 'absolute',
    right: wp(10),
    bottom: wp(20),
    alignItems: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginTop: wp(16),
  },
  actionCounter: {
    color: colors.white,
    fontSize: wp(15),
    fontWeight: '700',
    marginTop: wp(4),
  },
  userInfoContainer: {
    position: 'absolute',
    top: wp(14) + initialWindowMetrics.insets.top,
    left: wp(14),
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
    marginRight: wp(6),
    borderWidth: 2,
    borderColor: colors.primary,
  },
  avatar: {
    width: '100%',
    height: '100%',
    borderRadius: wp(25),
  },
  name: {
    color: colors.white,
    fontWeight: '500',
    fontSize: 15,
  },
  follow: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 15,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: ONLINE_STATUS_WIDTH / 2,
    right: ONLINE_STATUS_WIDTH,
    width: ONLINE_STATUS_WIDTH,
    height: ONLINE_STATUS_WIDTH,
    backgroundColor: colors.yellow,
    borderRadius: ONLINE_STATUS_WIDTH / 2,
  },
});
