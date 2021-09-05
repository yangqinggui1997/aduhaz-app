import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';
import { flexRow, ml, pdH, pdV } from '../../commons/styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentView: {
    flex: 1,
  },
  screenTitle: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    color: Colors.primary,
    marginTop: wp(10),
    paddingHorizontal: wp(14),
  },
  list: {
    flex: 1,
    marginTop: wp(10),
    paddingHorizontal: wp(10)
  },
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
    marginTop: wp(5),
    lineHeight: wp(20)
  },
  imageContainer: {
    width: '100%',
    height: 200,
  },
  descriptionView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: wp(5),
  },
  footer: {
    ...flexRow,
    height: wp(35),
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: wp(1),
    borderTopColor: Colors.flatGrey01,
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
