import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import styles from './styles';
import colors from '../../theme/colors';
import Screens from '../../screens/screens';
import { Navigation } from 'react-native-navigation';
import _ from 'lodash';
import apiServices from '../../services';
import { CATEGORY_TYPE, RESPONSE_STATUS } from '../../commons/constants';
import { useTranslation } from 'react-i18next';
import Category from '../../models/category';
import FastImage from 'react-native-fast-image';

export default function showCategorySelectionView({
  parentCategory = null,
  isClosedOnTouchOutside = true,
  onSelectedCategory = null,
  type = CATEGORY_TYPE.POST,
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
          <CategorySelectionView
            parentCategory={parentCategory}
            type={type}
            onClose={hideBottomSheet}
            onSelectedCategory={onSelectedCategory}
          />
        ),
        height: 400,
      },
    },
  });
}

const CategorySelectionView = ({
  parentCategory = null,
  onClose,
  onSelectedCategory,
  type = CATEGORY_TYPE.POST,
  ...props
}) => {
  const { t } = useTranslation();

  const [currentList, setCurrentList] = useState([]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiServices.getCategories({
        type,
        id_parent: parentCategory ? parentCategory.id : 0,
      });
      const result = response.data;
      if (result.status === RESPONSE_STATUS.OK && result.data) {
        setCurrentList(
          [{ name: t('filterAllCategory'), id: null }].concat(
            result.data.map(obj => Category.clone(obj)),
          ),
        );
      }
    } catch (error) {}
  };

  const onPressClose = () => {
    if (onClose) {
      onClose();
    }
  };

  const onSelectOption = index => {
    if (_.isFunction(onSelectedCategory)) {
      onSelectedCategory(currentList[index]);
    }
    onPressClose();
  };

  const renderOptionItem = (item, index) => {
    return (
      <TouchableOpacity
        style={styles.itemRow}
        onPress={() => onSelectOption(index)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <FastImage style={styles.icon} source={{ uri: item.icon }} />
          <Text style={styles.itemText}>{item.name}</Text>
        </View>
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
      <View style={styles.header}>
        <Text style={styles.title}>{t('searchFilterCategoryTitle')}</Text>
        <TouchableOpacity style={styles.closeButton} onPress={onPressClose}>
          <Ionicons name={'close'} size={26} color={colors.flatGrey05} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={currentList}
        renderItem={({ item, index }) => (
          <View key={index.toString}>{renderOptionItem(item, index)}</View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
      />
    </View>
  );
};

CategorySelectionView.propTypes = {};
