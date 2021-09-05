import { StyleSheet, Dimensions } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
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
  postView: {
    flexDirection: 'row',
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
    paddingBottom: wp(10),
    marginBottom: wp(15),
    paddingHorizontal: wp(14)
  },
  postImage: {
    width: wp(120),
    height: wp(90),
  },
  postDetails: {
    marginLeft: wp(10),
    width: wp(screenWidth - 170),
    justifyContent: 'center'
  },
  postTime: {
    color: colors.flatGrey01
  },
  selectedItem: {
    borderWidth: wp(1),
    borderColor: colors.flatGreen,
  },
  pushPostPackage: {
    borderWidth: wp(1),
    borderRadius: wp(4),
    borderColor: colors.flatGrey01,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: wp(10),
    paddingHorizontal: wp(14),
    marginBottom: wp(10)
  },
  pushPostDetails: {
    width: '80%',
  },
  pushPostIcon: {
    width: '20%',
    alignItems: 'flex-end',
    justifyContent: 'space-between'
  },
  pushPostTitle: {
    fontSize: wp(14),
    fontWeight: '600',
  },
  icon: {
    width: wp(30),
    height: wp(30)
  },
  pushPostPrice: {
    color: colors.flatGreen,
    fontSize: wp(14),
    marginTop: wp(5)
  },
  pushPostDes: {
    fontSize: wp(12),
    color: colors.flatGrey01,
    marginTop: wp(5)
  },
  list: {
    flex: 1,
    paddingHorizontal: wp(14)
  },
});
