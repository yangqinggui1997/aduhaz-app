import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Utils from '../../commons/utils';

export default StyleSheet.create({
  container: {
    height: Utils.getScreenHeight(),
    width: Utils.getScreenWidth(),
    backgroundColor: Colors.transparent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: Colors.transparentBlack60,
  },
});
