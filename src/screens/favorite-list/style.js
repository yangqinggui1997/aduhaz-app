import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentView: {
    flex: 1,
  },
  screenTitle: {
    marginBottom: wp(10),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.black,
    marginLeft: wp(14),
  },
  itemListingsList: {
    width: screenWidth / 2 - 15,
  },
  story: {
    width: 100,
    height: 150,
  },
  separator: {
    width: wp(10),
  },
  bottomSeparator: {
    height: wp(5),
    width: '100%',
    backgroundColor: Colors.flatGrey01,
    marginTop: wp(10),
  },
});
