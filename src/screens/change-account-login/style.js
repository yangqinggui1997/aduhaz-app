import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    padding: wp(16),
    paddingBottom: wp(40),
  },
  header: {
    flexDirection: 'row',
    margin: wp(30),
  },
  logoContent: {
    flex: 1,
    alignItems: 'center',
  },
  logo: {
    height: wp(100),
    width: wp(100),
  },
  mainContent: {
    flexDirection: 'column',
    flex: 1,
  },
  item: {
    marginVertical: wp(10),
    marginLeft: wp(20),
  },
  itemAccount: {
    marginLeft: wp(20),
    marginRight: wp(20),
    marginVertical: wp(5),
    alignItems: 'center',
  },
  itemContent: {
    flexDirection: 'row',
  },
  contentAccount: {
    flexDirection: 'row',
  },
  icon: {
    borderWidth: 1,
    borderColor: colors.green,
    borderRadius: wp(7),
    padding: wp(5),
  },
  des: {
    fontWeight: '500',
    fontSize: wp(14),
    marginTop: wp(5),
    paddingLeft: wp(10),
  },
  accountName: {
    maxWidth: '90%',
    fontWeight: '500',
    fontSize: wp(16),
    marginTop: wp(10),
    paddingLeft: wp(10),
  },
  avatar: {
    width: wp(40),
    height: wp(40),
    borderRadius: wp(20),
    borderColor: colors.grey,
    borderWidth: 1,
  },
  deleteAccount: {
    marginTop: wp(2),
    flexDirection: 'row-reverse',
    flex: 1,
  },
  footer: {
    position: 'absolute',
    bottom: wp(40),
    width: '100%',
  },
  desFooter: {
    textAlign: 'center',
    fontWeight: '500',
    fontSize: wp(14),
    color: colors.green,
  },
});
