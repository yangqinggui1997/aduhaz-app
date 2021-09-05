import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  notiHeader: {
    paddingHorizontal: wp(16),
    paddingVertical: wp(5),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
  },
  titleHeader: {
    marginHorizontal: wp(10),
    fontWeight: 'bold',
  },
  notiInputContainer: {
    flexDirection: 'row',
    flex: 1,
    borderWidth: 1,
    borderColor: colors.flatBlack02,
    alignItems: 'center',
  },
  notiItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: colors.flatGrey,
    paddingVertical: wp(16),
    borderBottomWidth: 1,
    paddingHorizontal: wp(16),
    backgroundColor: colors.lightFlatGrey,
  },
  notiItemNotview: {
    backgroundColor: colors.flatGrey13,
  },
  notiAvatar: {
    height: wp(40),
    width: wp(40),
    backgroundColor: colors.grey,
    borderRadius: wp(40),
    borderColor: colors.grey,
    borderWidth: wp(1),
  },
  notiContentContent: {
    marginHorizontal: wp(10),
    flex: 1,
    justifyContent: 'center',
  },
  notiContentText: {
    fontSize: wp(14),
    color: colors.black,
  },
  notiContentTime: {
    color: colors.flatGrey,
    fontSize: wp(13),
    marginTop: wp(5),
    fontWeight: 'bold',
  },
  moreOptionNotify: {
    paddingVertical: wp(20),
    paddingLeft: wp(10),
  },
  buttonMore: {
    width: wp(20),
    height: wp(5),
  },
});
