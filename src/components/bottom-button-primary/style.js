import { StyleSheet } from 'react-native';
import Colors from '../../theme/colors';
import { wp } from '../../commons/responsive';

export default StyleSheet.create({
    container:{
        height: wp(48),
    },
    buttonPrimary:{
        flex: 1,
        backgroundColor: Colors.primary,
        height: wp(48),
        borderRadius: wp(8), 
        justifyContent:'center',
        alignItems:'center'
      },
      buttonGrey:{
        flex: 1,
        backgroundColor: Colors.flatGray07,
        height: wp(48),
        borderRadius: wp(8), 
        justifyContent:'center',
        alignItems:'center'
      },
      buttonTitle:{
        fontSize: wp(16),
        color: Colors.flatBlack
      },
      buttonHaveBorder:{
        flex: 1,
        backgroundColor: Colors.flatGray07,
        height: wp(48),
        borderColor: Colors.flatGrey06,
        borderWidth: wp(1),
        borderRadius: wp(15),
        justifyContent:'center',
        alignItems:'center'
      },
});