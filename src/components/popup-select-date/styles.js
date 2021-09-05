import { Dimensions, StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
export default StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: wp(20),
    backgroundColor: "white",
    borderRadius: wp(20),
    padding: wp(20),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  closeButton: {
    position: 'absolute',
    right: 5,
    top: 5
  },
  submitView: {
    flexDirection: 'row',
  },
  datePicker: {
  },
  submit: {
    flex: 1,
    backgroundColor: colors.primary,
    padding: wp(10),
    borderRadius: wp(5)
  },
  submitText: {
    textAlign: 'center',
    color: colors.white,
    fontWeight: 'bold',
    fontSize: wp(14),
    textTransform: 'uppercase',
  }
});
