import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import Colors from '../../theme/colors';
import { fontSize } from '../../commons/styles';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(14),
  },
  listSong: {
    marginTop: wp(10),
    flexGrow: 1,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    alignItems: 'center',
    width: wp(60),
    marginLeft: wp(10),
  },
  musicItem: {
    flexDirection: 'row',
  },
  musicIconContainer: {
    marginTop: wp(10),
  },
  musicIcon: {
    width: wp(70),
    height: wp(70),
    marginTop: wp(10),
    borderRadius: wp(10),
  },
  iconPlay: {
    height: wp(26),
    width: wp(26),
  },
  musicDetail: {
    marginTop: wp(10),
    marginLeft: wp(5),
    justifyContent: 'space-around',
    flex: 1,
  },
  author: {
    color: Colors.flatGrey,
    fontSize: wp(12),
  },
  searchInputContainer: {
    borderRadius: wp(20),
    flexDirection: 'row',
    flex: 1,
    height: wp(40),
    marginLeft: 10,
    borderWidth: 1,
    borderColor: colors.flatBlack02,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  searchInput: {
    height: '100%',
    flex: 1,
    borderWidth: 0,
  },
  iconPlayContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: wp(5),
  }
});
