import { Dimensions, StyleSheet } from 'react-native';

import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // header
  headerContainer: {
    flexDirection: 'row',
    paddingVertical: wp(16),
    marginHorizontal: wp(8),
    borderTopColor: colors.lightFlatGrey,
    borderTopWidth: wp(1),
    borderStyle: 'solid',
  },
  headerAvatar: {
    width: wp(70),
    height: wp(70),
    borderRadius: wp(70 / 2),
  },
  headerContent: {
    marginLeft: wp(5),
  },
  headerName: {
    fontWeight: 'bold',
    fontSize: wp(17),
  },
  headerBody: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRatingText: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },

  // rating item
  ratingItem: {
    borderTopColor: colors.lightFlatGrey,
    borderTopWidth: wp(1),
    borderStyle: 'solid',
    flexDirection: 'row',
    padding: wp(16),
  },
  avatar: {
    width: wp(50),
    height: wp(50),
    borderRadius: wp(50 / 2),
  },
  name: {
    fontSize: wp(16),
    fontWeight: 'bold',
  },
  bottom: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: wp(5),
  },
  time: {
    fontSize: wp(14),
    color: colors.flatBlack03,
    marginLeft: wp(3),
  },
  separate: {
    color: colors.lightFlatGrey,
  },
  content: {
    marginLeft: wp(5),
    flexWrap: 'wrap',
  },
  desc: {
    flexGrow: 1,
    width: Dimensions.get('screen').width - wp(65 + 32),
  },
});
