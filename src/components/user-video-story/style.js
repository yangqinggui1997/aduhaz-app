import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';
import { flexRow, ml, pdH, pdV } from '../../commons/styles';

export default StyleSheet.create({
  parrentView: {
    borderRadius: wp(16),
    marginBottom: wp(30),
    borderWidth: wp(0.5),
    borderColor: Colors.flatGrey01
  },
  itemContainer: {
    paddingHorizontal: wp(10),
  },
  description: {
    width: '100%',
    fontWeight: 'bold',
    fontSize: 12,
    marginBottom: wp(5),
    marginTop: wp(10)
  },
  videoContainer: {
    width: '100%',
    height: 200,
  },
  videoLength: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 24,
    height: 24,
    backgroundColor: Colors.flatGrey01,
    color: Colors.flatBlack03,
    fontSize: wp(10),
    textAlign: 'center',
    textAlignVertical: 'center',
    borderRadius: wp(5)
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
    marginVertical: wp(5)
  },
  footer: {
    ...flexRow,
    height: wp(35),
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopColor: Colors.flatGrey01,
    borderTopWidth: wp(1),
  },
  footerItemText: {
    fontSize: 12,
    marginLeft: 4,
  },
  chartView: {
    paddingVertical: wp(5),
    alignItems: 'center',
    flexDirection: 'row',
    borderBottomColor: Colors.flatGrey01,
    borderBottomWidth: wp(0.5),
    paddingBottom: wp(5),
  },
  statistical: {
    marginLeft: wp(5),
    fontWeight: 'bold'
  },
  rechargePackage: {
    paddingHorizontal: wp(14),
    marginBottom: wp(14),
  },
  time: {
    fontSize: wp(12),
    color: Colors.flatGrey01
  },
});
