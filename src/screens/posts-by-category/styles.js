import { StyleSheet } from 'react-native';
import { initialWindowMetrics } from 'react-native-safe-area-context';
import { wp } from '../../commons/responsive';
import { Colors } from '../../theme';
import colors from '../../theme/colors';

export default StyleSheet.create({
  positionAbsolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    elevation: 10,
  },
  container: {
    flex: 1,
  },
  logo: {
    width: wp(35),
    height: wp(35),
    borderRadius: wp(35 / 2),
    borderColor: Colors.red,
    borderWidth: wp(1),
  },
  dots: {
    width: wp(44),
    marginTop: 40,
  },
  safeAreaCover: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    borderColor: 'white',
    borderBottomWidth: 1,
    height: initialWindowMetrics.insets.top,
    backgroundColor: 'white',
    zIndex: 99999,
  },
  navBar: {
    width: '100%',
    height: wp(44),
    paddingHorizontal: 16,
    backgroundColor: colors.white,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderColor: colors.grey,
  },
  animatedNavBar: {
    zIndex: 999,
    elevation: 10,
  },
  fixedNavBar: {
    zIndex: 99999,
    elevation: 10,
  },
  menuBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  filterBar: {
    width: '100%',
    height: 50,
    flexDirection: 'row',
  },
  filterButton: {
    flex: 1,
    paddingHorizontal: 8,
    margin: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.lightFlatGrey,
  },
  filterText: {
    flex: 1,
  },
  filterIcon: {
    width: 12,
  },
  categoryItemContainer: {
    width: wp(64),
  },
  categoryThumb: {
    width: wp(64),
    height: wp(64),
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightFlatGrey,
  },
  categoryName: {
    marginTop: 6,
    textAlign: 'center',
    fontSize: 12,
  },
  inputData: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: wp(20),
    padding: wp(10),
    paddingLeft: wp(15),
    paddingRight: wp(25),
    backgroundColor: colors.white,
    flex: 1,
  },
  progressIndicatorContainer: {
    width: '100%',
    height: 50,
    alignItems: 'center',
  },
});
