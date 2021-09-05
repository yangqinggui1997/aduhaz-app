import { StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  contentContainer: {
    marginRight: wp(10),
    backgroundColor: colors.flatGray07,
    padding: wp(10),
    borderRadius: wp(10)
  },
  commentsList: {
    marginVertical: wp(16),
    paddingHorizontal: wp(12),
    width: '100%',
    flex: 1,
  },
  commentItem: {
    flexDirection: 'row',
  },
  commentAvatar: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(15),
  },
  commentUser: {
    fontWeight: '700',
  },
  commentContent: {
    marginTop: 4,
  },
  commentTime: {
    color: colors.flatGrey09,
    fontSize: wp(12),
    marginTop: wp(6),
  },
  seeReplies: {
    marginTop: wp(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  repliesList: {
    marginTop: wp(10),
  },
});
