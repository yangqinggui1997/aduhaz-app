import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentView: {
    flex: 1,
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginLeft: wp(14),
  },
  list: {
    paddingHorizontal: wp(11),
    marginBottom: wp(14),
  },
  story: {
    width: screenWidth/3 - 8,
    paddingHorizontal: wp(3),
    marginBottom: wp(10),
    height: 200,
  },
});
