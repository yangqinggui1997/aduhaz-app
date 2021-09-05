import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import Utils from '../../commons/utils';
import { flexRow, ml, pdH, pdV } from '../../commons/styles';
import colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    margin: wp(2),
    // borderWidth: 1,
    borderColor: colors.lightFlatGrey,
  },
  thumbnail_container: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.flatGrey10,
    borderRadius: 16,
  },
  placeholderImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: colors.flatGray,
    resizeMode: 'center',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    borderRadius: 16,
  },
  thumbnailMask: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    borderRadius: 16,
  },
  info_container: {
    flexDirection: 'row',
    margin: 6,
    marginTop: -24,
  },
  info_text: {
    fontSize: 10,
    color: colors.white,
    fontWeight: 'bold',
    marginLeft: wp(4),
  },
  title: {
    marginHorizontal: wp(6),
    marginTop: wp(4),
    lineHeight: wp(20),
    fontSize: 12,
    fontWeight: '500',
  },
  price: {
    marginLeft: wp(6),
    marginBottom: wp(10),
    color: colors.red,
    fontWeight: 'bold',
  },
  date: {
    marginLeft: wp(6),
    marginBottom: wp(10),
    color: colors.flatGrey,
    fontWeight: 'bold',
  },

  counter_container: {
    position: 'absolute',
    top: wp(10),
    right: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  counter_text: {
    color: colors.white,
    marginLeft: wp(6),
  },
  like: {
    position: 'absolute',
    bottom: wp(10),
    right: wp(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
});
