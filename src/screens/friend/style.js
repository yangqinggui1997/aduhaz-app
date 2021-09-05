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
    paddingHorizontal: wp(14),
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: 10,
  },
  topBar: {
    width: '100%',
    height: wp(40),
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tab: {
    borderBottomWidth: wp(0.5),
    borderBottomColor: Colors.flatGrey01,
    borderTopWidth: wp(0.5),
    borderTopColor: Colors.flatGrey01,
    flexDirection: 'row',
    width: '50%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTabTitle: {
    fontSize: wp(14),
    fontWeight: 'bold',
  },
  tabTitle: {
    fontSize: wp(14),
    fontWeight: 'normal',
  },
  selectedTab: {
    borderBottomWidth: wp(2),
    borderBottomColor: Colors.primary,
    borderTopWidth: wp(0.5),
    borderTopColor: Colors.flatGrey01,
    width: '50%',
    height: wp(40),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  rechargePackage: {
    marginVertical: wp(10)
  },
  list: {
    flex: 1,
  },
  itemFriendContainer: {
    width: '100%',
    height: wp(80),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: wp(0.5),
    borderBottomColor: Colors.flatGrey01,
  },
  avatarAndName: {
    width: '85%',
    flexDirection: 'row'
  },
  accountAvatar: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
  },
  nameContainer: {
    width: '80%',
    paddingLeft: wp(10),
    textAlignVertical: 'center',
    justifyContent: 'center'
  },
  followButton: {
    width: '12%',
    flexDirection: 'row',
    borderWidth: wp(1),
    borderColor: Colors.flatGreen,
    justifyContent: 'space-around',
    borderRadius: wp(5),
    padding: wp(5)
  },

});
