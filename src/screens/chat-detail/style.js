import { StatusBar, StyleSheet } from 'react-native';

import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

const STATUSBAR_HEIGHT = StatusBar.currentHeight;

export default StyleSheet.create({
  statusBar: {
    height: STATUSBAR_HEIGHT,
    backgroundColor: colors.yellow,
  },
  container: {
    flex: 1,
    backgroundColor: colors.flatGrey06,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendingContainer: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginRight: wp(15),
    paddingTop: wp(5),
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  systemMessageWrapper: {
    backgroundColor: '#6646ee',
    borderRadius: 4,
    padding: 5,
  },
  systemMessageText: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  timeText: {
    color: colors.black,
  },

  // day
  dayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: wp(5),
    marginBottom: wp(10),
  },
  dayText: {
    backgroundColor: 'transparent',
    color: '#b2b2b2',
    fontSize: wp(12),
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  // input toolbar
  inputToolbarContainerStyle: {
    alignItems: 'flex-start',
  },

  // action
  actionBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: wp(5),
    paddingLeft: wp(10),
    paddingRight: wp(10),
  },
  pinIcon: {
    marginLeft: wp(7),
  },
});
