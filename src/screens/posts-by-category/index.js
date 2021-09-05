import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  useComponentDidAppearListener,
  useComponentDidDisappearListener,
  useNavigation,
} from '../../hooks';
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  Platform,
  Animated,
  FlatList,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import {
  Layout,
  SocialPost,
  ImagePost,
  showLocationSelectionView,
  showCategorySelectionView,
  showFilterSelectionView,
  ScrollToTop,
} from '../../components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import HeaderView from '../../components/header-view';
import * as Progress from 'react-native-progress';

import style from './styles';
import colors from '../../theme/colors';
import images from '../../assets/images';
import { flexRow, pdV } from '../../commons/styles';
import { wp } from '../../commons/responsive';

import Screens from '../../screens/screens';

import apiServices from '../../services';
import {
  CATEGORY_TYPE,
  ORDER_VALUE,
  POST_ORDER_BY,
  RESPONSE_STATUS,
  SEARCH_TYPE,
} from '../../commons/constants';
import Category from '../../models/category';
import storage from '../../storage';
import VideoPostModel from '../../models/video_post';
import PostModel from '../../models/post';
import _ from 'lodash';
import Utils from '../../commons/utils';

const USE_SCROLLABLE_HEADER = true;

const PostsByCategory = ({ componentId, category }) => {
  const headerRightItems = [
    {
      ionIcon: images.ionicons_search,
      onPress: () => {
        onPressSearch();
      },
    },
    {
      ionIcon: images.ionicons_notification,
      onPress: () => {
        onPressNotify();
      },
    },
    {
      ionIcon: images.ionicons_person,
      onPress: () => onPressMenu(),
    },
  ];
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);

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
  const [postData, setPostData] = useState({
    videoPosts: [],
    imagePosts: [],
  });
  const [arrangedPosts, setArrangedPost] = useState([]);
  const [filterLocation, setFilterLocation] = useState(null);
  const [filterCategory, setFilterCategory] = useState(category);
  const [otherFilters, setOtherFilters] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const pageIndex = useRef(1);

  const scrollViewRef = useRef();

  const viewDidAppear = e => {};

  const viewDidDisappear = e => {};
  useComponentDidAppearListener(viewDidAppear, componentId);
  useComponentDidDisappearListener(viewDidDisappear, componentId);

  useEffect(() => {
    onRefresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // if (postData.imagePosts.length > 0 && postData.videoPosts.length > 0) {
    var imagePosts = [...postData.imagePosts];
    var videoPost = [...postData.videoPosts].splice(1);
    var _arrangePosts = [];

    while (imagePosts.length > 0) {
      for (var i = 1; i <= 9; i++) {
        if (imagePosts.length > 0) {
          _arrangePosts.push(imagePosts.splice(0, 2));
        } else {
          break;
        }
      }
      if (videoPost.length > 0) {
        _arrangePosts.push(videoPost.splice(0, 10));
      }
    }
    setArrangedPost(_arrangePosts);
    // }
  }, [postData]);

  useEffect(() => {
    pageIndex.current = 1;
    setPostData({
      videoPosts: postData.videoPosts,
      imagePosts: [],
    });
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterLocation, otherFilters, filterCategory]);

  const fetchCategories = async () => {
    try {
      const response = await apiServices.getCategories({
        type: CATEGORY_TYPE.POST,
        id_parent: category ? category.id : 0,
      });
      const result = response.data;
      if (result.status === RESPONSE_STATUS.OK && result.data) {
        setCategories(result.data.map(obj => Category.clone(obj)));
      }
    } catch (error) {}
  };

  const fetchPosts = async () => {
    var requests = [];
    var _videoPosts = pageIndex.current === 1 ? [] : [...postData.videoPosts];
    var _imagePosts = pageIndex.current === 1 ? [] : [...postData.imagePosts];
    var params = {
      order_by: POST_ORDER_BY.DATE,
      order: ORDER_VALUE.DESC,
      page: pageIndex.current,
    };
    if (filterLocation && filterLocation.id) {
      params.location = filterLocation.id;
    }
    if (filterCategory !== null && filterCategory.id !== null) {
      params.id_category = filterCategory.id;
    } else {
      params.id_category = category.id;
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
    const postRequest = apiServices.getPosts({
      ...params,
      post_per_page: 18 * 5,
    });
    requests.push(postRequest);
    if (_videoPosts.length < 50) {
      const videoPostsRequest = apiServices.getVideos({
        order_by: POST_ORDER_BY.DATE,
        order: ORDER_VALUE.DESC,
        page: 1,
        post_per_page: 50,
      });
      requests.push(videoPostsRequest);
    }

    try {
      const responses = await Promise.all(requests);

      if (
        responses.length > 1 &&
        responses[1].data.status === RESPONSE_STATUS.OK
      ) {
        if (pageIndex.current === 1) {
          _videoPosts = responses[1].data.posts.map(p =>
            VideoPostModel.clone(p),
          );
        } else {
          _videoPosts = _videoPosts.concat(
            responses[1].data.posts.map(p => VideoPostModel.clone(p)),
          );
        }
      }

      if (
        responses.length > 0 &&
        responses[0].data.status === RESPONSE_STATUS.OK &&
        !_.isEmpty(responses[0].data.data)
      ) {
        if (pageIndex.current === 1) {
          _imagePosts = responses[0].data.data.map(p => PostModel.clone(p));
        } else {
          _imagePosts = _imagePosts.concat(
            responses[0].data.data.map(p => PostModel.clone(p)),
          );
        }
        if (responses[0].data.data.length === 18) {
          const currentIndex = pageIndex.current;
          pageIndex.current = currentIndex + 1;
        } else {
          pageIndex.current = 0;
        }
      } else {
        pageIndex.current = 0;
      }

      setPostData({
        videoPosts: _videoPosts.slice(0, 50),
        imagePosts: _imagePosts,
      });
    } catch (error) {
      console.log(JSON.stringify(error));
    } finally {
      setIsRefreshing(false);
      // setIsFetching(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    pageIndex.current = 1;
    Promise.all([fetchCategories(), fetchPosts()])
      .then(() => {
        setIsRefreshing(false);
      })
      .catch(() => {
        setIsRefreshing(false);
      });
  };

  const onPressMenu = useCallback(() => {
    showModal(Screens.Menu);
  }, []);

  const onPressFilter = () => {
    console.log('###filterCategory: ', filterCategory);
    if (filterCategory && filterCategory.id) {
      showFilterSelectionView({
        category: filterCategory ?? category,
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
      parentCategory: category,
      onSelectedCategory: cat => {
        setFilterCategory(cat);
        setOtherFilters([]);
      },
    });
  };

  const onSelectCategory = cat => {
    navigation.push(Screens.PostsByCategory, { category: cat });
  };

  const onPressFilterLocation = () => {
    showLocationSelectionView({
      onSelectedItem: location => {
        setFilterLocation(location);
      },
    });
  };

  const onPressNotify = () => {
    if (!storage.isLoggedIn()) {
      showModal(Screens.Login);
      return;
    }
    showModal(Screens.Notification);
  };

  const onPressSearch = () => {
    showModal(Screens.Search, { type: SEARCH_TYPE.POST });
  };

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

  const scrollViewDidReachEnd = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const renderCategoryItem = cat => {
    console.log('cat: ', cat.icon);
    return (
      <TouchableOpacity
        style={style.categoryItemContainer}
        onPress={() => onSelectCategory(cat)}>
        <Image
          style={style.categoryThumb}
          source={{
            uri: cat.icon || '',
          }}
        />
        <Text style={style.categoryName} numberOfLines={2} ellipsizeMode="clip">
          {cat.name || ''}
        </Text>
      </TouchableOpacity>
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
            showLogo={false}
            navigation={navigation}
          />
        </Animated.View>
      )}

      {/* Scroll View */}

      <Animated.ScrollView
        ref={scrollViewRef}
        bounces={false}
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
                if (
                  scrollViewDidReachEnd(e.nativeEvent) &&
                  pageIndex.current > 0
                ) {
                  fetchPosts();
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
        }>
        {/* Fixed header bar */}
        <HeaderView
          rightItems={headerRightItems}
          showLogo={false}
          navigation={navigation}
        />

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
        {categories.length > 0 && (
          <View
            style={{
              ...pdV(10),
              borderBottomWidth: 1,
              borderColor: colors.lightFlatGrey,
            }}>
            <FlatList
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
        )}
        {/* Post list */}
        <FlatList
          data={arrangedPosts}
          contentContainerStyle={{ flex: 1 }}
          renderItem={({ item, index }) =>
            item[0].type === 'post' ? (
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
                        navigation.showModal(Screens.PostDetail, {
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
                  height: 350,
                }}>
                <FlatList
                  contentContainerStyle={{
                    alignItems: 'center',
                  }}
                  data={item}
                  renderItem={({ item, index }) => (
                    <View key={item.id}>
                      <SocialPost
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
                        onOpenMenu={() => {}}
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
          ListHeaderComponent={() => <View style={{ width: 10 }} />}
          ListFooterComponent={() =>
            pageIndex.current > 0 ? (
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
          keyExtractor={(_, index) => 'key' + index.toString()}
          showsHorizontalScrollIndicator={false}
        />
      </Animated.ScrollView>
      <ScrollToTop
        onScrollToTop={() =>
          scrollViewRef?.current?.scrollTo({
            y: 0,
            animated: true,
          })
        }
      />
    </Layout>
  );
};

export default PostsByCategory;
