import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(16),
  },
  header: {
    paddingBottom: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: wp(16),
  },
  titleHeader: {
    marginHorizontal: wp(10),
    fontWeight: 'bold',
  },
  exit: {
    flex: 1,
    flexDirection: 'row-reverse',
  },
  borderBottom: {
    borderBottomColor: colors.grey,
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'column',
  },
  itemContent: {
    paddingBottom: wp(10),
    // backgroundColor: 'red'
    flexDirection: 'row',
  },
  titleItem: {
    fontSize: wp(14),
  },
  detailItem: {
    flexDirection: 'row-reverse',
    flex: 1,
  },
  iconDetail: {
    fontSize: wp(16),
    marginLeft: wp(7),
  },
});
