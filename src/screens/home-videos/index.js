import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
  Platform,
  RefreshControl,
  Share,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';

import images from '../../assets/images';
import { MENU } from '../../commons/app-data';
import {
  CATEGORY_TYPE,
  ORDER_VALUE,
  POST_MENU_TYPE,
  POST_ORDER_BY,
  RESPONSE_STATUS,
  SEARCH_TYPE,
} from '../../commons/constants';
import { wp } from '../../commons/responsive';
import {
  ImagePost,
  Layout,
  SocialPost,
  Video,
  showMenuPostSelection,
} from '../../components';
import HeaderView from '../../components/header-view';
import StoryView from '../../components/story-view';
import {
  useComponentDidAppearListener,
  useComponentDidDisappearListener,
  useNavigation,
} from '../../hooks';
import Category from '../../models/category';
import PostModel from '../../models/post';
import StoryImageItem from '../../models/story-imge';
import VideoPostModel from '../../models/video_post';
import {
  setPassStoryImage,
  setRefreshHomeVideoFlag,
} from '../../redux/store/reducers/bottomTab/action';
import * as appActions from '../../redux/store/reducers/app/action';
import apiServices from '../../services';
import storage from '../../storage';
import colors from '../../theme/colors';
import Screens from '../screens';
import style from './style';
import Utils from '../../commons/utils';

const USE_SCROLLABLE_HEADER = true;
const DISPLAY_SPINNING_LOGO = true;

