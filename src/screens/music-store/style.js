import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import { fontSize } from '../../commons/styles';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInputContainer: {
    borderRadius: wp(20),
    flexDirection: 'row',
    height: wp(40),
    alignItems: 'center',
    paddingHorizontal: wp(10),
    marginHorizontal: wp(14),
    backgroundColor: colors.lightFlatGrey
  },
  searchInput: {
    height: '100%',
    flex: 1,
  },
  topicList: {
    paddingHorizontal: wp(14),
    marginTop: wp(20),
    flexGrow: 1,
  },
  topicHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  viewMore: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreTitle: {
    fontSize: wp(12),
    color: colors.flatGrey01,
  },
  musicList: {
    marginVertical: wp(20),
    flexGrow: 1,
  },
  topicTitle: {
    fontWeight: '700',
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '50%',
    marginVertical: wp(10),
  },
  topicIcon: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(5),
  },
  topicName: {
    marginLeft: wp(5),
  },
  separator: {
    marginTop: wp(10),
    height: wp(1),
    backgroundColor: colors.flatGrey,
  },
  musicItem: {
    flexDirection: 'row',
  },
  musicIconContainer: {
    marginTop: wp(10),
  },
  musicIcon: {
    width: wp(70),
    height: wp(70),
    marginTop: wp(10),
    borderRadius: wp(10),
  },
  iconPlay: {
    height: wp(26),
    width: wp(26),
  },
  musicDetail: {
    marginTop: wp(10),
    marginLeft: wp(5),
    justifyContent: 'space-around',
    flex: 1,
  },
  author: {
    color: colors.flatGrey,
    fontSize: wp(12),
  },
  iconPlayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  }
});
