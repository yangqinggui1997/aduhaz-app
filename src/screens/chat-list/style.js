import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

const ONLINE_STATUS_WIDTH = 10;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: wp(16),
    marginBottom: wp(8),
  },
  titleHeader: {
    marginHorizontal: wp(20),
    fontWeight: 'bold',
  },
  tabarIndicator: {
    backgroundColor: colors.red,
  },
  tabar: {
    backgroundColor: colors.white,
    fontWeight: 'bold',
    borderBottomColor: colors.white,
    marginHorizontal: wp(16),
    marginBottom: wp(8),
  },
  tabarLable: {
    color: colors.black,
  },
  tabarLableFocused: {
    fontWeight: 'bold',
  },
  scene: {
    flex: 1,
    backgroundColor: colors.white,
    paddingHorizontal: wp(16),
  },
  body: {
    flex: 1,
  },
  messageItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: wp(15),
  },
  messageAvatar: {
    height: wp(40),
    width: wp(40),
    backgroundColor: colors.grey,
    borderRadius: wp(40 / 2),
    borderColor: colors.grey,
    borderWidth: wp(1),
  },
  contentMessage: {
    flex: 1,
    flexDirection: 'row',
  },
  textContent: {
    flex: 1,
    marginLeft: wp(8),
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    marginHorizontal: wp(5),
    marginVertical: wp(5),
  },
  title: {
    color: colors.flatGrey01,
  },
  user: {
    color: colors.black,
    fontWeight: 'normal',
  },
  time: {
    color: colors.black,
    fontWeight: 'normal',
  },
  message: {
    marginLeft: wp(5),
    color: colors.flatGrey01,
    fontWeight: 'normal',
  },
  boldText: {
    color: colors.black,
    fontWeight: 'bold',
  },
  imageContent: {
    width: wp(80),
    paddingLeft: wp(8),
  },
  postImage2: {
    height: wp(60),
    borderWidth: 1,
    borderColor: colors.flatGrey01,
    marginBottom: wp(5),
  },
  postImage1: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: wp(5),
    borderWidth: 1,
    borderColor: colors.flatGrey01,
  },
  separator: {
    flex: 1,
    height: 1,
    backgroundColor: colors.grey,
  },
  onlineStatus: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: ONLINE_STATUS_WIDTH,
    height: ONLINE_STATUS_WIDTH,
    backgroundColor: colors.yellow,
    borderRadius: ONLINE_STATUS_WIDTH / 2,
  },
});
