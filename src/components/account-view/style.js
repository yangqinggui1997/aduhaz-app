import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  accountView: {
    alignItems: 'center',
    borderTopWidth: wp(1),
    borderTopColor: Colors.flatGrey01,
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(1),
    paddingBottom: wp(10),
  },
  avatarView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: wp(-25),
    paddingHorizontal: wp(14),
    alignItems: 'flex-end',
  },
  editAccountBtn: {
    paddingHorizontal: wp(20),
    paddingVertical: wp(5),
    borderRadius: wp(5),
    borderColor: Colors.flatGreen,
    borderWidth: wp(1),
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },
  editAccount: {
    marginLeft: wp(5),
  },
  accountAvatar: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(25),
    backgroundColor: Colors.flatGrey01,
  },
  accountName: {
    marginTop: wp(10),
    fontSize: wp(13),
    fontWeight: 'bold',
  },
  coverImgContainer: {
    backgroundColor: Colors.flatGray,
    width: '100%',
    height: wp(100),
  },
  coverImg: {
    flex: 1,
    marginBottom: wp(30),
    justifyContent: 'flex-end',
  },
});
