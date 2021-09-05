import { StyleSheet, Platform } from 'react-native';
import colors from '../../theme/colors';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.flatBlack01,
    paddingTop: Platform.OS === 'ios' ? initialWindowMetrics.insets.top : 0,
  },
  closeIcon: {
    
  }
});
