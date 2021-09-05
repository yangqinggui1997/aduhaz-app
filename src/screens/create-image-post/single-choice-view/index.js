import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import RatioButton from '../../../components/ratio-button';

import styles from './styles';

import _ from 'lodash';
import colors from '../../../theme/colors';
import { wp } from '../../../commons/responsive';

const SingleChoiceView = ({
  componentId,
  property,
  selectedValue = null,
  onNext,
}) => {
  const { t } = useTranslation();

  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(selectedValue);

  useEffect(() => {
    if (property) {
      setOptions(
        property.items.filter(item => item.type_control === 'radio-button'),
      );
    }
  }, [property]);

  const onPressNext = () => {
    if (_.isFunction(onNext)) {
      onNext(selectedOption);
    }
  };

  const renderOptionItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => setSelectedOption(item)}>
        <Text style={styles.itemText}>{item.title}</Text>
        <RatioButton
          checked={selectedOption && selectedOption.value === item.value}
          onSelected={() => setSelectedOption(item)}
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
        disabled={selectedOption === null}
        style={[
          styles.buttonNext,
          selectedOption === null
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

export default SingleChoiceView;
