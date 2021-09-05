import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import colors from '../../../theme/colors';

import _ from 'lodash';
import Utils from '../../../commons/utils';
import { wp } from '../../../commons/responsive';

const InputDescriptionView = ({
  componentId,
  property,
  value = {value: ''},
  onNext = null,
  onUpdate = null,
}) => {
  const { t } = useTranslation();
  const [description, setDescription] = useState(value.value);
  const [isPriceInput, setIsPriceInput] = useState(false);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    if (property && !_.isEmpty(property.items)) {
      setLabel(property.items.find(item => item.type_control === 'label'));
      setIsPriceInput(
        property.items.find(item => item.slug === 'price') !== undefined,
      );
    }
  }, [property]);

  useEffect(() => {
    if (_.isFunction(onUpdate)) {
      onUpdate({
        slug: property.items[0].slug,
        value: description,
      });
    }
  }, [description]);

  const onPressedNext = () => {
    if (_.isFunction(onNext)) {
      onNext({
        slug: property.items[0].slug,
        value: description,
      });
    }
  };

  const isValid = () => {
    return isPriceInput || !_.isEmpty(description);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.contentInput}
        multiline
        value={description}
        placeholder={t('createImagePostDescriptionPlaceholder')}
        onChangeText={text => setDescription(text)}
        keyboardType={isPriceInput ? 'number-pad' : 'default'}
      />
      {isPriceInput && (
        <Text
          style={{
            marginVertical: wp(6),
            marginHorizontal: wp(16),
          }}>
          {'Giá: ' + Utils.formatPrice(description)}
        </Text>
      )}
      {!_.isEmpty(label) && (
        <View style={styles.descriptionContainer}>
          <Text>{label.title.replace(/\\u2022/g,'\u2022')}</Text>
        </View>
      )}
      <TouchableOpacity
        disabled={!isValid()}
        style={[
          styles.buttonNext,
          !isValid() ? { backgroundColor: colors.flatGrey11 } : {},
        ]}
        onPress={() => onPressedNext()}>
        <Text style={styles.buttonNextTitle}>
          {t('createImagePostButtonNext')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputDescriptionView;
