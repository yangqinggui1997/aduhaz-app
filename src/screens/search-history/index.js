import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, FlatList, Text } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import apiServices from '../../services';
import storage from '../../storage';
import { Layout } from '../../components';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import style from './style';
import _ from 'lodash';
import Utils from '../../commons/utils';

const SearchHistory = ({
  componentId,
  type,
  onSelectKeyword,
  onSearchHistoryChanged,
}) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [searchHistories, setSearchHistories] = useState([]);

  useEffect(() => {
    if (storage.isLoggedIn()) {
      fetchSearchHistories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchSearchHistories = async () => {
    var _searchHistories = [...searchHistories];
    try {
      const response = await apiServices.getSearchHistories(type);
      if (response && Utils.isResponseSuccess(response)) {
        _searchHistories = response.data.result;
      }
      setSearchHistories(_searchHistories);
    } catch (error) {
      console.log('fetch search histories error: ', error);
    }
  };

  const onPressBack = () => {
    navigation.pop();
  };

  const onSelectedSearchText = text => {
    navigation.pop();
    setTimeout(() => {
      if (onSelectKeyword) {
        onSelectKeyword(text);
      }
    }, 500);
  };

  const onDeleteSearchText = async text => {
    try {
      const response = await apiServices.deleteSearchHistory(text, type);
      if (response && Utils.isResponseSuccess(response)) {
        fetchSearchHistories();
        if (onSearchHistoryChanged) {
          onSearchHistoryChanged();
        }
      }
    } catch (error) {
      console.log('###onDeleteSearchText - error: ', error);
    }
  };

  const onDeleteAllSearchText = async () => {
    try {
      const response = await apiServices.deleteSearchHistories(type);
      if (response && Utils.isResponseSuccess(response)) {
        fetchSearchHistories();
        if (onSearchHistoryChanged) {
          onSearchHistoryChanged();
        }
      }
    } catch (error) {
      console.log('###onDeleteSearchText - error: ', error);
    }
  };

  const renderSearchItem = (item, index) => {
    return (
      <TouchableOpacity
        style={style.searchItem}
        onPress={() => onSelectedSearchText(item)}>
        <AntDesign name={'clockcircleo'} size={20} color={colors.flatBlack02} />
        <Text style={style.searchItemText}>{item}</Text>
        <TouchableOpacity onPress={() => onDeleteSearchText(item)}>
          <Ionicons name="close-outline" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      <View style={style.searchHeader}>
        <TouchableOpacity style={style.backButton} onPress={onPressBack}>
          <Ionicons name="arrow-back" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>
        <Text style={style.screenTitle}>{t('searchHistory')}</Text>
        <TouchableOpacity
          style={style.clearButton}
          onPress={onDeleteAllSearchText}>
          <Text style={style.rightButtonTitle}>{t('deleteAll')}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        style={style.listView}
        data={searchHistories}
        renderItem={({ item, index }) => renderSearchItem(item, index)}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
        bounces={false}
      />
    </Layout>
  );
};

SearchHistory.options = {
  statusBar: {
    backgroundColor: colors.white,
    style: 'dark',
  },
};

export default SearchHistory;
