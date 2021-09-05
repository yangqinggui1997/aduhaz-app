import React, { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FlatList,
  Platform,
  RefreshControl,
  Share,
  Toast,
  View,
  Alert,
} from 'react-native';
import storage from '../../storage';
import { MENU } from '../../commons/app-data';
import { POST_MENU_TYPE, RESPONSE_STATUS } from '../../commons/constants';
import {
  NavBar,
  SocialPost,
  showMenuPostSelection,
  LoadingView,
} from '../../components';
import {
  useComponentDidAppearListener,
  useComponentDidDisappearListener,
  useNavigation,
} from '../../hooks';
import SavedPostModel from '../../models/savedPost';
import VideoPostModel from '../../models/video_post';
import apiServices from '../../services';
import colors from '../../theme/colors';
import styles from './style';
import Screens from '../screens';
import { Colors } from '../../theme';
import Utils from '../../commons/utils';

const VideoList = ({ videoId = '', componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [savedVideos, setSavedVideos] = useState([]);
  const [videos, setVideos] = useState({
    data: [],
    currentPage: 1,
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleVideoIndex, setVisibleIndex] = useState(0);
  const [playerPaused, setPlayerPaused] = useState(false);
  const [renderPlaceHolder, setRenderPlaceHolder] = useState(true);
  const [isMuted, setMuted] = useState(false);
  const flatList = useRef(null);
  const touchX = useRef(0);

  const viewDidAppear = e => {
    setPlayerPaused(false);
  };

  const viewDidDisappear = e => {
    setPlayerPaused(true);
  };
  useComponentDidAppearListener(viewDidAppear, componentId);
  useComponentDidDisappearListener(viewDidDisappear, componentId);

  useEffect(() => {
    fetchVideos();
  }, [videos.currentPage]);

  useEffect(() => {
    setTimeout(() => {
      onRefresh();
    }, 3000);
  }, []);

  const onRefresh = () => {
    fetchSavedVideo();
  };

  const isSavedVideo = id => {
    if (savedVideos.filter(p => p.id === id).length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const handleLoadMore = () => {
    setVideos({
      data: videos.data,
      currentPage: videos.currentPage + 1,
    });
  };

  const saveVideo = async id => {
    try {
      const response = await apiServices.saveVideo(id);
      if (response.data.status === RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('save video error: ', error);
    }
  };

  const unsaveVideo = async id => {
    try {
      const response = await apiServices.unsaveVideo(id);
      if (response.data.status === RESPONSE_STATUS.OK) {
        onRefresh();
      }
    } catch (error) {
      console.log('unsave video error: ', error);
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

  const fetchSavedVideo = async () => {
    const response = await apiServices.getSavedList({});
    var _savedVideos = [...savedVideos];
    try {
      if (response.data.status === RESPONSE_STATUS.OK) {
        _savedVideos = response.data.data.map(p => SavedPostModel.clone(p));
      }
      setSavedVideos(_savedVideos);
    } catch (error) {
      console.log('fetch saved videos error: ', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const fetchVideos = async () => {
    const getVideoRequest = apiServices.getVideo(videoId);
    const getMoreVideo = apiServices.getVideosRelate({
      page: videos.currentPage === 0 ? 1 : videos.currentPage,
      post_per_page: 50,
    });
    const requests = [getVideoRequest, getMoreVideo];
    try {
      const responses = await Promise.all(requests);
      var _videos = [...videos.data];
      if (
        responses.length > 0 &&
        responses[0].data.status === RESPONSE_STATUS.OK &&
        responses[1].data.status === RESPONSE_STATUS.OK
      ) {
        if (videos.currentPage === 1) {
          _videos.push(VideoPostModel.clone(responses[0].data.post));
          _videos = _videos.concat(
            responses[1].data.posts.map(p => VideoPostModel.clone(p)),
          );
        } else {
          _videos = _videos.concat(
            responses[1].data.posts.map(p => VideoPostModel.clone(p)),
          );
        }
        setVideos({
          data: _videos,
          currentPage: videos.currentPage,
        });
      }
    } catch (error) {
      console.log('error: ', error);
    } finally {
      setRenderPlaceHolder(false);
    }
  };

  const onPressLikeVideoPost = async postId => {
    const videoPosts = [...videos.data];
    const postIndex = videoPosts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      try {
        if (videoPosts[postIndex].liked) {
          const response = await apiServices.unlikeVideo(
            videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status == RESPONSE_STATUS.OK) {
            videoPosts[postIndex].liked = false;
            videoPosts[postIndex].likes =
              videoPosts[postIndex].likes - 1 >= 0
                ? videoPosts[postIndex].likes - 1
                : 0;
          } else {
            console.log('UNLIKE ERROR');
          }
        } else {
          const response = await apiServices.likeVideo(
            videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            videoPosts[postIndex].liked = true;
            videoPosts[postIndex].likes = videoPosts[postIndex].likes + 1;
          } else {
            console.log('UNLIKE ERROR');
          }
        }
        setVideos({
          data: videoPosts,
          currentPage: videos.currentPage,
        });
      } catch (error) {
        console.log('LIKE/UNLIKE ERROR: ', error);
      }
    }
  };

  const onPressFollow = async _item => {
    console.log('###onPressFollow: ', _item);
    if (storage.isLoggedIn()) {
      try {
        console.log('###onPressFollow - _item: ', _item);
        let res;
        if (_item.user?.follow_status) {
          // unfollow
          res = await apiServices.unfollow(_item.user?.id);
        } else {
          // follow
          res = await apiServices.follow(_item.user?.id);
        }
        if (res && Utils.isResponseSuccess(res)) {
          // update follow status
          const newFollowStatus = !_item.user.follow_status;
          const videoPosts = [...videos.data];
          videoPosts.forEach(it => {
            if (it.user.id === _item.user.id) {
              it.user.follow_status = newFollowStatus;
            }
            return it;
          });
          setVideos({
            data: videoPosts,
            currentPage: videos.currentPage,
          });
        }
      } catch (error) {}
    } else {
      Alert.alert(t('requireLogin'));
    }
  };

  const viewabilityConfig = {
    waitForInteraction: true,
    itemVisiblePercentThreshold: 75,
  };

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0) {
      setVisibleIndex(viewableItems[0].index);
    }
  });

  const onVideoEnd = useCallback(
    (item, index) => {
      const nextIndex = index + 1;
      if (nextIndex < videos.data.length) {
        flatList.current.scrollToIndex({ animated: true, index: nextIndex });
        setVisibleIndex(nextIndex);
      }
    },
    [videos.data.length],
  );

  const onVideoMutePress = useCallback((item, index, _isMuted) => {
    setMuted(_isMuted);
  }, []);

  const renderPlaceHolderView = () => {
    return <View style={styles.placeholder} />;
  };

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' && <View style={styles.safeAreaCover} />}
      <NavBar
        parentComponentId={componentId}
        title={t('moreVideos')}
        style={styles.navBar}
        iconColor={colors.white}
        titleColor={colors.white}
      />
      <View style={styles.contentView}>
        {renderPlaceHolder ? (
          renderPlaceHolderView()
        ) : (
          <FlatList
            data={videos.data}
            onTouchStart={e => (touchX.current = e.nativeEvent.pageX)}
            onTouchEnd={e => {
              if (e.nativeEvent.pageX - touchX.current > 200) {
                console.log('Swiped left to right');
                navigation.pop();
              }
              touchX.current = 0;
            }}
            ref={flatList}
            refreshControl={
              <RefreshControl
                onRefresh={() => {
                  setIsRefreshing(true);
                  onRefresh();
                }}
                refreshing={isRefreshing}
              />
            }
            renderItem={({ item, index }) => (
              <SocialPost
                componentId={componentId}
                item={item}
                style={styles.videoContainer}
                itemColor={colors.white}
                playerState={
                  !playerPaused && Number(visibleVideoIndex) === Number(index)
                    ? SocialPost.PlayerState.PLAY
                    : SocialPost.PlayerState.PAUSE
                }
                isPlayingClip={false}
                resizeMode={'cover'}
                autoplay={Number(item.id) === Number(videoId)}
                videoWidth={item.videoWidth}
                videoHeight={item.videoHeight}
                onVideoEnd={() => onVideoEnd(item, index)}
                isMutedVideo={isMuted}
                onVideoMutePress={_isMuted =>
                  onVideoMutePress(item, index, _isMuted)
                }
                onPressLike={() => onPressLikeVideoPost(item.id)}
                showFollowStatus={true}
                onPressFollow={() => onPressFollow(item)}
                onOpenMenu={() => {
                  showMenuPostSelection({
                    data: isSavedVideo(item.id) ? MENU.unSaveGrids : MENU.grids,
                    onSelectedItem: menuItem => {
                      switch (menuItem.type) {
                        case POST_MENU_TYPE.SAVE:
                          saveVideo(item.id);
                          break;
                        case POST_MENU_TYPE.UNSAVE:
                          unsaveVideo(item.id);
                          break;
                        case POST_MENU_TYPE.SHARE:
                          setTimeout(() => onPressShare(item), 200);
                          break;
                        case POST_MENU_TYPE.REPORT:
                          navigation.push(Screens.Report, {
                            postId: item.id,
                          });
                          break;
                        default:
                          break;
                      }
                    },
                  });
                }}
              />
            )}
            ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
            ListFooterComponent={() => <View style={styles.listFooter} />}
            keyExtractor={(item, index) => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            onEndReachedThreshold={0}
            onEndReached={handleLoadMore}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged.current}
          />
        )}
      </View>
      {renderPlaceHolder ? (
        <LoadingView loading={renderPlaceHolder} fullscreen />
      ) : null}
    </View>
  );
};

VideoList.options = {
  layout: {
    componentBackgroundColor: Colors.flatBlack01,
  },
  statusBar: {
    backgroundColor: Colors.black,
    style: 'light',
  },
};

export default VideoList;
