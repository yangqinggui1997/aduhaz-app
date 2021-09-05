import React from 'react';
import { TouchableOpacity } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import colors from '../../theme/colors';

const CheckBox = ({ checked = false, onSelected, ...props }) => {
  return (
    <TouchableOpacity
      style={checked ? styles.buttonHighlight : styles.button}
      onPress={() => {
        if (onSelected) {
          onSelected();
        }
      }}>
      {checked && <Ionicons name="checkmark-sharp" size={18} color={colors.white} />}
    </TouchableOpacity>
  );
};

CheckBox.propTypes = {};

export default CheckBox;
