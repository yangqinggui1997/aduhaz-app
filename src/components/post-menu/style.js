import { StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import { Colors } from '../../theme';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  gridContainer: {
    flex: 1,
  },
  gridButtonContainer: {
    flexBasis: '25%',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: wp(10),
    paddingVertical: wp(6),
  },
  borderBottom: {
    borderBottomWidth: wp(0.5),
    borderBottomColor: Colors.flatGrey01,
  },
  gridButton: {
    width: wp(30),
    height: wp(30),
    borderRadius: wp(60),
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridIcon: {
    width: wp(24),
    height: wp(24),
  },
  gridTitleContainer: {
    justifyContent: 'center',
  },
  gridTitle: {
    fontSize: wp(12),
    paddingLeft: wp(10),
    color: 'black',
    letterSpacing: wp(1),
  },
  gridDesc: {
    fontSize: wp(10),
    paddingLeft: wp(10),
    color: colors.flatGrey09,
    letterSpacing: wp(1),
    marginTop: wp(4),
  },
});
