import { StyleSheet } from 'react-native';
import { color } from 'react-native-reanimated';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

const ONLINE_STATUS_WIDTH = 10;

export default StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
  },
  fullImageView: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  picturesContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  actionButtonContainer: {
    position: 'absolute',
    right: wp(10),
    bottom: wp(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButton: {
    alignItems: 'center',
    marginTop: 16,
  },
  actionCounter: {
    color: colors.white,
    fontSize: wp(14),
    fontWeight: '700',
    marginTop: wp(2),
  },
  userInfoContainer: {
    position: 'absolute',
    top: wp(0) + initialWindowMetrics.insets.top,
    left: wp(0),
    width: '100%',
    padding: wp(14),
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
    fontWeight: 'bold',
    fontSize: 15,
    paddingRight: 2,
  },
  follow: {
    color: colors.red,
    fontWeight: '700',
    fontSize: 15,
  },
  moreMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: '#333333AB',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  moreText: {
    color: colors.white,
    fontWeight: '700',
    fontSize: 50,
  },
  image: {
    flex: 1,
    borderRadius: 5,
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
