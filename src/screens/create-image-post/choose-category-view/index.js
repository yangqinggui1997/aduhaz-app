import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import styles from './styles';
import colors from '../../../theme/colors';

import apiServices from '../../../services';
import { CATEGORY_TYPE, RESPONSE_STATUS } from '../../../commons/constants';
import Category from '../../../models/category';
import _ from 'lodash';
import FastImage from 'react-native-fast-image';

const ChooseCategoryView = ({
  componentId,
  parentId = 0,
  onSelectCategory,
}) => {
  const { t } = useTranslation();
  const [categoryList, setCategoryList] = useState([]);

  useEffect(() => {
    fetchCategories(parentId);
  }, [parentId]);

  const fetchCategories = async parentId => {
    try {
      const response = await apiServices.getCategories({
        type: CATEGORY_TYPE.POST,
        id_parent: parentId,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        setCategoryList(result.data.map(obj => Category.clone(obj)));
      }
    } catch (error) {}
  };

  const onSelectOption = async index => {
    try {
      const response = await apiServices.getCategories({
        type: CATEGORY_TYPE.POST,
        id_parent: categoryList[index].id,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        if (_.isFunction(onSelectCategory)) {
          onSelectCategory(categoryList[index], !_.isEmpty(result.data));
        }
      }
    } catch (error) {}
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
      <FlatList
        data={categoryList}
        renderItem={({ item, index }) => (
          <View key={index.toString}>{renderOptionItem(item, index)}</View>
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
      />
    </View>
  );
};

export default ChooseCategoryView;
