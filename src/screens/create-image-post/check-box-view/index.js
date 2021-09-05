import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import CheckBox from '../../../components/check-box';

import styles from './styles';
import colors from '../../../theme/colors';
import { wp } from '../../../commons/responsive';

import _ from 'lodash';

const CheckBoxView = ({
  componentId,
  property,
  selectedValue = [],
  onNext,
  onUpdate = null
}) => {
  const { t } = useTranslation();

  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState(selectedValue);

  useEffect(() => {
    if (property) {
      setOptions(
        property.items.filter(item => item.type_control === 'checkbox'),
      );
    }
  }, [property]);

  useEffect(() => {
    if (_.isFunction(onUpdate)) {
      onUpdate(selectedOptions);
    }
  }, [selectedOptions])

  const onPressNext = () => {
    if (_.isFunction(onNext)) {
      onNext(selectedOptions);
    }
  };

  const onSelectItem = item => {
    const ops = [...selectedOptions];
    const index = ops.findIndex(option => option.value === item.value);
    if (index > -1) {
      ops.splice(index, 1);
    } else {
      ops.push(item);
    }
    setSelectedOptions(ops);
  };

  const renderOptionItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => onSelectItem(item)}>
        <Text style={styles.itemText}>{item.title}</Text>
        <CheckBox
          checked={selectedOptions.find(option => option.value === item.value)}
          onSelected={() => onSelectItem(item)}
        />
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={{ flex: 1, marginBottom: wp(12) }}
        data={options}
        renderItem={({ item, index }) => (
          <View key={index.toString}>{renderOptionItem(item, index)}</View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
      />
      <TouchableOpacity
        disabled={_.isEmpty(selectedOptions)}
        style={[
          styles.buttonNext,
          _.isEmpty(selectedOptions)
            ? { backgroundColor: colors.flatGrey11 }
            : {},
        ]}
        onPress={() => onPressNext()}>
        <Text style={styles.buttonNextTitle}>
          {t('createImagePostButtonNext')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CheckBoxView;
