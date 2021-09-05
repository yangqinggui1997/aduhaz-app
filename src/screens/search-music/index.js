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

const SearchMusic = ({ componentId, onFinish }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [searchText, setSearchText] = useState('');
  const [suggestedKeyword, setSuggestedKeyword] = useState([]);

  const fetchSearchSuggestions = async searchText => {
    var _suggestedKeyword = [...suggestedKeyword];
    try {
      const response = await apiServices.getSearchSuggestions({
        searchText,
        type: SEARCH_TYPE.POST
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        _suggestedKeyword = response.data.result;
      }
      setSuggestedKeyword(_suggestedKeyword);
    } catch (error) {
      console.log('fetch search music suggestions error: ', error);
    }
  };

  const onPressBack = () => {
    Navigation.dismissModal(componentId);
  };

  const onFinishSelectSong = newSong => {
    onFinish(newSong);
    Navigation.dismissModal(componentId);
  }

  const onSelectedSearchText = text => {
    navigation.push(Screens.MusicList, {
        keySearch: _.isEmpty(text) ? searchText : text,
        type: 'search',
        onFinish: newSong => onFinishSelectSong(newSong)
    });
  };

  const renderSearchItem = (item, index) => {
    return (
      <TouchableOpacity
        style={style.searchItem}
        onPress={() => onSelectedSearchText(item)}>
        {/* {true && (
          <Ionicons name="timer-outline" size={24} color={colors.flatBlack02} />
        )} */}
        <Text style={style.searchItemText}>{item}</Text>
        <TouchableOpacity onPress={() => setSearchText(item)}>
          <MaterialIcons name="north-west" size={24} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      <View style={style.searchHeader}>
        <View style={style.searchInputContainer}>
          <TextInput
            style={style.searchInput}
            placeholder={t('search_placeholder')}
            value={searchText}
            returnKeyType="search"
            onSubmitEditing={() => onSelectedSearchText()}
            onChangeText={text => {
              setSearchText(text);
              fetchSearchSuggestions(text);
            }}
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
          style={style.backButton}
          onPress={() =>
            _.isEmpty(searchText) ? onPressBack() : onSelectedSearchText()
          }>
          <Text>
            {_.isEmpty(searchText) ? t('button_cancel') : t('search')}
          </Text>
        </TouchableOpacity>
      </View>
      <KeyboardView contentContainerStyle={{}}>
        <FlatList
          data={searchText != '' && suggestedKeyword}
          renderItem={({ item, index }) => renderSearchItem(item, index)}
          ItemSeparatorComponent={() => <View style={{ height: 24 }} />}
          keyExtractor={(_, index) => 'key' + index.toString()}
          bounces={false}
        />
      </KeyboardView>
    </Layout>
  );
};

export default SearchMusic;
