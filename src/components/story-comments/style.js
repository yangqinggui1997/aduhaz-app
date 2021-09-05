import { Platform, StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    marginTop: wp(16),
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: wp(6),
  },
  closeButton: {
    position: 'absolute',
    right: wp(12),
    top: 0,
  },
  footer: {
    height: wp(44),
    width: '100%',
    paddingHorizontal: wp(12),
    marginBottom:
      Platform.OS === 'ios' ? initialWindowMetrics.insets.bottom : 0,
    borderTopWidth: wp(2),
    borderColor: colors.flatGray07,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentInput: {
    flex: 1,
    height: '100%',
    paddingTop: Platform.OS === 'ios' ?  wp(12) : 0,
    paddingHorizontal: 12,
    textAlignVertical: 'center'
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
    width: wp(36),
    height: wp(36),
    borderRadius: wp(20),
  },
  commentUser: {
    fontWeight: '700',
  },
  commentContent: {
    marginTop: 4,
  },
  commentTimeContainer: {
    marginTop: wp(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentTime: {
    color: colors.flatGrey09,
    fontSize: wp(12),
    marginTop: wp(6),
  },
  replyButtonText: {
    fontWeight: 'bold',
    fontSize: wp(12),
  },
  seeReplies: {
    marginLeft: wp(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  repliesList: {
    marginTop: wp(10),
    marginLeft: wp(46)
  },
  emptyMessage: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  replyMessageContainer: {
    paddingHorizontal: wp(12),
    height: wp(44),
    width: '100%',
    borderTopWidth: wp(2),
    borderColor: colors.flatGray07,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
