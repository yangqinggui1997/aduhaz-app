import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';
import { flexRow } from '../../commons/styles';

const screenWidth = Dimensions.get('window').width

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentView: {
    flex: 1,
    paddingHorizontal: wp(14),
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 10,
  },
  list: {
    flex: 1,
  },
  itemContainer: {
    flexDirection: 'column',
    marginBottom: wp(10)
  },
  lastItem: {
    marginBottom: wp(30),
  },
  itemVideoContainer: {
    width: '100%',
    backgroundColor: Colors.flatGrey10,
  },
  itemImage: {
    width: '100%',
    height: wp(200),
  },
  itemVideoIcon: {
    position: 'absolute',
    height: wp(90),
    width: wp(90),
    opacity: 0.5,
    alignSelf: 'center',
    top: wp(55)
  },
  itemName: {
    width: '100%',
    marginTop: wp(5),
    fontSize: wp(13),
    fontWeight: '500',
  },
  bottomView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: wp(5),
    justifyContent: 'space-between',
    marginTop: wp(5),
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
  },
  timeView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  time: {
    flexWrap: 'wrap',
    lineHeight: wp(22),
    color: Colors.flatGrey03,
    marginLeft: wp(5),
    marginRight: wp(7),
  },
  iconImage: {
    width: wp(26),
    height: wp(26),
    alignItems:'center',
    justifyContent: 'center',
    marginTop: wp(10),
    marginBottom: wp(5),
    marginRight: wp(10)
  },
  imageCount: {
    color: Colors.white,
    fontSize: wp(13),
    fontWeight: '500',
    marginRight: wp(2)
  },
  pauseButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 24,
    height: 24,
  },
  footer: {
    ...flexRow,
    marginTop: wp(5),
    height: wp(25),
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerItemText: {
    fontSize: 12,
    marginLeft: 4,
  },
});
