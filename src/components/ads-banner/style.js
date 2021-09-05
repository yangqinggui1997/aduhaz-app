import { Dimensions, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  image: {
    width: Dimensions.get('screen').width / 3 - wp(10),
    height: wp(100),
    marginHorizontal: wp(5),
  },
  adsBannerBtn: {},
});
