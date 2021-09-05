import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import Colors from '../../theme/colors';

export default StyleSheet.create({
  container: {
    flex: 1,
    paddingRight: wp(16),
    paddingLeft: wp(16),
    paddingBottom: wp(16),
  },
  email: {
    fontWeight: 'bold',
    fontSize: wp(14),
    paddingLeft: wp(5),
  },
  inputData: {
    borderColor: Colors.grey,
    borderWidth: 1,
    borderRadius: wp(20),
    padding: wp(10),
    paddingLeft: wp(15),
    paddingRight: wp(25),
  },
  textArea: {
    marginTop: wp(10),
    borderWidth: wp(1),
    borderColor: Colors.flatGrey01,
    padding: wp(10),
    borderRadius: wp(5),
    height: wp(120),
  },
});
