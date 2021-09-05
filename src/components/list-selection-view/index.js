import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colors from '../../theme/colors';

import Screens from '../../screens/screens';
import _ from 'lodash';
import RatioButton from '../ratio-button';

export default function showListSelectionView({
  isClosedOnTouchOutside = true,
  onSelectedItem = null,
  selectedItem = null,
  title = '',
  items = [],
  showRadioButton = true,
  height = 400,
  componentId,
}) {
  Navigation.showOverlay({
    component: {
      name: Screens.BottomSheet,
      options: {
        overlay: {
          interceptTouchOutside: _.isBoolean(isClosedOnTouchOutside)
            ? isClosedOnTouchOutside
            : false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        renderBody: ({ hideBottomSheet }) => (
          <ListSelectionView
            title={title}
            items={items}
            selectedItem={selectedItem}
            onClose={hideBottomSheet}
            onSelectedItem={onSelectedItem}
            showRadioButton={showRadioButton}
          />
        ),
        height,
      },
    },
  });
}

const ListSelectionView = ({
  title,
  items,
  onClose,
  onSelectedItem,
  selectedItem,
  showRadioButton,
  ...props
}) => {
  const { t } = useTranslation();

  const onPressClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const onSelectOption = index => {
    if (_.isFunction(onSelectedItem)) {
      onSelectedItem(index);
    }
    onPressClose();
  };

  const renderOptionItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => onSelectOption(index)}>
        <Text style={styles.itemText}>{item}</Text>
        {showRadioButton && (
          <RatioButton
            checked={item === selectedItem}
            onSelected={() => onSelectOption(index)}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{title}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
          <Ionicons name={'close'} size={26} color={colors.flatGrey05} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        renderItem={({ item, index }) => (
          <View key={index.toString}>{renderOptionItem(item, index)}</View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
      />
    </View>
  );
};
