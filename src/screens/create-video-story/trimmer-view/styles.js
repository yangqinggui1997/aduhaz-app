import { Platform, Dimensions, StyleSheet } from 'react-native';
import { wp } from '../../../commons/responsive';
import colors from '../../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  separator: {
    height: 1,
    backgroundColor: colors.flatGrey11,
  },
  doneButtonText: {
    fontWeight: 'bold',
  },
  videoContainer: {
    width: Dimensions.get('screen').width,
    height: wp(250),
    backgroundColor: colors.black,
    marginBottom: 20,
  },
  sliderStyle: {
    marginTop: wp(10),
    width: Dimensions.get('screen').width,
    height: wp(50),
  },
  sliderRailContainer: {
    height: wp(50),
    backgroundColor: colors.lightFlatGrey,
    flex: 1,
    flexDirection: 'row',
  },
  sliderRailSelectedContainer: {
    height: wp(50),
    backgroundColor: colors.transparent,
    borderColor: colors.appYellow,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sliderThumbContainer: {
    height: wp(50),
    width: wp(20),
    backgroundColor: colors.appYellow,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderThumbInside: {
    width: wp(2),
    height: wp(30),
    backgroundColor: colors.white,
  },
  videoThumb: {
    flex: 1,
    height: wp(50),
    resizeMode: 'stretch',
  }
});
