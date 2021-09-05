import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';
import Fonts from '../../theme/fonts';
import Utils from '../../commons/utils';

const ICON_SIZE = 28;

export default StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 8,
    justifyContent: 'space-between',
  },
  iconContainer: {
    padding: 4,
  },
  icon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  titleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: colors.black,
    paddingHorizontal: 6
  },
  rightContainer: {
    minWidth: ICON_SIZE,
    padding: 6,
  },
});