const HomeVideos = ({ componentId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);
  const passData = useSelector(state => state.bottomTab.passStoryImage);
  const { numberOfUnreadMessage, numberOfUnreadNotify } = useSelector(
    state => state.app.notification,
  );
  const shouldRefresh = useSelector(
    state => state.bottomTab.shouldRefreshHomeVideo,
  );

  const headerRightItems = [
    {
      ionIcon: images.ionicons_search,
      onPress: () => {
        onPressSearch();
      },
    },
    {
      ionIcon: images.ionicons_chat_bubble,
      onPress: () => {
        onPressChat();
      },
      notifyNumber: numberOfUnreadMessage,
    },
    {
      ionIcon: images.ionicons_notification,
      onPress: () => {
        onPressNotify();
      },
      notifyNumber: numberOfUnreadNotify,
    },
    {
      ionIcon: images.ionicons_person,
      onPress: () => onPressMenu(),
    },
  ];

  const showModal = (screens, passProps) => {
    Navigation.showModal({
      stack: {
        children: [
          {
            component: {
              name: screens,
              passProps,
            },
          },
        ],
        options: {
          topBar: {
            visible: false,
          },
          animations: {
            showModal: { enabled: false },
            dismissModal: { enabled: false },
          },
        },
      },
    });
  };

  const onPressChat = () => {
    if (!storage.isLoggedIn()) {
      showModal(Screens.Login);
      return;
    }
    showModal(Screens.ChatList);
    // call to reset unread message
    apiServices
      .resetAmountOfNotificationUnread(0)
      .then(response => {
        if (Utils.isResponseSuccess(response)) {
          dispatch(appActions.changeNumberOfUnreadMessage(0));
        }
      })
      .catch(error =>
        console.log('getAmountOfNotificationUnread - error: ', error),
      );
  };

  const onPressNotify = () => {
    if (!storage.isLoggedIn()) {
      showModal(Screens.Login);
      return;
    }
    showModal(Screens.Notification);
    // call to reset unread notification
    apiServices
      .resetAmountOfNotificationUnread(1)
      .then(response => {
        if (Utils.isResponseSuccess(response)) {
          dispatch(appActions.changeNumberOfUnreadNotify(0));
        }
      })
      .catch(error =>
        console.log('getAmountOfNotificationUnread - error: ', error),
      );
  };

  const onPressSearch = () => {
    showModal(Screens.Search, { type: SEARCH_TYPE.VIDEO });
  };

  const onPressMenu = () => {
    showModal(Screens.Menu, { homeComponentId: componentId });
  };
  const [headerOpacity, setHeaderOpacity] = useState(0);
  const scrollY = new Animated.Value(-wp(44));
  const translateY = Animated.diffClamp(scrollY, 0, wp(44)).interpolate({
    inputRange: [0, wp(44)],
    outputRange: [0, -wp(44)],
  });
  const animatedHeight = Animated.diffClamp(scrollY, 0, wp(44)).interpolate({
    inputRange: [0, wp(44)],
    outputRange: [wp(44), 0],
  });

  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [storyList, setStoryList] = useState([]);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [arrangedPosts, setArrangedPost] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState(-1);
  const [playerPaused, setPlayerPaused] = useState(false);

  const pageIndex = useRef(1);
  const scrollViewRef = useRef();
  const videoPosts = useRef([]);
  const imagePosts = useRef([]);
  const isFetching = useRef(false);
  const _screenVisible = useRef(false);

  const viewDidAppear = e => {
    setPlayerPaused(false);
    _screenVisible.current = true;
    // call to get unread notification
    apiServices
      .getAmountOfNotificationUnread()
      .then(response => {
        console.log('getAmountOfNotificationUnread', response.data);
        if (Utils.isResponseSuccess(response)) {
          const { message_unread, notification_unread } = response.data.data;
          dispatch(
            appActions.changeNotificationUnreadNumber(
              message_unread,
              notification_unread,
            ),
          );
        }
      })
      .catch(error =>
        console.log('getAmountOfNotificationUnread - error: ', error),
      );
  };

  const viewDidDisappear = e => {
    setPlayerPaused(true);
    _screenVisible.current = false;
  };
  useComponentDidAppearListener(viewDidAppear, componentId);
  useComponentDidDisappearListener(viewDidDisappear, componentId);

  // listener
  useEffect(() => {
    const tabPressedListener =
      Navigation.events().registerBottomTabPressedListener(e => {
        if (e.tabIndex === 1) {
          if (_screenVisible.current) {
            scrollViewRef?.current?.scrollToOffset({
              animated: true,
              offset: 0,
            });
          }
        }
      });
    return () => {
      if (tabPressedListener) {
        tabPressedListener.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // force refresh
  useEffect(() => {
    if (shouldRefresh === true) {
      onRefresh();
      dispatch(setRefreshHomeVideoFlag(false));
    }
  }, [dispatch, onRefresh, shouldRefresh]);

  const initializeArragePost = useCallback(() => {
    let _arrangePosts = [];
    let _videoPosts = [...videoPosts.current];
    if (_videoPosts.length > 0) {
      const ftVideo = videoPosts.current[0];
      setFeaturedVideo(ftVideo);
      if (playingVideoId === -1) {
        setPlayingVideoId(ftVideo.id);
      }
      _videoPosts.splice(0, 1);
      _arrangePosts.push(ftVideo);
    }

    let _imagePosts = [...imagePosts.current];
    while (_imagePosts.length > 0 || _videoPosts.length > 0) {
      for (let i = 0; i < 5; i++) {
        if (_videoPosts.length > 0) {
          _arrangePosts.push(_videoPosts[0]);
          _videoPosts.splice(0, 1);
        } else {
          break;
        }
      }
      if (_imagePosts.length > 0) {
        _arrangePosts.push(_imagePosts.splice(0, 10));
      }
    }
    setArrangedPost(_arrangePosts);
  }, [playingVideoId]);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategoryId]);

  // useEffect(() => {
  //   onRefresh();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  useEffect(() => {
    if (passData) {
      Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabIndex: 3,
        },
      });
    }
  }, [componentId, passData]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPlayingVideoId(-1);
    isFetching.current = true;
    pageIndex.current = 1;
    videoPosts.current = [];
    imagePosts.current = [];
    console.log('###onRefresh at page: ', pageIndex.current);
    Promise.all([
      fetchCategories(),
      fetchStoryList(),
      fetchVideoPosts(),
      fetchImagePosts(),
    ])
      .then(() => {
        initializeArragePost();
        setIsRefreshing(false);
        isFetching.current = false;
      })
      .catch(() => {
        setIsRefreshing(false);
        isFetching.current = false;
      });
  }, [fetchCategories, fetchImagePosts, fetchVideoPosts, initializeArragePost]);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await apiServices.getCategories({
        type: CATEGORY_TYPE.VIDEO,
        id_parent: selectedCategoryId || 0,
      });
      const result = response.data;
      if (result.status === RESPONSE_STATUS.OK && result.data) {
        setCategories(result.data.map(obj => Category.clone(obj)));
      }
    } catch (error) {
      console.log('fetchCategories - error: ', error);
    }
  }, [selectedCategoryId]);

  const fetchStoryList = async () => {
    try {
      const response = await apiServices.getImageStories({
        order_by: 'created_at',
        order: ORDER_VALUE.DESC,
        story_per_page: 40,
        page: 1,
      });
      const result = response.data;
      if (
        result.status === RESPONSE_STATUS.OK &&
        result.data &&
        !_.isEmpty(result.data)
      ) {
        var arr = result.data.map(obj => {
          return { ...StoryImageItem.clone(obj), userId: obj.user.id };
        });
        setStoryList(_.uniqBy(arr, 'userId').slice(0, 20));
      }
    } catch (error) {
      console.log('fetchStoryList - error: ', error);
    }
  };

  const fetchImagePosts = useCallback(async () => {
    try {
      const response = await apiServices.getPosts({
        order_by: POST_ORDER_BY.DATE,
        order: ORDER_VALUE.DESC,
        page: 1,
        post_per_page: 50,
        ...(selectedCategoryId > 0 ? { id_category: selectedCategoryId } : {}),
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        imagePosts.current = response.data.data.map(p => PostModel.clone(p));
      }
    } catch (error) {
      console.log('fetchImagePosts - error: ', JSON.stringify(error));
    }
  }, [selectedCategoryId]);

  const fetchVideoPosts = useCallback(async () => {
    console.log('###fetchVideoPosts at page: ', pageIndex.current);
    try {
      isFetching.current = true;
      let params = {
        order_by: POST_ORDER_BY.DATE,
        order: ORDER_VALUE.DESC,
        page: pageIndex.current,
        ...(selectedCategoryId > 0 ? { id_category: selectedCategoryId } : {}),
      };
      const response = await apiServices.getVideos({
        ...params,
        post_per_page: 10 * 5 + 1,
      });
      if (
        response.data.status === RESPONSE_STATUS.OK &&
        !_.isEmpty(response.data.posts)
      ) {
        let _videoPosts = response.data.posts.map(p => VideoPostModel.clone(p));
        // append to arrange post
        if (pageIndex.current > 1) {
          videoPosts.current = videoPosts.current.concat([..._videoPosts]);
          setArrangedPost(arrangedPosts.concat(_videoPosts));
        } else {
          videoPosts.current = [..._videoPosts];
        }
        pageIndex.current += 1;
      } else {
        pageIndex.current = -1;
        setArrangedPost([...arrangedPosts]);
      }
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      isFetching.current = false;
    }
  }, [arrangedPosts, selectedCategoryId]);

  const onSelectCategory = categoyId => {
    if (selectedCategoryId !== categoyId) {
      setSelectedCategoryId(categoyId);
    } else {
      setSelectedCategoryId(0);
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
        console.log('share error: ', error);
      }
    } else {
      Alert.alert(t('alertLogin'));
    }
  };

  const onPressSaveVideoPost = async postId => {
    const _videoPosts = [...videoPosts.current];
    const postIndex = _videoPosts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      try {
        if (_videoPosts[postIndex].saved === 1) {
          const response = await apiServices.unsaveVideo(
            _videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            _videoPosts[postIndex].saved = 0;
          } else {
            console.log('UNSAVE ERROR');
          }
        } else {
          const response = await apiServices.saveVideo(
            _videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            _videoPosts[postIndex].saved = 1;
          } else {
            console.log('UNSAVE ERROR');
          }
        }
        videoPosts.current = _videoPosts;
        initializeArragePost();
      } catch (error) {
        console.log('SAVE/UNSAVE ERROR: ', error);
      }
    }
  };

  const onPressLikeVideoPost = async postId => {
    const _videoPosts = [...videoPosts.current];
    const postIndex = _videoPosts.findIndex(p => p.id === postId);
    if (postIndex >= 0) {
      try {
        if (_videoPosts[postIndex].liked) {
          const response = await apiServices.unlikeVideo(
            _videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            _videoPosts[postIndex].liked = false;
            _videoPosts[postIndex].likes =
              _videoPosts[postIndex].likes - 1 >= 0
                ? _videoPosts[postIndex].likes - 1
                : 0;
          } else {
            console.log('UNLIKE ERROR');
          }
        } else {
          const response = await apiServices.likeVideo(
            _videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            _videoPosts[postIndex].liked = true;
            _videoPosts[postIndex].likes = _videoPosts[postIndex].likes + 1;
          } else {
            console.log('UNLIKE ERROR');
          }
        }
        videoPosts.current = _videoPosts;
        initializeArragePost();
      } catch (error) {
        console.log('LIKE/UNLIKE ERROR: ', error);
      }
    }
  };

  const viewabilityConfig = {
    waitForInteraction: true,
    itemVisiblePercentThreshold: 75,
  };

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0) {
      if (viewableItems[0].item && !_.isArray(viewableItems[0].item)) {
        setPlayingVideoId(viewableItems[0].item.id);
      }
    }
  });

  const onPressVideoItem = item => {
    navigation.push(Screens.VideoList, {
      videoId: item.id,
    });
  };

  const renderHeaders = () => {
    return (
      <View>
        {/* Fixed header bar */}
        <HeaderView
          rightItems={headerRightItems}
          showLogo
          spinningLogo={DISPLAY_SPINNING_LOGO}
        />

        {/* Category list */}
        <FlatList
          style={style.categoryList}
          horizontal
          data={categories}
          renderItem={({ item, index }) => (
            <TouchableOpacity onPress={() => onSelectCategory(item.id)}>
              <ImageBackground
                source={{ uri: item.icon || '' }}
                style={
                  selectedCategoryId === item.id
                    ? style.categoryItemHighlight
                    : style.categoryItem
                }
                imageStyle={{ resizeMode: 'cover' }}
                key={index.toString}>
                <Text
                  style={[
                    style.categoryText,
                    selectedCategoryId === item.id
                      ? { color: colors.primary }
                      : {},
                  ]}>
                  {item.name.toUpperCase()}
                </Text>
              </ImageBackground>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={{ width: 6 }} />}
          ListHeaderComponent={() => <View style={{ width: 10 }} />}
          ListFooterComponent={() => <View style={{ width: 10 }} />}
          keyExtractor={(_, index) => 'key' + index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  };

  const renderFeaturedAndStories = () => {
    return (
      <View>
        {/* Featured video */}
        {featuredVideo && (
          <View>
            <Video
              style={[
                style.featuredVideo,
                {
                  aspectRatio:
                    featuredVideo.videoWidth &&
                    featuredVideo.videoHeight &&
                    featuredVideo.videoWidth / featuredVideo.videoHeight,
                },
              ]}
              videoUrl={Utils.getClipUrl(featuredVideo)}
              thumnailUrl={featuredVideo.icon}
              resizeMode={'cover'}
              videoWidth={featuredVideo.videoWidth}
              videoHeight={featuredVideo.videoHeight}
              autoplay
              playerState={
                !playerPaused &&
                Number(playingVideoId) === Number(featuredVideo.id)
                  ? SocialPost.PlayerState.PLAY
                  : SocialPost.PlayerState.PAUSE
              }
            />
            <TouchableOpacity
              style={style.videoMask}
              onPress={() => onPressVideoItem(featuredVideo)}>
              <></>
            </TouchableOpacity>
          </View>
        )}
        {/* Story list */}
        {storyList.length > 0 && (
          <View style={style.stories_container}>
            <FlatList
              contentContainerStyle={{
                alignItems: 'center',
              }}
              data={storyList}
              renderItem={({ item, index }) => (
                <View key={index.toString}>
                  <StoryView
                    componentId={componentId}
                    style={style.story}
                    post={item}
                    onPress={() => {
                      dispatch(setPassStoryImage(item));
                    }}
                  />
                </View>
              )}
              ItemSeparatorComponent={() => <View style={style.separator} />}
              ListHeaderComponent={() => <View style={style.separator} />}
              ListFooterComponent={() => <View style={style.separator} />}
              keyExtractor={(item, index) => 'key' + index.toString()}
              showsHorizontalScrollIndicator={false}
              horizontal
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <Layout style={style.container}>
      {Platform.OS === 'ios' && <View style={style.safeAreaCover} />}

      {/* Header bar on scroll */}

      {USE_SCROLLABLE_HEADER && headerOpacity > 0 && (
        <Animated.View
          style={[
            {
              transform: [{ translateY: translateY }],
              opacity: headerOpacity,
            },
            style.animatedNavBar,
            Platform.OS === 'android'
              ? { ...style.positionAbsolute, height: animatedHeight }
              : {},
          ]}>
          <HeaderView
            style={style.positionAbsolute}
            rightItems={headerRightItems}
            showLogo
            spinningLogo={DISPLAY_SPINNING_LOGO}
          />
        </Animated.View>
      )}

      {/* Post list */}
      <Animated.FlatList
        data={arrangedPosts}
        ref={scrollViewRef}
        bounces={true}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: false,
            listener: e => {
              if (USE_SCROLLABLE_HEADER) {
                if (
                  e.nativeEvent.contentOffset.y < wp(44) &&
                  headerOpacity !== 0
                ) {
                  setHeaderOpacity(0);
                } else if (
                  e.nativeEvent.contentOffset.y > wp(44) &&
                  headerOpacity === 0
                ) {
                  setHeaderOpacity(1);
                }
              }
            },
          },
        )}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              setIsRefreshing(true);
              onRefresh();
            }}
            refreshing={isRefreshing}
          />
        }
        renderItem={({ item, index }) =>
          index === 0 ? (
            renderFeaturedAndStories()
          ) : !_.isArray(item) ? (
            <SocialPost
              componentId={componentId}
              item={item}
              style={style.socialPostItem}
              onPressLike={() => onPressLikeVideoPost(item.id)}
              playerState={
                !playerPaused && Number(playingVideoId) === Number(item.id)
                  ? SocialPost.PlayerState.PLAY
                  : SocialPost.PlayerState.PAUSE
              }
              onPressItem={() => {
                onPressVideoItem(item);
              }}
              onPressVideo={() => {
                onPressVideoItem(item);
              }}
              isPlayingClip={true}
              videoWidth={item.videoWidth}
              videoHeight={item.videoHeight}
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
          ) : (
            <View style={style.imagePostsContainer}>
              <FlatList
                contentContainerStyle={{
                  alignItems: 'center',
                }}
                data={item}
                renderItem={({ item: postItem }) => (
                  <View
                    key={postItem.id}
                    style={{
                      width: Dimensions.get('window').width / 2,
                    }}>
                    <ImagePost
                      item={postItem}
                      onPressItem={() =>
                        navigation.showModal(Screens.PostDetail, {
                          postInfo: postItem,
                        })
                      }
                    />
                  </View>
                )}
                keyExtractor={(item, index) => 'key-2-' + index.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal
              />
            </View>
          )
        }
        ListHeaderComponent={() => renderHeaders()}
        ListFooterComponent={() =>
          pageIndex.current > 0 && isFetching.current && !isRefreshing ? (
            <View style={style.progressIndicatorContainer}>
              <Progress.Circle
                size={30}
                indeterminate={true}
                color={'gray'}
                borderWidth={1.5}
              />
            </View>
          ) : null
        }
        ItemSeparatorComponent={() => <View style={style.videoSeparator} />}
        keyExtractor={(item, index) => 'key' + index.toString()}
        onEndReachedThreshold={1}
        onEndReached={() => {
          if (pageIndex.current > 1 && !isFetching.current) {
            fetchVideoPosts();
          }
        }}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
    </Layout>
  );
};

export default HomeVideos;
