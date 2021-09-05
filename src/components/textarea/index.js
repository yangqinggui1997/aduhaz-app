import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';

function TextArea({
  containerStyle = {},
  numberOfLines = 10,
  onChange,
  value = '',
  placeholder = '',
  ...props
}) {
  return (
    <View style={[styles.container, containerStyle]}>
      <TextInput
        multiline
        placeholder={placeholder}
        style={styles.input}
        underlineColorAndroid="transparent"
        numberOfLines={numberOfLines}
        onChangeText={onChange}
        value={value}
      />
    </View>
  );
}

export default React.memo(TextArea);

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: wp(80),
    borderBottomWidth: wp(1),
    borderBottomColor: colors.flatGrey01,
  },
  input: {
    width: '100%',
    fontSize: wp(13),
    textAlignVertical: 'top',
    minHeight: wp(80),
  },
});
