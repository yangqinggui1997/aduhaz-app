import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  Platform,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import apiServices from '../../services';
import { RESPONSE_STATUS, SEARCH_TYPE } from '../../commons/constants';
import storage from '../../storage';
import SearchSuggestionModel from '../../models/search-suggestion';
import Screens from '../../screens/screens';
import images from '../../assets/images';
import { KeyboardView, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import style from './style';
import _ from 'lodash';
import Utils from '../../commons/utils';

const MAX_DISPLAY_SEARCH_HISTORY = 10;

const SearchScreen = ({ componentId, type }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [searchText, setSearchText] = useState('');
  const [searchHistories, setSearchHistories] = useState([]);
  const [suggestedKeyword, setSuggestedKeyword] = useState([]);

  useEffect(() => {
    if (storage.isLoggedIn()) {
      fetchSearchHistories();
    }
  }, []);

  useEffect(() => {
    if (!_.isEmpty(searchText)) {
      fetchSearchSuggestions();
    }
  }, [searchText]);

  const fetchSearchSuggestions = async () => {
    var _suggestedKeyword = [...suggestedKeyword];
    try {
      const response = await apiServices.getSearchSuggestions({
        searchText: searchText,
        type: type,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        _suggestedKeyword = response.data.result;
      }
      setSuggestedKeyword(_suggestedKeyword);
    } catch (error) {
      console.log('fetch search suggestions error: ', error);
    }
  };

  const fetchSearchHistories = async () => {
    var _searchHistories = [...searchHistories];
    try {
      const response = await apiServices.getSearchHistories(type);
      if (response.data.status == RESPONSE_STATUS.OK) {
        _searchHistories = response.data.result;
      }
      setSearchHistories(_searchHistories);
    } catch (error) {
      console.log('fetch search histories error: ', error);
    }
  };

  const onPressBack = () => {
    Navigation.dismissModal(componentId);
  };

  const onSelectedSearchText = text => {
    navigation.push(Screens.SearchResult, {
      text: text ? text : searchText,
      type: type,
    });
  };

  const onDeleteSearchText = async text => {
    try {
      const response = await apiServices.deleteSearchHistory(text, type);
      if (response && Utils.isResponseSuccess(response)) {
        fetchSearchHistories();
      }
    } catch (error) {
      console.log('###onDeleteSearchText - error: ', error);
    }
  };

  const viewAllSearchHistory = () => {
    navigation.push(Screens.SearchHistory, {
      type: type,
      onSelectKeyword: onSelectedSearchText,
      onSearchHistoryChanged: fetchSearchHistories,
    });
  };

  const renderSearchSuggestionItem = (item, index) => {
    return (
      <TouchableOpacity
        style={style.searchItem}
        onPress={() => onSelectedSearchText(item)}>
        <Ionicons
          name={images.ionicons_search}
          size={24}
          color={colors.flatBlack02}
        />
        <Text style={style.searchItemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  const renderSearchHistoryItem = (item, index) => {
    return (
      <TouchableOpacity
        style={style.searchItem}
        onPress={() => onSelectedSearchText(item)}>
        <AntDesign name={'clockcircleo'} size={20} color={colors.flatBlack02} />
        <Text style={style.searchItemText}>{item}</Text>
        <TouchableOpacity
          onPress={() => {
            onDeleteSearchText(item);
          }}>
          <Ionicons name="close-outline" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const isShowingSearchHistory = () => {
    return _.isEmpty(searchText);
  };

  return (
    <Layout style={style.container}>
      <View style={style.searchHeader}>
        <TouchableOpacity onPress={() => onPressBack()}>
          <Ionicons name="close-outline" size={36} color={colors.flatBlack02} />
        </TouchableOpacity>
        <View style={style.searchInputContainer}>
          <TextInput
            style={style.searchInput}
            placeholder={t('search_placeholder')}
            value={searchText}
            returnKeyType="search"
            onSubmitEditing={() => onSelectedSearchText()}
            onChangeText={text => {
              setSearchText(text);
            }}
            autoFocus={true}
          />
          {!_.isEmpty(searchText) && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Ionicons
                name="close-outline"
                size={28}
                color={colors.flatBlack02}
              />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={style.rightButton}
          disabled={_.isEmpty(searchText)}
          onPress={() => onSelectedSearchText()}>
          <Text style={style.rightButtonTitle}>{t('search')}</Text>
        </TouchableOpacity>
      </View>
      {isShowingSearchHistory() &&
      searchHistories.length > MAX_DISPLAY_SEARCH_HISTORY ? (
        <TouchableOpacity
          style={style.viewAllHistoryButton}
          onPress={viewAllSearchHistory}>
          <Text style={style.viewAllHistoryText}>{t('viewAll')}</Text>
        </TouchableOpacity>
      ) : null}
      <FlatList
        style={style.listView}
        data={
          isShowingSearchHistory()
            ? searchHistories.slice(0, MAX_DISPLAY_SEARCH_HISTORY)
            : suggestedKeyword
        }
        renderItem={({ item, index }) => {
          if (isShowingSearchHistory()) {
            return renderSearchHistoryItem(item, index);
          } else {
            return renderSearchSuggestionItem(item, index);
          }
        }}
        ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
        keyExtractor={(_, index) => 'key' + index.toString()}
        bounces={false}
      />
    </Layout>
  );
};

SearchScreen.options = {
  statusBar: {
    backgroundColor: colors.white,
    style: 'dark',
  },
  animations: {
    showModal: {
      alpha: {
        from: 0.75,
        to: 1,
        duration: 100,
        interpolation: 'accelerate',
      },
    },
    dismissModal: {
      alpha: {
        from: 1,
        to: 0,
        duration: 100,
        interpolation: 'accelerate',
      },
    },
  },
};

export default SearchScreen;
