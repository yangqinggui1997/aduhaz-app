import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';
import { Dimensions } from 'react-native';
const width = Dimensions.get('window').width;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(16),
    // width: '100%',
  },
  itemDevice: {
    paddingVertical: wp(10),
    flexDirection: 'row',
    minWidth: '90%',
    justifyContent: 'space-between',
  },
  contentDevice: {
    paddingRight: wp(10),
  },
  title: {
    fontSize: wp(14),
    fontWeight: 'bold',
  },
  time: {
    paddingTop: wp(3),
    fontSize: wp(13),
    color: Colors.flatGrey,
  },
  btnDelete: {
    // flex: 1,
    // minWidth: wp(50),
    // justifyContent: 'center',
    alignItems: 'center',
  },
  delete: {
    fontSize: wp(13),
    fontWeight: 'bold',
    color: Colors.flatGrey,
  },
});
export default styles;
