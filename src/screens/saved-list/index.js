import React, { useRef, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
  Share,
  Toast,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { useTranslation } from 'react-i18next';
import { NavBar, Layout, showMenuPostSelection } from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import images from '../../assets/images';
import { MENU } from '../../commons/app-data';
import { POST_MENU_TYPE } from '../../commons/constants';
import Colors from '../../theme/colors';
import styles from './style';
import apiServices from '../../services';
import { RESPONSE_STATUS, SORT_BY, ORDER } from '../../commons/constants';
import SavedPostModel from '../../models/savedPost';
import { useNavigation } from '../../hooks';
import Screens from '../../screens/screens';

const SavedList = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [total, setTotal] = useState(0);
  const [sortType, setSortType] = useState({
    sortBy: '',
    order: '',
  });

  const onPressMenuButton = ({ item }) => {
    showMenuPostSelection({
      data: MENU.itemSavedMenu,
      onSelectedItem: menuItem => {
        switch (menuItem.type) {
          case POST_MENU_TYPE.SHARE:
            setTimeout(() => onPressShare(item), 200);
            break;
          case POST_MENU_TYPE.UNSAVE:
            unSavePost(item.id);
            break;
          default:
            break;
        }
      },
    });
  };

  const onPressSortButton = () => {
    showMenuPostSelection({
      data: MENU.savedListSort,
      onSelectedItem: menuItem => {
        switch (menuItem.id) {
          case 1:
            setSortType({
              sortBy: SORT_BY.DATE_OF_POST,
              order: ORDER.DESCENDING,
            });
            onRefresh();
            break;
          case 2:
            setSortType({
              sortBy: SORT_BY.DATE_OF_POST,
              order: ORDER.ASCENDING,
            });
            onRefresh();
            break;
          default:
            setSortType({
              sortBy: SORT_BY.VIEW,
              order: ORDER.DESCENDING,
            });
            onRefresh();
            break;
        }
      },
    });
  };

  const onPressShare = async item => {
    try {
      const urlShare = item.shareLink;
      await Share.share({
        message: `${t('post_menu_share')} : ${urlShare}`,
        url: urlShare,
      });
    } catch (error) {
      Toast(error.message);
    }
  };

  const onRefresh = () => {
    setPosts([]);
    setCurrentPage(0);
  };

  useEffect(() => {
    if (currentPage >= 0) {
      fetchPosts();
    }
  }, [currentPage]);

  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1);
  };

  const fetchPosts = async () => {
    var _posts = [...posts];
    try {
      const response = await apiServices.getSavedList({
        page: currentPage === 0 ? 1 : currentPage,
        post_per_page: 6,
        order: sortType.order,
        order_by: sortType.sortBy,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (response.data.data.length > 0) {
          if (currentPage <= 1) {
            _posts = response.data.data.map(obj => SavedPostModel.clone(obj));
            setCurrentPage(1);
          } else {
            _posts = _posts.concat(
              response.data.data.map(obj => SavedPostModel.clone(obj)),
            );
          }
          setPosts(_posts);
        }
        setTotal(response.data.total);
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const unSavePost = async postId => {
    try {
      const response = await apiServices.unSavePost(postId);
      if (response.data.status == RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('error::', error);
    }
  };

  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          item.type === 'video'
            ? navigation.push(Screens.VideoList, { videoId: item.id })
            : navigation.showModal(Screens.PostDetail, { postInfo: item })
        }
        style={styles.postContainer}>
        <FastImage
          style={styles.video}
          source={{
            uri: item.poster,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />

        <View style={styles.postDetails}>
          <Text
            style={styles.videoTitle}
            numberOfLines={2}
            ellipsizeMode="tail">
            {item.postTitle}
          </Text>
          <Text style={styles.userName}>{item.user.name}</Text>
        </View>
        <TouchableOpacity
          style={styles.menu}
          onPress={() => onPressMenuButton({ item })}>
          <Ionicons
            name={images.ionicons_menu_vertical}
            size={24}
            color={Colors.flatGrey13}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('savedList')} />
      <View style={styles.contentView}>
        <View style={styles.topView}>
          <Text style={styles.countPost}>
            {total} {t('posts')}
          </Text>
          <TouchableOpacity style={styles.sortView} onPress={onPressSortButton}>
            <Ionicons name={images.icon_sort} size={14} color={Colors.black} />
            <Text style={styles.sort}>{t('sort')}</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={posts}
          style={styles.list}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
        />
      </View>
    </Layout>
  );
};

export default SavedList;
