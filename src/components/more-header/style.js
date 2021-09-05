import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
  container: {
    paddingHorizontal: wp(10),
    paddingVertical: wp(10),
  },
  border: {
    borderBottomColor: '#dcdcdc',
    borderBottomWidth: wp(1),
    borderStyle: 'solid',
  },
  borderLeft: {
    borderLeftColor: '#00afef',
    borderLeftWidth: wp(8),
    borderStyle: 'solid',
  },
  heading: {
    fontSize: wp(18),
    lineHeight: wp(28),
    color: '#00afef',
    fontWeight: '600',
    marginLeft: wp(11),
    textTransform: 'uppercase',
  },
});
