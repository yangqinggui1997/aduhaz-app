import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import { alignCenter } from '../../commons/styles';
import colors from '../../theme/colors';
import Colors from '../../theme/colors';
export default StyleSheet.create({
  borderBottom: {
    flexDirection: 'row',
    borderBottomColor: Colors.grey,
    borderBottomWidth: 1,
  },
  textBold: {
    fontWeight: 'bold',
  },
  marginTop: {
    marginTop: wp(10),
  },
  marginTopPart: {
    marginTop: wp(20),
  },
  profileEditButtonView: {
    flexDirection: 'row-reverse',
  },
  avatarView: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: wp(16),
    width: '100%',
    justifyContent: 'space-between',
    paddingBottom: wp(10),
    zIndex: 1,
  },
  avatar: {
    width: wp(90),
    height: wp(90),
    marginTop: -wp(70),
    backgroundColor: colors.grey,
    borderRadius: wp(80),
    borderColor: colors.grey,
    borderWidth: wp(5),
  },
  banner: {
    flex: 1,
    height: wp(145),
    zIndex: 1,
  },
  coverPhoto: {
    position: 'absolute',
    bottom: wp(5),
    right: wp(10),
    backgroundColor: Colors.grey,
    padding: wp(10),
    borderRadius: wp(20),
    zIndex: 999,
    flexDirection: 'row',
  },
  coverPhotoText: {
    fontSize: wp(10),
    fontWeight: 'bold',
  },
  coverPhotoIcon: {
    fontSize: wp(13),
  },
  analystics: {
    flex: 1,
  },
  sumary: {
    flexDirection: 'row',
  },
  name: {
    fontWeight: 'bold',
    fontSize: wp(16),
    textAlign: 'center',
    padding: wp(8),
  },
  iconSumary: {
    color: colors.grey,
    fontSize: wp(20),
  },
  editProfile: {
    right: wp(-6),
    width: '100%',
    flexDirection: 'row-reverse',
  },
  editProfileButton: {
    backgroundColor: colors.flatGray,
    flexDirection: 'row',
    width: wp(35),
    height: wp(35),
    borderRadius: wp(32),
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEdiText: {
    fontSize: wp(13),
    flex: 1,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileEdiButton: {
    color: colors.black,
    fontSize: wp(12),
  },
  flexRow: {
    flexDirection: 'row',
  },
  iconEvilIcons: {
    paddingTop: wp(4),
    paddingRight: wp(4),
    color: colors.profileGray,
    fontSize: wp(20),
    textAlign: 'center',
  },
  iconInline: {
    paddingTop: wp(2),
    paddingLeft: wp(0),
    // padding: wp(2),
  },
  iconFontisto: {
    paddingTop: wp(4),
    color: colors.profileGray,
    fontSize: wp(14),
    textAlign: 'center',
  },
  providedIconBG: {
    backgroundColor: '#883ab7',
  },
  providedIcon: {
    color: 'white',
    borderColor: 'white',
  },
  iconAwesome: {
    fontSize: wp(20),
    width: wp(20),
    height: wp(20),
    marginTop: -wp(1),
  },
  curcleIcon: {
    width: wp(22),
    height: wp(22),
  },
});
