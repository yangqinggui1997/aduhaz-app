import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import { Colors } from '../../theme';

export default StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
  logo: {
    width: wp(200),
    height: wp(200),
  },
  dots: {
    width: wp(44),
    marginTop: 40,
  },
});
