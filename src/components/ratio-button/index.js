import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import styles from './styles';

const RatioButton = ({ checked = false, onSelected, ...props }) => {
  return (
    <TouchableOpacity
      style={checked ? styles.buttonHighlight : styles.button}
      onPress={() => {
        if (onSelected) {
          onSelected();
        }
      }}>
      {checked && <View style={styles.dot} />}
    </TouchableOpacity>
  );
};

RatioButton.propTypes = {};

export default RatioButton;
