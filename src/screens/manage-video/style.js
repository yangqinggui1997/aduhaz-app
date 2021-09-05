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
  },
  rechargePackage: {
    paddingHorizontal: wp(14),
    marginBottom: wp(14),
  },
  videoSeparator: {
    height: wp(10),
    backgroundColor: Colors.lightFlatGrey,
  }
});
