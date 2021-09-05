import React, { useState, useRef, useEffect } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { NavBar, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import Icon from 'react-native-vector-icons/FontAwesome';
import images from '../../assets/images';
import Screens from '../../screens/screens';
import Colors from '../../theme/colors';
import FavoritePostModel from '../../models/favorite-post';
import FastImage from 'react-native-fast-image';
import Utils from '../../commons/utils';
import moment from 'moment';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import styles from './style';

const FavoriteListings = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [posts, setPosts] = useState({
    data: [],
    currentPage: 0,
  });

  useEffect(() => {
    fetchFavoriteImagePosts();
  }, [posts.currentPage]);

  const onRefresh = () => {
    setPosts({
      data: [],
      currentPage: 0,
    });
  };

  const handleLoadMore = () => {
    setPosts({
      data: posts.data,
      currentPage: posts.currentPage + 1,
    });
  };

  const unlikePost = async id => {
    try {
      const response = await apiServices.unlikePost(id);
      if (response.data.status == RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchFavoriteImagePosts = async () => {
    var _posts = [...posts.data];
    try {
      const response = await apiServices.getFavoriteImagePosts({
        page: posts.currentPage === 0 ? 1 : posts.currentPage,
        post_per_page: 6,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (posts.currentPage <= 1) {
          _posts = response.data.data.map(obj => FavoritePostModel.clone(obj));
          setPosts({
            data: _posts,
            currentPage: 1,
          });
        } else {
          _posts = _posts.concat(
            response.data.data.map(obj => FavoritePostModel.clone(obj)),
          );
          setPosts({
            data: _posts,
            currentPage: posts.currentPage,
          });
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemContainer,
          index === posts.data.length ? styles.lastItem : {},
        ]}
        onPress={() =>
          navigation.showModal(Screens.PostDetail, { postInfo: item })
        }>
        <View style={styles.imageContainer}>
          <FastImage
            style={styles.itemImage}
            source={{
              uri: item.icon,
              priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>

        <View style={styles.nameView}>
          <Text numberOfLines={1} ellipsizeMode="tail" style={styles.itemName}>
            {item.postTitle}
          </Text>
          <TouchableOpacity
            onPress={() => unlikePost(item.id)}
            style={styles.favoriteImage}>
            <Icon
              name={images.icon_favorite_highlight}
              size={26}
              color={Colors.crimsonRed}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{`${Utils.formatPrice(
          parseInt(item.price),
        )}`}</Text>

        <View style={styles.bottomView}>
          <Icon
            name={images.icon_history}
            size={12}
            color={Colors.flatGrey03}
          />
          <Text style={styles.time}>
            {Utils.getPostTime(moment.unix(item.postDate).toDate())}
          </Text>
          <Icon
            name={images.icon_location}
            size={12}
            color={Colors.flatGrey03}
          />
          <Text
            style={[styles.time, { flex: 1 }]}
            numberOfLines={1}
            ellipsizeMode="tail">
            {item.province.name}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('favoriteListings')} />
      <View style={styles.contentView}>
        <FlatList
          data={posts.data}
          style={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          bounces={false}
          keyExtractor={item => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
        />
      </View>
    </Layout>
  );
};

export default FavoriteListings;
