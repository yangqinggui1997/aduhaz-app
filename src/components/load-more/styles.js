import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
// import Fonts from '../../theme/fonts';
// import Utils from '../../commons/utils';

export default StyleSheet.create({
  container: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  indicator: {
    width: 80,
    height: 80,
    borderRadius: 12,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    padding: 24,
  },
});
