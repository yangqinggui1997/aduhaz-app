import { StyleSheet } from 'react-native';
import colors from '../../theme/colors';

export default StyleSheet.create({
  button: {
    width: 20,
    height: 20,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: colors.flatGrey12,
    backgroundColor: colors.flatGrey04,
  },
  buttonHighlight: {
    width: 20,
    height: 20,
    borderRadius: 3,
    backgroundColor: colors.orange,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
