import { StyleSheet } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: wp(12),
    paddingHorizontal: wp(12),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  screenTitle: {
    fontSize: wp(14),
    fontWeight: '700',
  },
  closeButton: {
    position: 'absolute',
    top: wp(0),
    right: wp(0),
  },
  sectionTitle: {
    marginTop: wp(10),
  },
  sectionSubTitle: {
    marginTop: wp(5),
    fontSize: 12,
    color: colors.flatGrey,
  },
  input: {
    marginTop: wp(5),
    textAlignVertical: 'center',
    height: wp(58),
    borderColor: colors.flatGrey01,
    borderWidth: wp(1),
  },
  submitButtonContainer: {
    width: '100%',
    alignItems: 'flex-end',
    marginTop: wp(15),
  },
  submitButton: {
    alignItems: 'center',
    borderRadius: wp(5),
    backgroundColor: 'red',
  },
  submit: {
    marginVertical: wp(5),
    marginHorizontal: wp(10),
    fontWeight: '700',
    color: colors.white,
  },
  enableButton: {
    backgroundColor: colors.primary,
  },
  disableButton: {
    backgroundColor: colors.flatGrey01,
  },
  selectTopicContainer: {
    height: wp(58),
    width: '100%',
    borderColor: colors.flatGrey01,
    borderWidth: wp(1),
    marginTop: wp(5),
    justifyContent: 'center',
  },
  topic: {
    marginLeft: wp(2),
    color: colors.black,
  },
  topicPlaceHolder: {
    marginLeft: wp(2),
    color: colors.flatGrey,
  },
  sliderStyle: {
    marginTop: wp(10),
  },
  sliderRailContainer: {
    height: wp(10),
    flex: 1,
    borderRadius: wp(5),
    backgroundColor: colors.flatGrey01,
  },
  sliderRailSelectedContainer: {
    height: wp(10),
    backgroundColor: colors.flatGrey,
  },
  sliderThumbContainer: {
    height: wp(20),
    width: wp(20),
    borderRadius: wp(20 / 2),
    backgroundColor: colors.flatBlack,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderThumbInside: {
    width: wp(20),
    height: wp(20),
    borderRadius: wp(20 / 2),
    backgroundColor: colors.flatBlack,
  },
});
