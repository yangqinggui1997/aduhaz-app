import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Utils from '../../commons/utils';
import { flexRow, ml, pdH, pdV } from '../../commons/styles';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

const ONLINE_STATUS_WIDTH = 10;

export default StyleSheet.create({
  content: {
    width: '100%',
    height: '100%',
    justifyContent: 'space-between',
  },
  thumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  mask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    borderRadius: 10,
    backgroundColor: colors.transparent80,
    opacity: 0.3,
  },
  avatar: {
    width: wp(36),
    height: wp(36),
    borderRadius: wp(18),
    borderWidth: 1,
    borderColor: colors.primary,
  },
  header: {
    marginTop: wp(8),
    flexDirection: 'row',
    paddingHorizontal: wp(8),
    justifyContent: 'space-between',
  },
  name: {
    marginLeft: wp(8),
    marginBottom: wp(8),
    color: colors.white,
    fontWeight: 'bold',
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 0,
    width: ONLINE_STATUS_WIDTH,
    height: ONLINE_STATUS_WIDTH,
    backgroundColor: colors.yellow,
    borderRadius: ONLINE_STATUS_WIDTH / 2,
  },
});
