import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';
import { flexRow, ml, pdH, pdV } from '../../commons/styles';

export default StyleSheet.create({
  itemContainer: {
    marginVertical: wp(14),
    paddingHorizontal: wp(14),
  },
  description: {
    width: '90%',
    fontWeight: 'bold',
    fontSize: 12,
    lineHeight: 20,
  },
  videoContainer: {
    backgroundColor: Colors.flatGrey01,
    width: '100%',
    height: 200,
  },
  volumeButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
  },
  pauseButton: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    width: 24,
    height: 24,
  },
  descriptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footer: {
    ...flexRow,
    marginTop: wp(5),
    height: wp(25),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  footerItemText: {
    fontSize: 12,
    marginLeft: 4,
  },
  chartView: {
    marginTop: wp(5),
    alignItems: 'center',
    flexDirection: 'row',
  },
  statisticalView: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statistical: {
    fontSize: wp(12),
    marginLeft: wp(5),
    fontWeight: 'bold',
  },
  time: {
    position: 'absolute',
    right: wp(0),
    fontSize: wp(12),
    color: Colors.flatGrey01,
  },
});
