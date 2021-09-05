import _ from 'lodash';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Alert,
  Animated,
  Dimensions,
  FlatList,
  Platform,
  RefreshControl,
  Share,
  Text,
  Toast,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Navigation } from 'react-native-navigation';
import * as Progress from 'react-native-progress';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useDispatch, useSelector } from 'react-redux';

import images from '../../assets/images';
import { MENU } from '../../commons/app-data';
import {
  CATEGORY_TYPE,
  CREATE_POST_IDS,
  NOTIFICATION_RECEIVER_TYPE,
  NOTIFICATION_TYPE,
  ORDER_VALUE,
  POST_MENU_TYPE,
  POST_ORDER_BY,
  RESPONSE_STATUS,
  SEARCH_TYPE,
} from '../../commons/constants';
import { checkAndResizeImage } from '../../commons/image-picker-helper';
import { wp } from '../../commons/responsive';
import { flexRow, pdV } from '../../commons/styles';
import Utils from '../../commons/utils';
import {
  ImagePost,
  Layout,
  SocialPost,
  Video,
  showCategorySelectionView,
  showCreatePostSelection,
  showFilterSelectionView,
  showLocationSelectionView,
  showMenuPostSelection,
} from '../../components';
import MultipleImagePicker from '@baronha/react-native-multiple-image-picker';
import HeaderView from '../../components/header-view';
import {
  useComponentDidAppearListener,
  useComponentDidDisappearListener,
  useNavigation,
} from '../../hooks';
import Category from '../../models/category';
import PostModel from '../../models/post';
import VideoPostModel from '../../models/video_post';
import {
  setRefreshHomeFlag,
  switchToTabIndex,
  setPassStoryImage,
  setPassStoryVideo,
} from '../../redux/store/reducers/bottomTab/action';
import * as appActions from '../../redux/store/reducers/app/action';
import Screens from '../../screens/screens';
import apiServices from '../../services';
import storage from '../../storage';
import colors from '../../theme/colors';
import style from './style';
import StoryImageItem from '../../models/story-imge';
import StoryVideoItem from '../../models/video-story';

const USE_SCROLLABLE_HEADER = true;
const DISPLAY_SPINNING_LOGO = true;

