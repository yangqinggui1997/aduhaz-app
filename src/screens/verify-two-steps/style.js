import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: wp(16),
  },
  textButton: {
    fontSize: wp(14),
    fontWeight: 'bold',
    color: Colors.flatBlack,
  },
});
export default styles;
