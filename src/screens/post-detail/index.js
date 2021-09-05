import _ from 'lodash';
import moment from 'moment';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import {
  Alert,
  Animated,
  Linking,
  RefreshControl,
  Share,
  Text,
  Toast,
  TouchableOpacity,
  FlatList,
  View,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { AirbnbRating } from 'react-native-ratings';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import images from '../../assets/images';
import { MENU } from '../../commons/app-data';
import {
  IMAGE_TYPE,
  POST_MENU_TYPE,
  RESPONSE_STATUS,
} from '../../commons/constants';
import {
  alignCenter,
  flexRow,
  mb,
  ml,
  mt,
  pb,
  pdH,
} from '../../commons/styles';
import Utils from '../../commons/utils';
import {
  AdsBanner,
  ImageSwiper,
  ImageView,
  Layout,
  MoreHeader,
  ScrollToTop,
  showMenuPostSelection,
  ImagePost,
  LoadingView,
  TextViewMore,
} from '../../components';
import showPostCommentsView from '../../components/post-comments';
import { useNavigation } from '../../hooks';
import { useRingAnimation } from '../../hooks/useRingAnimation';
import PostModel from '../../models/post';
import apiService from '../../services';
import storage from '../../storage';
import colors from '../../theme/colors';
import Screens from '../screens';
import VideosRelate from './VideosRelate';
import style from './style';
import { Colors } from '../../theme';
import { wp } from '../../commons/responsive';

dayjs.extend(relativeTime);
dayjs.locale(storage.userLanguage);

const data = [images.post_detail, images.post_detail_1, images.post_detail_2];

const PostDetail = ({ componentId, postInfo }) => {
  // console.log('###postInfo: ', postInfo);
  const navigation = useNavigation(componentId);
  const rotation = useRingAnimation();
  const { t } = useTranslation();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [post, setPost] = useState({
    ...postInfo,
    images: [
      {
        directory: postInfo?.icon,
      },
    ],
  });
  const [relatedPosts, setRelatedPosts] = useState([]);

  const currentPagePosts = useRef(1);
  const isFetching = useRef(false);

  const scrollViewRef = useRef();

  const isLoggedIn = storage.isLoggedIn();

  const isMyPost =
    isLoggedIn && post?.createdBy
      ? post?.createdBy?.id === storage.user?.id
      : false;

  const getPostDetail = useCallback(async () => {
    try {
      const res = await apiService.getPostById(post.id);
      let dataPost;
      if (res.data.status === RESPONSE_STATUS.OK) {
        dataPost = PostModel.clone(res.data.data);
        // console.log('###dataPost: ', dataPost);
        setPost(dataPost);
      }
      return dataPost;
    } catch (error) {
      console.log('getPostById - error: ', error);
      return error;
    }
  }, [post.id]);

  const getRelatedPosts = useCallback(
    async categoryId => {
      console.log('getReleatedPosts - categoryId: ', categoryId);
      isFetching.current = true;
      try {
        const res = await apiService.getPostsRelate({
          id_post: post.id,
          id_category: categoryId,
          page: currentPagePosts.current,
          post_per_page: 50,
        });
        if (res?.data?.data?.length) {
          const serializedPosts = res.data.data.map(postItem =>
            PostModel.clone(postItem),
          );
          if (currentPagePosts.current === 1) {
            // set
            setRelatedPosts(serializedPosts);
          } else {
            // concat
            setRelatedPosts(relatedPosts.concat(serializedPosts));
          }
          currentPagePosts.current += 1;
        } else {
          currentPagePosts.current = 0;
        }
        isFetching.current = false;
      } catch (error) {
        isFetching.current = false;
      }
    },
    [post.id, relatedPosts],
  );

  useEffect(() => {
    onRefresh(false, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onRefresh = useCallback(
    (showRefreshing, showLoading) => {
      // get post detail
      setIsRefreshing(showRefreshing);
      setIsLoading(showLoading);
      getPostDetail()
        .then(newPost => {
          setIsRefreshing(false);
          setIsLoading(false);
          if (newPost && newPost.categoryId) {
            // get related posts
            isFetching.current = true;
            currentPagePosts.current = 1;
            setRelatedPosts([]);
            getRelatedPosts(newPost.categoryId);
          }
        })
        .catch(error => {
          console.log('###getPostDetail - error: ', error);
          setIsRefreshing(false);
          setIsLoading(false);
        });
    },
    [getPostDetail, getRelatedPosts],
  );

  const handleLoadMoreRelatedPosts = () => {
    if (
      currentPagePosts.current > 1 &&
      !isFetching.current &&
      post?.categoryId
    ) {
      console.log('----handleLoadMoreRelatedPosts');
      getRelatedPosts(post?.categoryId);
    }
  };

  const handleClose = async () => {
    try {
      const result = await Navigation.dismissModal(componentId);
      console.log('dismissModal - result: ', result);
    } catch (error) {
      console.log('dismissModal - error: ', error);
      const popResult = await navigation.pop();
      console.log('popResult - popResult: ', popResult);
    }
  };

  const handleLikePost = async () => {
    try {
      await apiService.likePost(post.id);
      getPostDetail();
    } catch (error) {}
  };

  const handleSavePost = async () => {
    try {
      const response = await apiService.savePost(post.id);
      console.log('save reponse: ', response.data);
      if (response.data.status == RESPONSE_STATUS.OK) {
        Alert.alert(t('savePostAlert'));
        getPostDetail();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleUnSavePost = async () => {
    try {
      const response = await apiService.unSavePost(post.id);
      console.log('unsave reponse: ', response.data);
      if (response.data.status == RESPONSE_STATUS.OK) {
        Alert.alert(t('unsavePostAlert'));
        getPostDetail();
      }
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const handleOpenMenu = () => {
    showMenuPostSelection({
      data: isMyPost
        ? MENU.myPostDetail
        : post.saveStatus === 0
        ? MENU.grids
        : MENU.unSaveGrids,
      onSelectedItem: menuItem => {
        switch (menuItem.type) {
          case POST_MENU_TYPE.SAVE:
            handleSavePost();
            break;
          case POST_MENU_TYPE.UNSAVE:
            handleUnSavePost();
            break;
          case POST_MENU_TYPE.SHARE:
            setTimeout(() => onPressShare(), 200);
            break;
          case POST_MENU_TYPE.REPORT:
            onPressReport();
            break;
          default:
            break;
        }
      },
    });
  };

  const handlePhoneCall = () => Linking.openURL(`tel:${post?.phoneNumber}`);

  const onPressShare = async () => {
    if (storage.isLoggedIn()) {
      try {
        const urlShare = post?.shareLink;
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

  const handleChatWithSeller = () => {
    if (isLoggedIn) {
      navigation.push(Screens.ChatDetail, {
        postId: post.id,
        buyerId: storage.user.id,
        sellerId: post.createdBy.id,
      });
    } else {
      Alert.alert(t('pleaseLogin'));
    }
  };

  const onPressReport = () =>
    navigation.push(Screens.Report, {
      postId: post.id,
      postTitle: post.postTitle,
    });
  const onPressViewSellerProfile = () =>
    navigation.push(Screens.ProfileSeller, {
      userId: post?.createdBy?.id,
    });
  const onPressRating = () =>
    navigation.push(Screens.RatingDetail, {
      userId: post.createdBy.id,
    });

  const handlePostComment = () => {
    showPostCommentsView({
      postId: post.id,
      totalComments: post?.comments ?? 0,
      onClose: () => getPostDetail(),
    });
  };

  const handlePressImage = () => {
    navigation.showModal(Screens.ViewImage, {
      images: post.images.map(img =>
        Utils.getResizedImageUri(img.directory, IMAGE_TYPE.ORIGIN),
      ),
    });
  };

  const renderOnlineStatus = user => {
    let backgroundColor = Colors.orange;
    if (user && user.lastOnline && user.lastOnline.seconds) {
      const lastOnline = moment(user.lastOnline.seconds * 1000).valueOf();
      if (moment().valueOf() - lastOnline < 60 * 1000) {
        backgroundColor = Colors.green;
      }
    }
    return <View style={[style.onlineStatus, { backgroundColor }]} />;
  };

  const renderViewMore = onPress => {
    console.log('renderViewMore');
    return (
      <Text
        style={{
          textDecorationLine: 'underline',
          textAlign: 'right',
        }}
        onPress={onPress}>
        {t('viewMore')}
      </Text>
    );
  };

  const renderViewLess = onPress => {
    console.log('renderViewLess');
    return (
      <Text
        style={{
          textDecorationLine: 'underline',
          textAlign: 'right',
        }}
        onPress={onPress}>
        {t('viewLess')}
      </Text>
    );
  };

  const renderHeader = () => {
    return (
      <View>
        <View style={{ minHeight: wp(34) }}>
          <TouchableOpacity style={style.closeBtn} onPress={handleClose}>
            <Ionicons
              style={style.closeIcon}
              name="close-outline"
              size={wp(27)}
            />
          </TouchableOpacity>
          {/* Photos */}
          <ImageSwiper
            style={style.images}
            images={
              post?.images
                ? post.images.map(img =>
                    Utils.getResizedImageUri(img.directory, IMAGE_TYPE.MEDIUM),
                  )
                : []
            }
            resizeMode={ImageView.resizeMode.cover}
            onPress={() => handlePressImage()}
          />
        </View>
        <View style={[style.bgWhite]}>
          {/* Người đăng */}
          <View style={[flexRow, style.authorContainer, pdH(10), mt(13)]}>
            <TouchableOpacity
              style={[flexRow, { alignItems: 'center' }]}
              disabled={isMyPost}
              onPress={onPressViewSellerProfile}>
              <View>
                <ImageView
                  source={
                    post?.createdBy?.icon
                      ? {
                          uri: post.createdBy.icon,
                        }
                      : images.avatar_empty
                  }
                  style={style.authorAvatar}
                  placeholderImage={images.avatar_empty}
                />
                {renderOnlineStatus(post?.createdBy)}
              </View>
              <View style={{ paddingLeft: 10 }}>
                <Text style={[style.authorName]}>{post?.createdBy?.name}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleOpenMenu}>
              <MaterialCommunityIcons
                name="dots-horizontal"
                size={27}
                color="#00afef"
              />
            </TouchableOpacity>
          </View>

          {/* Tiêu đề */}
          <View style={[pdH(10)]}>
            {/* <TextViewMore
              numberOfTextLines={1}
              renderViewMore={renderViewMore}
              renderViewLess={renderViewLess}
              textStyle={[style.postTitle, mt(8), mb(3)]}>
              <Text>{post?.postTitle}</Text>
            </TextViewMore> */}
            <Text style={[style.postTitle, mt(8), mb(3)]}>
              {post?.postTitle}
            </Text>
            <View style={[flexRow, alignCenter]}>
              <Text style={[style.chude]}>{`${t('musicTopic')}: `}</Text>
              <TouchableOpacity>
                <Text style={[style.chudeContent]}>{post?.categoryName}</Text>
              </TouchableOpacity>
            </View>
            <Text style={[style.price]}>
              {`${Utils.formatPrice(parseInt(post?.price ? post.price : ''))}`}
            </Text>
          </View>

          {/* Ngày đăng */}
          <View style={[flexRow, alignCenter, pdH(10), mt(5)]}>
            <EvilIcons name="calendar" size={19} color="#666" />
            <Text style={[style.ngaydangTxt, ml(4)]}>
              {post?.createdAt
                ? Utils.getPostTime(moment.unix(post.createdAt).toDate())
                : ''}
            </Text>
          </View>
          <View style={[flexRow, alignCenter, pdH(10), mb(8)]}>
            <EvilIcons name="location" size={19} color="#666" />
            <Text style={[style.ngaydangTxt, ml(4)]}>{post?.address}</Text>
          </View>

          {/* Bình luận */}
          <View style={[flexRow, alignCenter, style.commentContainer]}>
            <View style={[flexRow, alignCenter]}>
              <Ionicons
                name={images.ionicons_eye}
                size={18}
                color={colors.black}
              />
              <Text style={[style.viewCount, ml(4)]}>
                <Text style={{ fontWeight: 'bold' }}>
                  {Utils.parseInteraction(post?.view ?? 0)}
                </Text>
              </Text>
            </View>
            <TouchableOpacity
              style={[flexRow, alignCenter]}
              onPress={() =>
                post?.likeStatus === 0 ? handleLikePost() : null
              }>
              <Ionicons
                name={
                  post?.likeStatus === 0
                    ? images.icon_like_png
                    : images.icon_like_highlight_png
                }
                size={18}
                color={post?.likeStatus === 0 ? colors.black : colors.red}
              />
              <Text style={[style.viewCount, ml(4)]}>
                <Text style={{ fontWeight: 'bold' }}>
                  {Utils.parseInteraction(post?.like ?? 0)}
                </Text>
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[flexRow, alignCenter]}
              onPress={handlePostComment}>
              <Ionicons
                name={images.ionicons_chat_bubble}
                size={18}
                color={colors.black}
              />
              <Text style={[style.viewCount, ml(4)]}>
                <Text style={{ fontWeight: 'bold' }}>
                  {Utils.parseInteraction(post?.comments ?? 0)}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>

          {/* Chi tiết */}
          <View style={[pdH(10), mt(12)]}>
            {post?.content ? (
              <TextViewMore
                numberOfTextLines={4}
                renderViewMore={renderViewMore}
                renderViewLess={renderViewLess}
                textStyle={style.bodyTxt}>
                <Text>{post?.content}</Text>
              </TextViewMore>
            ) : null}

            {post?.properties?.map((property, index) => {
              return (
                <Text style={[style.bodyTxt, style.bodyTxtBold]} key={index}>
                  {property?.name}:{' '}
                  <Text style={[style.bodyTxt, style.bodyTxtNormal]}>
                    {property?.value}
                  </Text>
                </Text>
              );
            })}
          </View>

          {/* Gọi ngay */}
          {!_.isEmpty(post?.phoneNumber) && (
            <View style={[pdH(10), mt(25), ml(10)]}>
              <TouchableOpacity
                style={[style.callNowBtn]}
                disabled={isMyPost}
                onPress={handlePhoneCall}>
                <View style={[flexRow, alignCenter, style.callNowBox]}>
                  <View style={[style.phoneIconBox]}>
                    <Animated.View
                      style={[
                        {
                          transform: [
                            {
                              rotate: rotation,
                            },
                          ],
                        },
                      ]}>
                      <FontAwesomeIcon
                        name="volume-control-phone"
                        color="#fff"
                        size={26}
                        style={style.phoneIcon}
                      />
                    </Animated.View>
                  </View>

                  <Text style={[style.callNowTxt]}>{t('callNow')}</Text>
                </View>
              </TouchableOpacity>
            </View>
          )}

          {/* Chat với người bán */}
          <View style={[pdH(10), mt(35)]}>
            <TouchableOpacity
              style={[style.khuyenCaoBtn]}
              disabled={isMyPost}
              onPress={handleChatWithSeller}>
              <View style={[flexRow, alignCenter]}>
                <FontAwesomeIcon name="comments-o" size={14} />

                <Text style={[style.khuyencaoText]}>{t('chatWithSeller')}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={[style.bgWhite, pb(20)]}>
          <View style={[style.bottomContainer]}>
            <View style={[style.userStatus]}>
              <TouchableOpacity
                style={[alignCenter, style.userStatusItem]}
                disabled={isMyPost}
                onPress={onPressViewSellerProfile}>
                <Text style={[style.userStatusTxt]}>{t('viewPage')}</Text>
                <EvilIcons name="user" size={30} />
              </TouchableOpacity>
              <TouchableOpacity
                disabled={isMyPost}
                onPress={onPressRating}
                style={[
                  alignCenter,
                  style.userStatusItem,
                  style.userStatusItemBorder,
                ]}>
                <Text style={[style.userStatusTxt]}>{t('rating')}</Text>
                <View style={[style.ratingBox]}>
                  <Text style={[style.ratingPoint]}>
                    {post?.createdBy?.point_of_evaluate ?? 0}
                  </Text>
                  <AirbnbRating
                    showRating={false}
                    size={20}
                    defaultRating={
                      post?.createdBy?.point_of_evaluate
                        ? post?.createdBy?.point_of_evaluate / 5
                        : 0
                    }
                    count={1}
                    onFinishRating={() => {}}
                    isDisabled={true}
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={[alignCenter, style.userStatusItem]}
                disabled={isMyPost}
                onPress={onPressReport}>
                <Text style={[style.userStatusTxt]}>
                  {t('reportViolation')}
                </Text>
                <EvilIcons name="exclamation" size={30} />
              </TouchableOpacity>
            </View>

            <View style={[mt(15)]}>
              <View style={[style.adsHeader]}>
                <Text style={[style.adsHeading, ml(10)]}>
                  {t('recommendedAds')}
                </Text>
              </View>

              <View style={[flexRow, mt(10)]}>
                {data.map((ads, idx) => (
                  <AdsBanner key={idx} image={ads} />
                ))}
              </View>
            </View>

            {/* <TouchableOpacity style={[style.sendCommentBtn]}>
            <View style={[flexRow, style.sendCommentBtnBody]}>
              <FeatherIcon name="phone" color="#fff" size={24} />
              <Text style={[style.sendCommentBtnTxt]}>
                {t('sendSuggestion)}
              </Text>
            </View>
          </TouchableOpacity> */}
          </View>
        </View>

        <View style={[style.moreVideo]}>
          <MoreHeader heading={t('videosRelate')} />
          <VideosRelate componentId={componentId} />
        </View>
        {post?.categoryId && relatedPosts.length > 0 && (
          <View style={[style.moreVideo]}>
            <MoreHeader noBorder heading={t('postsRelate')} />
          </View>
        )}
      </View>
    );
  };

  const renderItem = ({ item, index }) => {
    console.log('###post detail render item: ', index);
    return (
      <View style={{ width: '50%' }}>
        <ImagePost
          item={item}
          onPressItem={() =>
            navigation.showModal(Screens.PostDetail, {
              postInfo: item,
            })
          }
        />
      </View>
    );
  };

  return (
    <Layout>
      <FlatList
        ref={scrollViewRef}
        style={[style.scrollView]}
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => onRefresh(true, false)}
          />
        }
        data={relatedPosts}
        numColumns={2}
        renderItem={renderItem}
        ListHeaderComponent={renderHeader()}
        keyExtractor={(item, index) =>
          item.id.toString() + '-' + index.toString()
        }
        onEndReachedThreshold={1}
        onEndReached={handleLoadMoreRelatedPosts}
      />
      <ScrollToTop
        onScrollToTop={() =>
          scrollViewRef?.current?.scrollToOffset({
            animated: true,
            offset: 0,
          })
        }
      />
      {isLoading ? <LoadingView loading={isLoading} fullscreen /> : null}
    </Layout>
  );
};

PostDetail.options = {
  animations: {
    showModal: {
      // waitForRender: true,
      alpha: {
        from: 0.75,
        to: 1,
        duration: 100,
      },
    },
    dismissModal: {
      alpha: {
        from: 1,
        to: 0,
        duration: 100,
      },
    },
  },
};

export default PostDetail;
