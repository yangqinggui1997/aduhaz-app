import React, { useRef, useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Animated,
  RefreshControl,
  Share,
  Toast,
} from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  NavBar,
  Layout,
  showMenuPostSelection,
  UserVideoStory,
  ProfileView,
} from '../../components';
import { useNavigation } from '../../hooks';
import styles from './style';
import { MENU } from '../../commons/app-data';
import apiServices from '../../services';
import {
  RESPONSE_STATUS,
  ORDER_VALUE,
  POST_MENU_TYPE,
  POST_STORY_TYPE,
} from '../../commons/constants';
import _ from 'lodash';
import VideoStory from '../../models/video-story';
import storage from '../../storage';
import { wp } from '../../commons/responsive';
import Screens from '../../screens/screens';

const ManageStoryVideo = ({ componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const scrollViewRef = useRef();
  const [interactItemIndex, setInteractItemIndex] = useState(0);
  const [isFetching, setIsFetching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = new Animated.Value(-wp(44));
  const [videoStories, setVideoStories] = useState([]);
  const pageIndex = useRef(1);

  useEffect(() => {
    setIsFetching(true);
    fetchVideoStories();
  }, []);

  const onRefresh = () => {
    pageIndex.current = 1;
    fetchVideoStories();
  };

  const fetchVideoStories = async () => {
    var _videoStories = [...videoStories];
    try {
      setIsFetching(true);
      const response = await apiServices.getVideoStories({
        id_user_post: storage.user.id,
        order_by: 'created_at',
        order: ORDER_VALUE.DESC,
        story_per_page: 6,
        page: pageIndex.current,
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        if (pageIndex.current === 1) {
          _videoStories = response.data.data.map(s => VideoStory.clone(s));
        } else {
          _videoStories = _videoStories.concat(
            response.data.data.map(s => VideoStory.clone(s)),
          );
        }
      } else {
        pageIndex.current = 0;
        return;
      }
      const currentIndex = pageIndex.current;
      pageIndex.current = currentIndex + 1;
      setVideoStories(_videoStories);
    } catch (error) {
      console.log('fetch video stories error: ', error);
    } finally {
      setIsRefreshing(false);
      setIsFetching(false);
    }
  };

  const deleteVideoStory = async id => {
    try {
      await apiServices.deleteVideoStory({
        _method: 'DELETE',
        id: id,
      });
    } catch (error) {
      console.log('error: ', error);
    } finally {
      onRefresh();
    }
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

  const onEditVideoStoryItem = item => {
    navigation.showModal(Screens.InputVideoStoryDescription, {
      storyItem: item,
      type: POST_STORY_TYPE.EDIT,
      onFinishUpdateStory: () => {
        onRefresh();
      },
    });
  };

  const showDeleteConfirmAlert = id =>
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
          onPress: () => deleteVideoStory(id),
        },
      ],
      {
        cancelable: true,
      },
    );

  const onInteractItem = index => {
    setInteractItemIndex(index);
  };

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('manageVideoStory')} />
      <ProfileView componentId={componentId} />
      <FlatList
        data={videoStories}
        style={styles.list}
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
          <UserVideoStory
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
                    case POST_MENU_TYPE.EDIT:
                      onEditVideoStoryItem(item);
                      break;
                    case POST_MENU_TYPE.DELETE:
                      showDeleteConfirmAlert(item.id);
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
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        bounces={false}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (pageIndex.current > 0 && !isFetching) {
            fetchVideoStories();
          }
        }}
      />
    </Layout>
  );
};

export default ManageStoryVideo;