const Home = ({ componentId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);
  const shouldRefresh = useSelector(state => state.bottomTab.shouldRefreshHome);
  const newTabIndex = useSelector(state => state.bottomTab.switchToTabIndex);
  const { numberOfUnreadMessage, numberOfUnreadNotify, openedNotification } =
    useSelector(state => state.app.notification);
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
  const [arrangedPosts, setArrangedPost] = useState([]);
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterCategory, setFilterCategory] = useState(null);
  const [otherFilters, setOtherFilters] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [playerPaused, setPlayerPaused] = useState(false);
  const [featuredVideo, setFeaturedVideo] = useState(null);
  const [playingVideoId, setPlayingVideoId] = useState(-1);
  const featuredVideoPlayer = useRef(null);

  const pageIndex = useRef(-1);
  const scrollViewRef = useRef();
  const videoPosts = useRef([]);
  const imagePosts = useRef([]);
  const isFetching = useRef(false);
  const _screenVisible = useRef(false);

  const viewDidAppear = e => {
    console.log('viewDidAppear');
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

  useEffect(() => {
    if (openedNotification) {
      // check to open a screen
      checkOpenedNotificationToOpenScreen(openedNotification);
      // reset opened notification
      dispatch(appActions.changeOpenedNotification(null));
    }
  }, [checkOpenedNotificationToOpenScreen, dispatch, openedNotification]);

  const onOpenVideoPostPicker = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'video',
        usedCameraButton: true,
        allowedVideoRecording: true,
        allowedPhotograph: false,
        allowedVideo: true,
        singleSelectedMode: true,
        selectedAssets: [],
        maxVideoDuration: 10000,
      });
      console.log('###video data', response);
      if (response && response.length > 0) {
        const videoFile = response[0];
        if (Utils.isAndroid()) {
          videoFile.duration = videoFile.duration / 1000;
          videoFile.path = videoFile.realPath.startsWith('file://')
            ? videoFile.realPath
            : `file://${videoFile.realPath}`;
          videoFile.filename = videoFile.fileName;
        }
        setTimeout(() => {
          const maxDuration = 20; // 20 minutes
          if (videoFile.duration > maxDuration * 60) {
            Alert.alert(
              t('video_over_limit_duration', { duration: maxDuration }),
            );
          } else {
            showModal(Screens.CreateVideoPost, {
              videoFile,
              onCreateSuccess: () => {
                Navigation.mergeOptions(componentId, {
                  bottomTabs: {
                    currentTabIndex: 1,
                  },
                });
              },
            });
          }
        }, 1000);
      }
    } catch (e) {
      console.log('###onOpenVideoPostPicker - error: ', e);
    }
  };

  const onOpenImageStoryPicker = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'image',
        selectedAssets: [],
        isPreview: false,
        maxSelectedAssets: 50,
      });
      const resizeRequests = response.map(res => {
        if (Utils.isAndroid()) {
          res.path = res.realPath;
          res.filename = res.fileName;
        }
        return checkAndResizeImage(res);
      });
      const resizeImages = await Promise.all(resizeRequests);
      setTimeout(() => {
        showModal(Screens.CreateImageStory, {
          imageFiles: resizeImages,
          onCreateSuccess: () => {
            Navigation.mergeOptions(componentId, {
              bottomTabs: {
                currentTabIndex: 3,
              },
            });
          },
        });
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  };

  const onOpenVideoStoryPicker = async () => {
    try {
      const response = await MultipleImagePicker.openPicker({
        mediaType: 'video',
        usedCameraButton: true,
        allowedVideoRecording: true,
        allowedPhotograph: false,
        allowedVideo: true,
        singleSelectedMode: true,
        selectedAssets: [],
        maxVideoDuration: 10000,
      });
      console.log('###onOpenVideoStoryPicker - response: ', response);
      if (response && response.length > 0) {
        const videoFile = response[0];
        if (Utils.isAndroid()) {
          videoFile.duration = videoFile.duration / 1000;
          videoFile.path = videoFile.realPath.startsWith('file://')
            ? videoFile.realPath
            : `file://${videoFile.realPath}`;
          videoFile.filename = videoFile.fileName;
        }
        const size = videoFile.size / 1000000;
        setTimeout(() => {
          if (size > 100) {
            Alert.alert(t('video_over_limit_size'));
          } else {
            const maxDuration = 25; // seconds
            if (videoFile.duration <= maxDuration) {
              showModal(Screens.CreateVideoStory, {
                videoFile,
                onCreateSuccess: () => {
                  Navigation.mergeOptions(componentId, {
                    bottomTabs: {
                      currentTabIndex: 4,
                    },
                  });
                },
              });
            } else {
              showModal(Screens.TrimmerView, {
                videoFile,
                maxDuration: maxDuration,
                onCreateSuccess: () => {
                  Navigation.mergeOptions(componentId, {
                    bottomTabs: {
                      currentTabIndex: 4,
                    },
                  });
                },
              });
            }
          }
        }, 1000);
      }
    } catch (e) {
      console.log(e);
    }
  };

  // listener
  useEffect(() => {
    const tabPressedListener =
      Navigation.events().registerBottomTabPressedListener(e => {
        if (e.tabIndex === 2) {
          if (storage.isLoggedIn()) {
            showCreatePostSelection({
              onSelectedItem: item => {
                if (item.id === CREATE_POST_IDS.VIDEO_POST) {
                  setTimeout(() => onOpenVideoPostPicker(), 500);
                } else if (item.id === CREATE_POST_IDS.IMAGE_POST) {
                  showModal(Screens.CreateImagePost, {
                    onCreateSuccess: () => {
                      Navigation.mergeOptions(componentId, {
                        bottomTabs: {
                          currentTabIndex: 0,
                        },
                      });
                    },
                  });
                } else if (item.id === CREATE_POST_IDS.IMAGE_STORY) {
                  setTimeout(() => onOpenImageStoryPicker(), 500);
                } else if (item.id === CREATE_POST_IDS.VIDEO_STORY) {
                  setTimeout(() => onOpenVideoStoryPicker(), 500);
                }
              },
            });
          } else {
            showModal(Screens.Login);
          }
        } else if (e.tabIndex === 0) {
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
      console.log('###onRefresh - force refresh');
      onRefresh();
      dispatch(setRefreshHomeFlag(false));
    }
  }, [dispatch, onRefresh, shouldRefresh]);

  // switch tab
  useEffect(() => {
    if (newTabIndex !== null) {
      Navigation.mergeOptions(componentId, {
        bottomTabs: {
          currentTabIndex: newTabIndex,
        },
      });
      // reset index to null
      dispatch(switchToTabIndex(null));
    }
  }, [componentId, dispatch, newTabIndex]);

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
      for (let i = 1; i <= 9; i++) {
        if (_imagePosts.length > 0) {
          _arrangePosts.push(_imagePosts.splice(0, 2));
        } else {
          break;
        }
      }
      if (_videoPosts.length > 0) {
        _arrangePosts.push(_videoPosts.splice(0, 10));
      }
    }
    setArrangedPost(_arrangePosts);
  }, [playingVideoId]);

  useEffect(() => {
    console.log(
      '###onRefresh1 - filter changed: ',
      filterLocation,
      otherFilters,
      filterCategory,
    );
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLocation, otherFilters, filterCategory]);

  const checkOpenedNotificationToOpenScreen = useCallback(
    async data => {
      if (data) {
        try {
          // mark it as viewed
          if (!data.is_viewed && data.id) {
            const resViewed = await apiServices.markNotificationIsViewed(
              data.id,
            );
            console.log('###markNotificationIsViewed: ', resViewed);
          }
          // go to target screen
          if (data.type === NOTIFICATION_TYPE.CHAT_MESSAGE) {
            // go to chat detail screen
            const { conversation } = data;
            if (conversation && !_.isEmpty(conversation)) {
              const ids = conversation.split('-');
              if (ids && ids.length === 3) {
                showModal(Screens.ChatDetail, {
                  buyerId: Number(ids[0]),
                  sellerId: Number(ids[1]),
                  postId: Number(ids[2]),
                  isModal: true,
                });
              }
            }
          } else {
            switch (data.type_noti) {
              case NOTIFICATION_RECEIVER_TYPE.POST:
                if (data.id_post_or_story) {
                  showModal(Screens.PostDetail, {
                    postInfo: { id: data.id_post_or_story },
                  });
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.COMMENT_POST:
                if (data.id_post_or_story) {
                  showModal(Screens.PostDetail, {
                    postInfo: { id: data.id_post_or_story },
                  });
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.VIDEO:
                if (data.id_post_or_story) {
                  navigation.push(Screens.VideoList, {
                    videoId: data.id_post_or_story,
                  });
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.COMMENT_VIDEO:
                if (data.id_post_or_story) {
                  navigation.push(Screens.VideoList, {
                    videoId: data.id_post_or_story,
                  });
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.IMAGE_STORY:
                if (data.id_post_or_story) {
                  const res = await apiServices.getImageStoryById({
                    id: data.id_post_or_story,
                  });
                  if (Utils.isResponseSuccess(res)) {
                    dispatch(switchToTabIndex(3));
                    dispatch(
                      setPassStoryImage(StoryImageItem.clone(res.data.data)),
                    );
                    Navigation.dismissAllModals();
                  }
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.COMMENT_IMAGE_STORY:
                if (data.id_post_or_story) {
                  const res = await apiServices.getImageStoryById({
                    id: data.id_post_or_story,
                  });
                  if (Utils.isResponseSuccess(res)) {
                    dispatch(switchToTabIndex(3));
                    dispatch(
                      setPassStoryImage(StoryImageItem.clone(res.data.data)),
                    );
                    Navigation.dismissAllModals();
                  }
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.VIDEO_STORY:
                if (data.id_post_or_story) {
                  const res = await apiServices.getVideoStoryById({
                    id: data.id_post_or_story,
                  });
                  if (Utils.isResponseSuccess(res)) {
                    dispatch(switchToTabIndex(4));
                    dispatch(
                      setPassStoryVideo(StoryVideoItem.clone(res.data.data)),
                    );
                    Navigation.dismissAllModals();
                  }
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.COMMENT_VIDEO_STORY:
                if (data.id_post_or_story) {
                  const res = await apiServices.getVideoStoryById({
                    id: data.id_post_or_story,
                  });
                  if (Utils.isResponseSuccess(res)) {
                    dispatch(switchToTabIndex(4));
                    dispatch(
                      setPassStoryVideo(StoryVideoItem.clone(res.data.data)),
                    );
                    Navigation.dismissAllModals();
                  }
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.CHAT:
                if (data.user_create_post && data.id_post_or_story) {
                  const seller = data.user_create_post;
                  let buyerId;
                  if (data.id !== seller.id) {
                    // I'm not a seller
                    buyerId = data.id;
                  } else if (data.user_sent && data.id !== data.user_sent.id) {
                    // I'm a seller
                    buyerId = data.user_sent.id;
                  }
                  if (buyerId) {
                    navigation.push(Screens.ChatDetail, {
                      postId: data.id_post_or_story,
                      buyerId: buyerId,
                      sellerId: seller.id,
                    });
                  }
                }
                break;
              case NOTIFICATION_RECEIVER_TYPE.ADMIN:
                break;
              default:
                break;
            }
          }
        } catch (error) {
          console.log('Error: markNotificationIsViewed ', error);
        }
      }
    },
    [dispatch, navigation, showModal],
  );

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setPlayingVideoId(-1);
    isFetching.current = true;
    pageIndex.current = 1;
    videoPosts.current = [];
    imagePosts.current = [];
    Promise.all([fetchCategories(), fetchVideoPosts(), fetchImagePosts()])
      .then(() => {
        initializeArragePost();
        setIsRefreshing(false);
        isFetching.current = false;
      })
      .catch(() => {
        setIsRefreshing(false);
        isFetching.current = false;
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLocation, otherFilters, filterCategory]);

  const fetchCategories = useCallback(async () => {
    console.log('###fetchCategories - filterCategory: ', filterCategory);
    try {
      const response = await apiServices.getCategories({
        type: CATEGORY_TYPE.POST,
        id_parent: filterCategory?.id || 0,
      });
      const result = response.data;
      if (result.status === RESPONSE_STATUS.OK && result.data) {
        setCategories(result.data.map(obj => Category.clone(obj)));
      }
    } catch (error) {}
  }, [filterCategory]);

  const fetchVideoPosts = useCallback(async () => {
    try {
      const response = await apiServices.getVideos({
        order_by: POST_ORDER_BY.DATE,
        order: ORDER_VALUE.DESC,
        page: 1,
        post_per_page: 51,
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        videoPosts.current = response.data.posts.map(p =>
          VideoPostModel.clone(p),
        );
      }
    } catch (error) {
      console.log('fetchVideoPosts - error: ', JSON.stringify(error));
    }
  }, []);

  const fetchImagePosts = useCallback(async () => {
    console.log('###fetchImagePosts at page: ', pageIndex.current);
    try {
      isFetching.current = true;
      let params = {
        order_by: POST_ORDER_BY.DATE,
        order: ORDER_VALUE.DESC,
        page: pageIndex.current,
      };
      if (filterLocation && filterLocation.id) {
        params.location = filterLocation.id;
      }
      if (filterCategory !== null && filterCategory.id !== null) {
        params.id_category = filterCategory.id;
      }
      if (otherFilters) {
        params.filters = JSON.stringify(
          otherFilters.map(f => {
            return {
              id: f.id,
              slug: f.slug,
              value: _.isArray(f.value) ? f.value.join(',') : f.value,
            };
          }),
        );
      }
      const response = await apiServices.getPosts({
        ...params,
        post_per_page: 18 * 5,
      });
      if (
        response.data.status === RESPONSE_STATUS.OK &&
        !_.isEmpty(response.data.data)
      ) {
        let _imagePosts = response.data.data.map(p => PostModel.clone(p));
        // append to arrange post
        if (pageIndex.current > 1) {
          imagePosts.current = imagePosts.current.concat([..._imagePosts]);
          while (_imagePosts.length > 0) {
            for (let i = 1; i <= 9; i++) {
              if (_imagePosts.length > 0) {
                arrangedPosts.push(_imagePosts.splice(0, 2));
              } else {
                break;
              }
            }
          }
          setArrangedPost(arrangedPosts);
        } else {
          imagePosts.current = [..._imagePosts];
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
  }, [arrangedPosts, filterCategory, filterLocation, otherFilters]);

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

  const onPressMenu = useCallback(() => {
    showModal(Screens.Menu, { homeComponentId: componentId });
  }, [componentId, showModal]);

  const onPressFilter = () => {
    console.log('###filterCategory: ', filterCategory);
    if (filterCategory && filterCategory.id) {
      showFilterSelectionView({
        category: filterCategory,
        filters: otherFilters,
        onApply: filters => {
          setOtherFilters(filters);
        },
      });
    } else {
      Alert.alert(t('error'), t('pleaseSelectCategory'));
    }
  };

  const onPressFilterCategory = () => {
    showCategorySelectionView({
      onSelectedCategory: category => {
        setFilterCategory(category);
        setOtherFilters([]);
      },
    });
  };

  const onSelectCategory = category => {
    navigation.push(Screens.PostsByCategory, { category });
  };

  const onPressFilterLocation = () => {
    showLocationSelectionView({
      onSelectedItem: location => {
        setFilterLocation(location);
      },
    });
  };

  const showModal = useCallback(
    (screens, passProps) => {
      navigation.showModal(screens, passProps);
    },
    [navigation],
  );

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

  const onPressSearch = () => {
    showModal(Screens.Search, { type: SEARCH_TYPE.POST });
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

  const renderCategoryItem = c => {
    return (
      <TouchableOpacity
        style={style.categoryItemContainer}
        onPress={() => onSelectCategory(c)}>
        <FastImage
          style={style.categoryThumb}
          source={{
            uri: c.icon || '',
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={style.categoryName} numberOfLines={2} ellipsizeMode="clip">
          {c.name || ''}
        </Text>
      </TouchableOpacity>
    );
  };

  const viewabilityConfig = {
    waitForInteraction: true,
    itemVisiblePercentThreshold: 75,
  };

  const onViewableItemsChanged = useRef(({ viewableItems, changed }) => {
    if (viewableItems && viewableItems.length > 0) {
      if (viewableItems[0].item && !_.isArray(viewableItems[0].item)) {
        setPlayingVideoId(viewableItems[0].item.id);
      } else {
        setPlayingVideoId(-1);
      }
    }
  });

  const renderListViewHeaderItem = () => {
    return (
      <>
        {/* Fixed header bar */}
        <HeaderView
          rightItems={headerRightItems}
          showLogo
          spinningLogo={DISPLAY_SPINNING_LOGO}
        />

        {/* Latest video post */}
        {featuredVideo && (
          <View>
            <Video
              ref={ref => (featuredVideoPlayer.current = ref)}
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
              onPress={() =>
                navigation.push(Screens.VideoList, {
                  videoId: featuredVideo.id,
                })
              }
            />
          </View>
        )}
        {/* Filter bar */}
        <View style={style.filterBar}>
          <TouchableOpacity
            style={style.filterButton}
            onPress={onPressFilterLocation}>
            <Text numberOfLines={1} style={style.filterText}>
              {filterLocation ? filterLocation.name : t('filterAllLocation')}
            </Text>
            <Ionicons
              style={style.filterIcon}
              name={images.ionicons_caret_down}
              size={12}
              color={colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onPressFilterCategory}
            style={[style.filterButton]}>
            <Text numberOfLines={1} style={style.filterText}>
              {filterCategory ? filterCategory.name : t('filterAllCategory')}
            </Text>
            <Ionicons
              style={style.filterIcon}
              name={images.ionicons_caret_down}
              size={12}
              color={colors.black}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[style.filterButton, { flex: 0.4 }]}
            onPress={onPressFilter}>
            <Text>{t('filterType')}</Text>
            <Ionicons
              name={images.ionicons_caret_down}
              size={12}
              color={colors.black}
            />
          </TouchableOpacity>
        </View>
        {/* Category list */}
        <View
          style={{
            ...pdV(10),
            borderBottomWidth: 1,
            borderColor: colors.lightFlatGrey,
          }}>
          <FlatList
            contentContainerStyle={{}}
            data={categories}
            renderItem={({ item, index }) => (
              <View key={item.id}>{renderCategoryItem(item)}</View>
            )}
            ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
            ListHeaderComponent={() => <View style={{ width: 10 }} />}
            ListFooterComponent={() => <View style={{ width: 10 }} />}
            keyExtractor={(item, index) => 'key' + item.id}
            showsHorizontalScrollIndicator={false}
            horizontal
          />
        </View>
      </>
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
            style={[style.positionAbsolute]}
            rightItems={headerRightItems}
            showLogo
            spinningLogo={DISPLAY_SPINNING_LOGO}
          />
        </Animated.View>
      )}

      {/* FlatList */}

      <Animated.FlatList
        ref={scrollViewRef}
        data={arrangedPosts}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          {
            useNativeDriver: Platform.OS === 'ios',
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
            renderListViewHeaderItem()
          ) : item[0].type === 'post' ? (
            <View style={flexRow}>
              {item.map(post => (
                <View
                  key={post.id}
                  style={{
                    width: Dimensions.get('window').width / 2,
                  }}>
                  <ImagePost
                    item={post}
                    onPressItem={() =>
                      showModal(Screens.PostDetail, {
                        postInfo: post,
                      })
                    }
                  />
                </View>
              ))}
            </View>
          ) : (
            <View
              style={{
                width: Dimensions.get('window').width,
                // height: 350,
                // backgroundColor: 'red'
                marginBottom: wp(10),
              }}>
              <FlatList
                contentContainerStyle={
                  {
                    // alignItems: 'center',
                  }
                }
                data={item}
                renderItem={({ item, index }) => (
                  <View key={item.id}>
                    <SocialPost
                      componentId={componentId}
                      item={item}
                      staticPost={true}
                      style={{
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
                          data:
                            item.saved === 0 ? MENU.grids : MENU.unSaveGrids,
                          onSelectedItem: menuItem => {
                            switch (menuItem.type) {
                              case POST_MENU_TYPE.SAVE:
                                setTimeout(
                                  () => onPressSaveVideoPost(item.id),
                                  200,
                                );
                                break;
                              case POST_MENU_TYPE.UNSAVE:
                                setTimeout(
                                  () => onPressSaveVideoPost(item.id),
                                  200,
                                );
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
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
                ListHeaderComponent={() => <View style={{ width: 4 }} />}
                ListFooterComponent={() => <View style={{ width: 4 }} />}
                keyExtractor={(item, index) => 'key-2-' + index.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal
              />
            </View>
          )
        }
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
        keyExtractor={(item, index) => 'key' + index.toString()}
        showsHorizontalScrollIndicator={false}
        onEndReachedThreshold={1}
        onEndReached={() => {
          if (pageIndex.current > 1 && !isFetching.current) {
            fetchImagePosts();
          }
        }}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged.current}
      />
    </Layout>
  );
};

export default Home;
