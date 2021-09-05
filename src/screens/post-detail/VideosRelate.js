import React, { useCallback, useEffect, useState, useRef } from 'react';
import { View, FlatList, Share, Toast, Alert } from 'react-native';
import * as Progress from 'react-native-progress';
import { useTranslation } from 'react-i18next';
import storage from '../../storage';
import { SocialPost, showMenuPostSelection } from '../../components';
import VideoModel from '../../models/video_post';
import apiService from '../../services';
import styles from './style';
import { useNavigation } from '../../hooks';
import Screens from '../screens';
import Utils from '../../commons/utils';
import { RESPONSE_STATUS, POST_MENU_TYPE } from '../../commons/constants';
import { MENU } from '../../commons/app-data';

function VideosRelate({ componentId }) {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

  const [loading, setLoading] = useState(false);
  const [videos, setVideos] = useState([]);

  const currentPage = useRef(1);
  const isFetching = useRef(false);

  useEffect(() => {
    getVideos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getVideos = useCallback(async () => {
    setLoading(true);
    isFetching.current = true;
    try {
      const res = await apiService.getVideosRelate({
        page: currentPage.current,
        post_per_page: 50,
      });
      if (res.data?.posts?.length) {
        const serializedVideos = res.data.posts.map(videoItem =>
          VideoModel.clone(videoItem),
        );
        if (currentPage.current === 1) {
          // set
          setVideos(serializedVideos);
        } else {
          // concat
          setVideos(videos.concat(serializedVideos));
        }
        currentPage.current += 1;
      } else {
        currentPage.current = 0;
      }
      setLoading(false);
      isFetching.current = false;
    } catch (error) {
      setLoading(false);
      isFetching.current = false;
    }
  }, [videos]);

  const onPressSaveVideoPost = async postId => {
    const _videoPosts = [...videos];
    const postIndex = _videoPosts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      try {
        if (_videoPosts[postIndex].saved === 1) {
          const response = await apiService.unsaveVideo(
            _videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            _videoPosts[postIndex].saved = 0;
          } else {
            console.log('UNSAVE ERROR');
          }
        } else {
          const response = await apiService.saveVideo(
            _videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            _videoPosts[postIndex].saved = 1;
          } else {
            console.log('UNSAVE ERROR');
          }
        }
        setVideos(_videoPosts);
      } catch (error) {
        console.log('SAVE/UNSAVE ERROR: ', error);
      }
    }
  };

  const onPressShare = async item => {
    if (storage.isLoggedIn()) {
      try {
        const urlShare = item.shareLink;
        await Share.share({
          message: `${t('post_menu_share')} : ${urlShare}`,
          url: urlShare,
        });
      } catch (error) {
        Toast(error.message);
      }
    } else {
      Alert.alert(t('alertLogin'));
    }
  };

  const onPressReport = async item => {
    navigation.push(Screens.Report, {
      postId: item.id,
    });
  };

  const _renderItem = ({ item }) => {
    return (
      <SocialPost
        componentId={componentId}
        item={item}
        staticPost={true}
        style={{
          margin: 5,
          width: Utils.getScreenWidth() * 0.8,
        }}
        onPressItem={() => {
          navigation.push(Screens.VideoList, {
            videoId: item.id,
          });
        }}
        onPressVideo={() => {
          navigation.push(Screens.VideoList, {
            videoId: item.id,
          });
        }}
        onOpenMenu={() => {
          showMenuPostSelection({
            data: item.saved === 0 ? MENU.grids : MENU.unSaveGrids,
            onSelectedItem: menuItem => {
              switch (menuItem.type) {
                case POST_MENU_TYPE.SAVE:
                  setTimeout(() => onPressSaveVideoPost(item.id), 200);
                  break;
                case POST_MENU_TYPE.UNSAVE:
                  setTimeout(() => onPressSaveVideoPost(item.id), 200);
                  break;
                case POST_MENU_TYPE.SHARE:
                  setTimeout(() => onPressShare(item), 200);
                  break;
                case POST_MENU_TYPE.REPORT:
                  setTimeout(() => onPressReport(item), 200);
                  break;
                default:
                  break;
              }
            },
          });
        }}
      />
    );
  };

  const onLoadMore = useCallback(() => {
    if (currentPage.current > 1 && !isFetching.current) {
      getVideos();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <FlatList
      horizontal
      data={videos}
      renderItem={_renderItem}
      keyExtractor={item => item.id.toString()}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={!loading}
      initialNumToRender={10}
      onEndReachedThreshold={0.01}
      onEndReached={onLoadMore}
      ListFooterComponent={() =>
        currentPage.current > 0 ? (
          <View style={styles.progressIndicatorContainer}>
            <Progress.Circle
              size={30}
              indeterminate={true}
              color={'gray'}
              borderWidth={1.5}
            />
          </View>
        ) : null
      }
    />
  );
}

export default VideosRelate;
