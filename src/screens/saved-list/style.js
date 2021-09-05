import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentView: {
    flex: 1,
  },
  topView: {
    flexDirection: 'row',
    borderTopColor: Colors.flatGrey01,
    borderTopWidth: wp(0.5),
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
    paddingVertical: wp(5),
    paddingHorizontal: wp(14),
    alignItems: 'center',
  },
  countPost: {
    marginRight: wp(10),
  },
  sortView: {
    flexDirection: 'row',
  },
  sort: {
    marginLeft: wp(3),
  },
  postContainer: {
    flexDirection: 'row',
    marginHorizontal: wp(14),
    marginTop: wp(14),
    alignItems: 'center',
  },
  video: {
    width: wp(100),
    height: wp(100),
    borderRadius: wp(5),
  },
  postDetails: {
    flex: 1,
    padding: wp(10),
  },
  userName: {
    color: Colors.flatGrey01,
    marginTop: wp(8),
  },
  menu: {
    width: wp(15),
    height: wp(20),
  },
  list: {
    flex: 1,
    marginBottom: wp(10),
  },
  progressIndicatorContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
});
