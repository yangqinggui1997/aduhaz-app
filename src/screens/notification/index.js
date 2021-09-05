import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  View,
  TouchableOpacity,
  FlatList,
  Text,
  Platform,
  RefreshControl,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useSelector, useDispatch } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';

import images from '../../assets/images';
import { Layout, LoadingView } from '../../components';
import { useNavigation } from '../../hooks';
import colors from '../../theme/colors';
import style from './style';
import Screens from '../screens';
import { NOTIFICATION_RECEIVER_TYPE } from '../../commons/constants';
import Utils from '../../commons/utils';
import apiServices from '../../services';
import { showMenuNotification } from '../../components';
import FastImage from 'react-native-fast-image';
import {
  setPassStoryImage,
  setPassStoryVideo,
  switchToTabIndex,
} from '../../redux/store/reducers/bottomTab/action';
import StoryImageItem from '../../models/story-imge';
import StoryVideoItem from '../../models/video-story';

const Notification = ({ componentId }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const navigation = useNavigation(componentId);
  const { user } = useSelector(state => state.app);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);

  const getNotifications = async () => {
    setLoading(true);
    try {
      const resNoti = await apiServices.getNotifications();
      if (Utils.isResponseSuccess(resNoti)) {
        console.log('###getNotifications: ', JSON.stringify(resNoti.data));
        setNotifications(resNoti.data.data);
      }
    } catch (error) {
      console.log('Error: getNotifications ', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getNotifications();
  }, []);

  const onPressBack = () => {
    Navigation.dismissModal(componentId);
  };

  const onSelectedNotification = async item => {
    setLoading(true);
    try {
      // mark it as viewed
      if (!item.is_viewed) {
        const resViewed = await apiServices.markNotificationIsViewed(item.id);
        console.log('###markNotificationIsViewed: ', resViewed);
      }

      // go to target screen
      console.log('###onSelectedNotification - item: ', item);
      switch (item.type_noti) {
        case NOTIFICATION_RECEIVER_TYPE.POST:
          if (item.id_post_or_story) {
            navigation.push(Screens.PostDetail, {
              postInfo: { id: item.id_post_or_story },
            });
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.COMMENT_POST:
          if (item.id_post_or_story) {
            navigation.push(Screens.PostDetail, {
              postInfo: { id: item.id_post_or_story },
            });
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.VIDEO:
          if (item.id_post_or_story) {
            navigation.push(Screens.VideoList, {
              videoId: item.id_post_or_story,
            });
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.COMMENT_VIDEO:
          if (item.id_post_or_story) {
            navigation.push(Screens.VideoList, {
              videoId: item.id_post_or_story,
            });
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.IMAGE_STORY:
          if (item.id_post_or_story) {
            const res = await apiServices.getImageStoryById({
              id: item.id_post_or_story,
            });
            if (Utils.isResponseSuccess(res)) {
              dispatch(switchToTabIndex(3));
              dispatch(setPassStoryImage(StoryImageItem.clone(res.data.data)));
              Navigation.dismissAllModals();
            }
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.COMMENT_IMAGE_STORY:
          if (item.id_post_or_story) {
            const res = await apiServices.getImageStoryById({
              id: item.id_post_or_story,
            });
            if (Utils.isResponseSuccess(res)) {
              dispatch(switchToTabIndex(3));
              dispatch(setPassStoryImage(StoryImageItem.clone(res.data.data)));
              Navigation.dismissAllModals();
            }
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.VIDEO_STORY:
          if (item.id_post_or_story) {
            const res = await apiServices.getVideoStoryById({
              id: item.id_post_or_story,
            });
            if (Utils.isResponseSuccess(res)) {
              dispatch(switchToTabIndex(4));
              dispatch(setPassStoryVideo(StoryVideoItem.clone(res.data.data)));
              Navigation.dismissAllModals();
            }
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.COMMENT_VIDEO_STORY:
          if (item.id_post_or_story) {
            const res = await apiServices.getVideoStoryById({
              id: item.id_post_or_story,
            });
            if (Utils.isResponseSuccess(res)) {
              dispatch(switchToTabIndex(4));
              dispatch(setPassStoryVideo(StoryVideoItem.clone(res.data.data)));
              Navigation.dismissAllModals();
            }
          }
          break;
        case NOTIFICATION_RECEIVER_TYPE.CHAT:
          if (item.user_create_post && item.id_post_or_story) {
            const seller = item.user_create_post;
            let buyerId;
            if (user.id !== seller.id) {
              // I'm not a seller
              buyerId = user.id;
            } else if (item.user_sent && user.id !== item.user_sent.id) {
              // I'm a seller
              buyerId = item.user_sent.id;
            }
            if (buyerId) {
              navigation.push(Screens.ChatDetail, {
                postId: item.id_post_or_story,
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
    } catch (error) {
      console.log('Error: markNotificationIsViewed ', error);
    } finally {
      setLoading(false);
    }
  };

  const onPressTurnOffNoti = async id => {
    setLoading(true);
    try {
      if (id) {
        const res = await apiServices.turnOffNotificationFromUser({
          sentUserId: id,
        });
        console.log('###turnOffNotificationFromUser: ', res);
        await getNotifications();
      }
    } catch (error) {
      console.log('Error: turnOffNotificationFromUser ', error);
    } finally {
      setLoading(false);
    }
  };
  const onPressHideNoti = async id => {
    setLoading(true);
    try {
      if (id) {
        const res = await apiServices.hideNotification(id);
        console.log('###hideNotification: ', res);
        await getNotifications();
      }
    } catch (error) {
      console.log('Error: hideNotification ', error);
    } finally {
      setLoading(false);
    }
  };

  const onPressMore = item => {
    const OPTIONS = [
      {
        id: 0,
        title: t('hide_this_notify'),
        icon: images.icon_eye_off_outline,
      },
    ];
    if (item.user_sent && item.user_sent.id && item.user_sent.name) {
      OPTIONS.push({
        id: 1,
        title: t('off_notification_from', { name: item.user_sent.name }),
        icon: images.ionicons_notification_off,
      });
    }
    OPTIONS.push({
      id: 2,
      title: t('cancel'),
      icon: images.ionicons_cancel,
    });
    console.log('###item notification: ', item);
    showMenuNotification({
      onSelectedItem: option => {
        console.log('###menu notification: ', option);
        if (option.id === 0) {
          onPressHideNoti(item.id);
        } else if (option.id === 1) {
          onPressTurnOffNoti(item.user_sent.id);
        }
      },
      menuItems: OPTIONS,
    });
  };
  //ionicons_ellipsis_vertical
  const renderNotification = (index, item) => {
    return (
      <TouchableOpacity
        style={[style.notiItem, !item.is_viewed && style.notiItemNotview]}
        onPress={() => onSelectedNotification(item)}>
        <FastImage
          style={style.notiAvatar}
          source={{
            uri:
              item.user_sent && item.user_sent.icon
                ? item.user_sent.icon
                : images.avatar_empty,
            priority: FastImage.priority.normal,
          }}
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={style.notiContentContent}>
          <Text style={style.notiContentText}>{item.title}</Text>
          <Text style={style.notiContentTime}>
            {item.created_at && Utils.getNotifyTime(item.created_at)}
          </Text>
        </View>
        {item.type_noti !== NOTIFICATION_RECEIVER_TYPE.ADMIN && (
          <TouchableOpacity
            style={style.moreOptionNotify}
            onPress={() => onPressMore(item)}>
            <FastImage
              style={style.buttonMore}
              source={images.icon_ellipsis_vertical}
              resizeMode={FastImage.resizeMode.contain}
            />
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Layout
      style={style.container}
      behavior={Platform.OS === 'ios' ? 'padding' : null}>
      <View style={style.notiHeader}>
        <TouchableOpacity onPress={onPressBack}>
          <Ionicons name="close-outline" size={30} color={colors.flatBlack02} />
        </TouchableOpacity>
        <Text style={style.titleHeader}> {t('notification')}</Text>
      </View>
      <FlatList
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              setLoading(false);
              getNotifications();
            }}
            refreshing={loading}
          />
        }
        data={notifications}
        renderItem={({ item, index }) => renderNotification(index, item)}
        keyExtractor={(_, index) => 'key' + index.toString()}
        bounces={false}
      />
      {loading && <LoadingView loading={loading} fullscreen />}
    </Layout>
  );
};

export default Notification;
