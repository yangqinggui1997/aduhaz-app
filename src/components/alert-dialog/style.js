import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    position: 'absolute',
    right: 40,
    left: 40,
    padding: 16,
    backgroundColor: Colors.flatWhite,
    borderRadius: 10,
    alignContent: 'center',
    justifyContent: 'center',
  },
  title: {
    marginTop: 8,
    textAlign: 'center',
  },
  message: {
    marginTop: 8,
    textAlign: 'center',
  },
  buttons: {
    marginTop: 16,
    alignContent: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 8,
  },
  buttonTitle: {
    textAlign: 'center',
  },
});
