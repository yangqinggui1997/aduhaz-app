import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

import styles from './styles';
import colors from '../../../theme/colors';

import _ from 'lodash';

const InputTitleView = ({
  componentId,
  property,
  value = { value: '' },
  onNext = null,
  onUpdate = null,
}) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(value.value);
  const [label, setLabel] = useState(null);

  useEffect(() => {
    if (property && !_.isEmpty(property.items)) {
      setLabel(property.items.find(item => item.type_control === 'label'));
    }
  }, [property]);

  useEffect(() => {
    if (_.isFunction(onUpdate)) {
      onUpdate({
        slug: 'title',
        value: title,
      });
    }
  }, [title]);

  const onPressedNext = () => {
    if (_.isFunction(onNext)) {
      onNext({
        slug: 'title',
        value: title,
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.contentInput}
        value={title}
        placeholder={t('createImagePostTitlePlaceholder')}
        onChangeText={text => setTitle(text)}
      />
      {!_.isEmpty(label) && (
        <View style={styles.descriptionContainer}>
          <Text>{label.title.replace(/\\u2022/g, '\u2022')}</Text>
        </View>
      )}
      <TouchableOpacity
        disabled={title === ''}
        style={[
          styles.buttonNext,
          title === '' ? { backgroundColor: colors.flatGrey11 } : {},
        ]}
        onPress={() => onPressedNext()}>
        <Text style={styles.buttonNextTitle}>
          {t('createImagePostButtonNext')}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default InputTitleView;
