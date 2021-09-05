import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import { alignCenter } from '../../commons/styles';
import colors from '../../theme/colors';
import Colors from '../../theme/colors';
export default StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 10,
  },
  logo: {
    width: wp(297),
    height: wp(72),
  },
  dots: {
    width: wp(44),
    marginTop: 40,
  },
  title: {
    fontSize: wp(18),
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginBottom: wp(10),
    paddingLeft: wp(10),
  },
  headerView: {
    flexDirection: 'column',
    // minHeight: wp(140),
  },
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
  avatarView: {
    flexDirection: 'row',
    flex: 1,
    marginTop: wp(10),
  },
  coverPhotoIcon: {
    fontSize: wp(16),
  },
  analystics: {
    flex: 1,
    // marginLeft: wp(5),
  },
  sumary: {
    flexDirection: 'row',
  },
  labelSumary: {
    fontSize: wp(12),
  },
  iconSumary: {
    color: colors.grey,
    fontSize: wp(17),
  },
  profileEdiButton: {
    color: colors.black,
    fontSize: wp(15),
  },
  flexRow: {
    flexDirection: 'row',
  },
  iconEvilIcons: {
    paddingTop: wp(0),
    paddingRight: wp(4),
    color: colors.profileGray,
    fontSize: wp(22),
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
  grayColor: {
    color: colors.profileGray,
  },
  blackColor: {
    color: 'black',
  },
  textView: {
    fontSize: wp(12),
    // flex: 1
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  iconStar: {
    color: colors.appYellow,
    fontSize: wp(12),
  },
  scene: {
    flex: 1,
    // marginHorizontal: -16,
    backgroundColor: colors.white,
  },
  tabarIndicator: {
    backgroundColor: colors.red,
  },
  tabar: {
    backgroundColor: colors.white,
    fontWeight: 'bold',
    borderBottomColor: colors.white,
  },
  tabarLable: {
    color: colors.black,
  },
  tabarLableFocused: {
    color: colors.red,
  },
  allInfo: {},
  list: {
    flex: 1,
    marginTop: wp(12),
  },
  tabTitleView: {
    flexDirection: 'row',
  },
  tabTitleItem: {
    width: '50%',
    padding: wp(10),
    marginBottom: wp(2),
  },
  selectedTabItem: {
    borderBottomColor: colors.red,
    borderBottomWidth: 1,
  },
  tabTextItem: {
    textAlign: 'center',
    color: colors.black,
  },
  tabContent: {
    flex: 1,
    backgroundColor: 'red',
  },
  selectedItem: {
    color: colors.red,
  },
  rechargePackage: {
    marginRight: wp(16),
    marginLeft: wp(16),
  },
});
