import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Alert,
  Share,
  Toast,
  RefreshControl,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { MENU } from '../../commons/app-data';
import {
  NavBar,
  Layout,
  UserVideo,
  showMenuPostSelection,
  showStatisticalPopup,
  ProfileView,
} from '../../components';
import { useNavigation } from '../../hooks';
import styles from './style';
import VideoPostModel from '../../models/video_post';
import {
  RESPONSE_STATUS,
  POST_MENU_TYPE,
  POST_TYPE,
} from '../../commons/constants';
import storage from '../../storage';
import apiServices from '../../services';
import Screens from '../screens';

const ManageVideo = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [interactItemIndex, setInteractItemIndex] = useState(0); // used for pause another video when play specify video
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [videos, setVideos] = useState({
    data: [],
    currentPage: 1,
  });

  useEffect(() => {
    fetchVideos();
  }, [videos.currentPage]);

  const onRefresh = () => {
    setVideos({
      data: [],
      currentPage: 0,
    });
  };

  const handleLoadMore = () => {
    setVideos({
      data: videos.data,
      currentPage: videos.currentPage + 1,
    });
  };

  const onPressStatistical = ({ item }) => {
    showStatisticalPopup({
      item: item,
      type: POST_TYPE.VIDEO,
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

  const onInteractItem = index => {
    setInteractItemIndex(index);
  };

  const showConfirmAlert = id =>
    Alert.alert(
      t('alertRemoveVideoTitle'),
      t('alertRemoveVideoMsg'),
      [
        {
          text: t('alertRemoveVideoButtonCancelTitle'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('alertRemoveVideoButtonComfirmTitle'),
          onPress: () => deleteVideo(id),
        },
      ],
      {
        cancelable: true,
      },
    );

  const deleteVideo = async id => {
    try {
      const response = await apiServices.deleteVideo({
        _method: 'DELETE',
        id: id,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchVideos = async () => {
    var _videos = [...videos.data];
    try {
      const response = await apiServices.getVideos({
        id_user: storage.user.id,
        post_per_page: 6,
        page: videos.currentPage,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (videos.currentPage <= 1) {
          _videos = response.data.posts.map(p => VideoPostModel.clone(p));
          setVideos({
            data: _videos,
            currentPage: 1,
          });
        } else {
          _videos = _videos.concat(
            response.data.posts.map(p => VideoPostModel.clone(p)),
          );
          setVideos({
            data: _videos,
            currentPage: videos.currentPage,
          });
        }
      }
    } catch (error) {
      console.log('fetch videos error: ', error);
    }
  };

  return (
    <Layout>
      <View style={styles.container}>
        <NavBar parentComponentId={componentId} title={t('manageVideo')} />
        <FlatList
          data={videos.data}
          style={styles.list}
          refreshControl={
            <RefreshControl
              onRefresh={() => {
                onRefresh();
              }}
              refreshing={isRefreshing}
            />
          }
          renderItem={({ item, index }) => (
            <UserVideo
              item={item}
              isInteract={interactItemIndex === index}
              onInteract={() => onInteractItem(index)}
              onOpenMenu={() => {
                showMenuPostSelection({
                  data: MENU.itemVideoMenu,
                  onSelectedItem: menuItem => {
                    switch (menuItem.type) {
                      case POST_MENU_TYPE.SHARE:
                        setTimeout(() => onPressShare(item), 200);
                        break;
                      case POST_MENU_TYPE.EDIT:
                        navigation.showModal(Screens.EditVideoPost, {
                          postId: item.id,
                          categoryId: item.parentId,
                          onFinishEdit: () => {
                            onRefresh();
                          },
                        });
                        break;
                      case POST_MENU_TYPE.DELETE:
                        showConfirmAlert(item.id);
                        break;
                      default:
                        break;
                    }
                  },
                });
              }}
              onOnpenStatistical={() => onPressStatistical({ item })}
            />
          )}
          ListHeaderComponent={<ProfileView componentId={componentId} />}
          ItemSeparatorComponent={() => <View style={styles.videoSeparator} />}
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          onEndReachedThreshold={0.5}
          onEndReached={handleLoadMore}
        />
      </View>
    </Layout>
  );
};

export default ManageVideo;
