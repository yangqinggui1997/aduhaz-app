import React from 'react';
import {
  Dimensions,
  FlatList,
  StyleSheet,
  Share,
  Toast,
  View,
  Alert,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import { wp } from '../../commons/responsive';
import colors from '../../theme/colors';
import apiServices from '../../services';
import UserPostModel from '../../models/post';
import VideoPostModel from '../../models/video_post';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import { useNavigation } from '../../hooks';
import Screens from '../screens';
import storage from '../../storage';
import {
  ImagePost,
  SocialPost,
  showMenuPostSelection,
  MoreHeader,
} from '../../components';
import { MENU } from '../../commons/app-data';
import { POST_MENU_TYPE, RESPONSE_STATUS } from '../../commons/constants';

dayjs.extend(relativeTime);
dayjs.locale(storage.userLanguage);

function Posts({ userId, componentId }) {
  const navigation = useNavigation(componentId);
  const { t } = useTranslation();

  const [posts, setPosts] = React.useState([]);

  const getPosts = React.useCallback(async () => {
    try {
      const response = await apiServices.userGetAllPost(userId);
      if (response && response.data && response.data.data) {
        const {
          data: { data = [] },
        } = response;
        const items = data.map(item => {
          let mapModel;
          if (item.type === 'video') {
            mapModel = VideoPostModel.clone(item);
          } else {
            mapModel = UserPostModel.clone(item);
          }
          mapModel.type = item.type;
          return mapModel;
        });
        setPosts(items);
      }
    } catch (error) {
      console.log('userGetAllPost - error: ', error);
    }
  }, [userId]);

  React.useEffect(() => {
    getPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressSaveVideoPost = async postId => {
    const _videoPosts = [...posts];
    const postIndex = _videoPosts.findIndex(
      p => p.id === postId && p.type === 'video',
    );
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
        setPosts(_videoPosts);
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

  const onPressLikeVideoPost = async postId => {
    const videoPosts = [...posts];
    const postIndex = videoPosts.findIndex(
      p => p.id === postId && p.type === 'video',
    );
    if (postIndex >= 0) {
      try {
        if (videoPosts[postIndex].liked) {
          const response = await apiServices.unlikeVideo(
            videoPosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
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
        setPosts(videoPosts);
      } catch (error) {
        console.log('LIKE/UNLIKE ERROR: ', error);
      }
    }
  };

  const onPressLikeImagePost = async postId => {
    const imagePosts = [...posts];
    const postIndex = imagePosts.findIndex(
      p => p.id === postId && p.type === 'post',
    );
    if (postIndex >= 0) {
      try {
        if (imagePosts[postIndex].likeStatus) {
          const response = await apiServices.unlikePost(
            imagePosts[postIndex].id,
          );
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            imagePosts[postIndex].likeStatus = 0;
          } else {
            console.log('UNLIKE ERROR');
          }
        } else {
          const response = await apiServices.likePost(imagePosts[postIndex].id);
          const result = response.data;
          if (result.status === RESPONSE_STATUS.OK) {
            imagePosts[postIndex].likeStatus = 1;
          } else {
            console.log('UNLIKE ERROR');
          }
        }
        setPosts(imagePosts);
      } catch (error) {
        console.log('LIKE/UNLIKE ERROR: ', error);
      }
    }
  };

  const _renderItem = ({ item, index }) => {
    let itemComp;
    if (item.type === 'video') {
      itemComp = (
        <SocialPost
          componentId={componentId}
          item={item}
          staticPost={true}
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
          onPressLike={() => onPressLikeVideoPost(item.id)}
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
      );
    } else {
      itemComp = (
        <ImagePost
          item={item}
          showLike={true}
          onLikePress={() => onPressLikeImagePost(item.id)}
          onPressItem={() =>
            navigation.showModal(Screens.PostDetail, {
              postInfo: item,
            })
          }
        />
      );
    }
    return <View key={`${item.id}-${index}`}>{itemComp}</View>;
  };

  return (
    <View>
      <MoreHeader
        noBorder
        heading={`${t('postList')} - ${posts.length} ${t('post')}`}
        headingStyle={styles.heading}
      />
      <FlatList
        data={posts}
        renderItem={_renderItem}
        keyExtractor={item => item.id.toString()}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={styles.postsContainer}
      />
    </View>
  );
}

export default Posts;

const styles = StyleSheet.create({
  separator: {
    height: wp(1),
    backgroundColor: colors.grey,
    marginVertical: wp(15),
  },
  postsContainer: {
    paddingHorizontal: wp(15),
  },
  heading: {
    textTransform: 'none',
  },
  postImage: {
    width: '100%',
    height: (Dimensions.get('screen').width / 5) * 3,
  },
  postTitle: {
    fontSize: wp(16),
    fontWeight: '600',
    width: Dimensions.get('screen').width - wp(70),
  },
  price: {
    color: colors.red,
    fontWeight: '600',
  },
  time: {
    color: colors.grey,
    marginLeft: wp(5),
  },
  likeContainer: {
    marginTop: wp(5),
  },
});
