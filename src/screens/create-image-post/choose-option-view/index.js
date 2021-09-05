import React, { useEffect, useState } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colors from '../../../theme/colors';

import _ from 'lodash';

const ChooseOptionView = ({ componentId, property, onNext }) => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    setOptions(property.items.filter(item => item.type_control === 'radio-button'));
  }, [property]);

  const onSelectOption = index => {
    if (_.isFunction(onNext)) {
      onNext(options[index]);
    }
  };

  const renderOptionItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => onSelectOption(index)}>
        <Text style={styles.itemText}>{item.title}</Text>
        <Ionicons
          name="chevron-forward-outline"
          size={12}
          color={colors.flatGrey05}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={options}
        renderItem={({ item, index }) => (
          <View key={index.toString}>{renderOptionItem(item, index)}</View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
      />
    </View>
  );
};

export default ChooseOptionView;
