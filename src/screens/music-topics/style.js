import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import Colors from '../../theme/colors';
import { fontSize } from '../../commons/styles';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  topicList: {
    paddingHorizontal: wp(14),
    marginTop: wp(10),
    flexGrow: 1,
  },
  topicTitle: {
    fontWeight: '700',
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  topicIcon: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(5),
  },
  topicName: {
    marginLeft: wp(5),
  },
});
