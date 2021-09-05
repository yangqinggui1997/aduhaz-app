import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TouchableOpacity,
  TextInput,
  FlatList,
  Text,
  Platform,
  Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import apiServices from '../../services';
import { RESPONSE_STATUS, SEARCH_TYPE } from '../../commons/constants';
import PostModel from '../../models/post';
import VideoPostModel from '../../models/video_post';
import Screens from '../../screens/screens';
import images from '../../assets/images';
import {
  Layout,
  showLocationSelectionView,
  showCategorySelectionView,
  showFilterSelectionView,
} from '../../components';
import _ from 'lodash';
import Utils from '../../commons/utils';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import style from './style';
import moment from 'moment';
import { Navigation } from 'react-native-navigation';

const SearchResult = ({ componentId, text = '', type }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [searchText, setSearchText] = useState(text);
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [posts, setPosts] = useState({
    data: [],
    currentPage: 1,
  });

  useEffect(() => {
    onRefresh();
  }, [searchText, filterLocation, filterCategory, posts.currentPage]);

  const onRefresh = () => {
    if (searchText != '') {
      if (type == SEARCH_TYPE.POST) {
        fetchPosts(searchText);
      } else if (type == SEARCH_TYPE.VIDEO) {
        fetchVideos(searchText);
      }
    }
  };

  const onPressBack = () => {
    Navigation.dismissAllModals();
  };

  const onPressFilterCategory = () => {
    showCategorySelectionView({
      onSelectedCategory: category => {
        setFilterCategory(category);
        setPosts({
          data: [],
          currentPage: 1,
        });
      },
    });
  };

  const onPressFilterLocation = () => {
    showLocationSelectionView({
      onSelectedItem: location => {
        setFilterLocation(location);
        setPosts({
          data: [],
          currentPage: 1,
        });
      },
    });
  };

  const handleLoadMore = () => {
    setPosts({
      data: posts.data,
      currentPage: posts.currentPage + 1,
    });
  };

  const fetchPosts = async text => {
    var _posts = [...posts.data];
    try {
      const response = await apiServices.search({
        keySearch: text,
        type: SEARCH_TYPE.POST,
        postPerPage: 6,
        page: posts.currentPage,
        categoryId: filterCategory
          ? filterCategory.id_category
            ? filterCategory.id_category
            : ''
          : '',
        stateId: filterLocation
          ? filterLocation.id
            ? filterLocation.id
            : ''
          : '',
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (posts.currentPage === 1) {
          _posts = response.data.result.map(p => PostModel.clone(p));
        } else {
          _posts = _posts.concat(
            response.data.result.map(p => PostModel.clone(p)),
          );
        }
        setPosts({
          data: _posts,
          currentPage: posts.currentPage,
        });
      }
    } catch (error) {
      console.log('fetch posts error: ', error);
    }
  };

  const fetchVideos = async text => {
    var _posts = [...posts.data];
    try {
      const response = await apiServices.search({
        keySearch: text,
        type: SEARCH_TYPE.VIDEO,
        postPerPage: 6,
        page: posts.currentPage,
        categoryId: '',
        stateId: '',
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (posts.currentPage === 1) {
          _posts = response.data.result.map(p => VideoPostModel.clone(p));
        } else {
          _posts = _posts.concat(
            response.data.result.map(p => VideoPostModel.clone(p)),
          );
        }
        setPosts({
          data: _posts,
          currentPage: posts.currentPage,
        });
      }
    } catch (error) {
      console.log('fetch video error: ', error);
    }
  };

  const onPressSearchButton = () => {
    Keyboard.dismiss();
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={style.postView}
        onPress={() =>
          type === SEARCH_TYPE.POST
            ? navigation.showModal(Screens.PostDetail, { postInfo: item })
            : navigation.push(Screens.VideoList, { videoId: item.id })
        }>
        <FastImage
          style={style.postImage}
          source={{
            uri: item.icon,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={style.postDetails}>
          <Text numberOfLines={3} ellipsizeMode="tail" style={style.postName}>
            {item.postTitle}
          </Text>
          <Text style={style.postTime}>
            {Utils.getPostTime(moment.unix(item.postDate).toDate())}
          </Text>
          {type == SEARCH_TYPE.POST && (
            <Text style={style.price}>
              {`${Utils.formatPrice(parseInt(item.price))}`}
            </Text>
          )}
          <Text style={style.postTime}>
            {type == SEARCH_TYPE.POST ? item.province : item.city}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      <View style={style.searchHeader}>
        {/* header view */}
        <View style={style.searchInputContainer}>
          <TextInput
            style={style.searchInput}
            placeholder={t('search_placeholder')}
            value={searchText}
            returnKeyType="search"
            onSubmitEditing={() => fetchPosts(searchText)}
            onChangeText={text => {
              setSearchText(text);
              setPosts({
                data: [],
                currentPage: 1,
              });
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
          style={style.rightButton}
          onPress={() =>
            _.isEmpty(searchText) ? onPressBack() : onPressSearchButton()
          }>
          <Text style={style.rightButtonTitle}>
            {_.isEmpty(searchText) ? t('button_cancel') : t('search')}
          </Text>
        </TouchableOpacity>
      </View>
      {/* Filter bar */}
      {type == SEARCH_TYPE.POST && (
        <View style={style.filterBar}>
          <TouchableOpacity
            style={style.filterButton}
            onPress={onPressFilterLocation}>
            <Text>
              {filterLocation ? filterLocation.name : t('filterAllLocation')}
            </Text>
            <Ionicons
              name={images.ionicons_caret_down}
              size={12}
              color={colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressFilterCategory}
            style={[
              style.filterButton,
              {
                borderColor: colors.lightFlatGrey,
                borderLeftWidth: 1,
                borderRightWidth: 1,
              },
            ]}>
            <Text>
              {filterCategory ? filterCategory.name : t('filterAllCategory')}
            </Text>
            <Ionicons
              name={images.ionicons_caret_down}
              size={12}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
      )}
      <FlatList
        data={posts.data}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, i) => `${item.id.toString()}-${i}`}
        onEndReachedThreshold={0}
        onEndReached={handleLoadMore}
      />
    </Layout>
  );
};

export default SearchResult;
