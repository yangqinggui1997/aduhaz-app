import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View } from 'react-native';
import RatioButton from '../../../components/ratio-button';

import styles from './styles';
import colors from '../../../theme/colors';

import _ from 'lodash';

const PostByView = ({
  componentId,
  property,
  selectedValue = null,
  onNext = null,
  onUpdate = null,
}) => {
  const { t } = useTranslation();
  const [options, setOptions] = useState([]);
  const [label, setLabel] = useState(null);
  const [selectedOption, setSelectedOption] = useState(selectedValue);

  useEffect(() => {
    console.log('SELECTED VALUE: ', selectedValue);
  }, []);

  useEffect(() => {
    if (property && !_.isEmpty(property.items)) {
      setOptions(
        property.items.filter(item => item.type_control === 'radio-button'),
      );
      setLabel(property.items.find(item => item.type_control === 'label'));
    }
  }, [property]);

  useEffect(() => {
    if (_.isFunction(onUpdate)) {
      onUpdate(selectedOption);
    }
  }, [selectedOption]);

  const onSelectOption = index => {
    setSelectedOption(options[index]);
  };

  const onPressedNext = () => {
    if (_.isFunction(onNext)) {
      onNext(selectedOption);
    }
  };

  const renderOptionItem = (item, index) => {
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.optionContainer,
          index < options.length - 1
            ? { borderRightWidth: 1, borderColor: colors.black }
            : {},
        ]}
        onPress={() => onSelectOption(index)}>
        <RatioButton
          checked={parseInt(item.value) === parseInt(selectedOption?.value)}
          onSelected={() => onSelectOption(index)}
        />
        <Text style={styles.optionText}>{item.title}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.optionList}>
        {options.map((o, index) => renderOptionItem(o, index))}
      </View>
      {!_.isEmpty(label) && (
        <View style={styles.descriptionContainer}>
          <Text>{label.title.replace(/\\u2022/g, '\u2022')}</Text>
        </View>
      )}
      <TouchableOpacity
        disabled={selectedOption === null}
        style={[
          styles.buttonNext,
          selectedOption === null ? { backgroundColor: colors.flatGrey11 } : {},
        ]}
        onPress={() => onPressedNext()}>
        <Text style={styles.buttonNextTitle}>
          {t('createImagePostButtonNext')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default PostByView;
