import { Dimensions, Platform, StyleSheet } from 'react-native';
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
  scrollContainer: {
    flex: 1,
  },
  childContainer: {
    width: Dimensions.get('screen').width,
  },
  imagesContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: wp(16),
  },
  imageItem: {
    width: Dimensions.get('screen').width / 3,
    height: Dimensions.get('screen').width / 3,
    padding: wp(4),
  },
  imageContainer: {
    borderRadius: wp(5),
    flex: 1,
    overflow: 'hidden',
    marginTop: wp(4),
  },
  sectionContainer: {
    marginTop: wp(16),
    marginHorizontal: wp(4),
  },
  sectionTitle: {
    fontWeight: 'bold',
  },
  sectionText: {
    marginTop: wp(4),
  },
  buttonPost: {
    width: '100%',
    height: wp(40),
    marginTop: 10,
    backgroundColor: colors.flatGreen,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonPostTitle: {
    color: colors.white,
  },
});
