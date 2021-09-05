import { StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: wp(12),
    paddingHorizontal: wp(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center'
  },
  screenTitle: {
    fontSize: wp(14),
    fontWeight: '700'
  },
  closeButton: {
    position: 'absolute',
    top: wp(0),
    right: wp(0),
  },
  listTopic: {
    flex: 1,
    marginTop: wp(10),
  },
  topicItem: {
    height: wp(40),
    justifyContent: 'center',
    borderBottomColor: colors.flatGrey01,
    borderBottomWidth: wp(1)
  }
});
