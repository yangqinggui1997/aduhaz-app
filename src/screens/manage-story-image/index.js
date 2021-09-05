import React, { useRef, useState, useEffect } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Animated,
  RefreshControl,
  Alert,
  Share,
  Toast,
} from 'react-native';
import colors from '../../theme/colors';
import { useTranslation } from 'react-i18next';
import {
  NavBar,
  Layout,
  showMenuPostSelection,
  ProfileView,
} from '../../components';
import { Navigation } from 'react-native-navigation';
import { useNavigation } from '../../hooks';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { MENU } from '../../commons/app-data';
import images from '../../assets/images';
import { alignCenter, flexRow } from '../../commons/styles';
import ImageThumbnailsView from '../../components/image-thumbnails-view';
import styles from './style';
import apiServices from '../../services';
import showStoryCommentsView from '../../components/story-comments';
import {
  RESPONSE_STATUS,
  ORDER_VALUE,
  POST_MENU_TYPE,
  POST_STORY_TYPE,
} from '../../commons/constants';
import _ from 'lodash';
import StoryImageItem from '../../models/story-imge';
import storage from '../../storage';
import Utils from '../../commons/utils';
import { wp } from '../../commons/responsive';
import moment from 'moment';
import Screens from '../../screens/screens';
import { useDispatch } from 'react-redux';
import { setPassStoryImage } from '../../redux/store/reducers/bottomTab/action';

const ManageStoryImage = ({ homeComponentId, componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const dispatch = useDispatch();

  const scrollViewRef = useRef();
  const [isFetching, setIsFetching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const scrollY = new Animated.Value(-wp(44));
  const [imageStories, setImageStories] = useState([]);
  const pageIndex = useRef(1);

  useEffect(() => {
    setIsFetching(true);
    fetchImageStories();
  }, []);

  const onPressMenuButton = item => {
    showMenuPostSelection({
      data: MENU.itemVideoMenu,
      onSelectedItem: menuItem => {
        switch (menuItem.type) {
          case POST_MENU_TYPE.SHARE:
            setTimeout(() => onPressShare(item), 200);
            break;
          case POST_MENU_TYPE.EDIT:
            onEditImageStoryItem(item);
            break;
          case POST_MENU_TYPE.DELETE:
            showDeleteConfirmAlert(item.id);
            break;
          default:
            break;
        }
      },
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

  const onEditImageStoryItem = item => {
    const images = item.images.map(image => image.directory);
    navigation.showModal(Screens.InputImagesStoryDescription, {
      imageFiles: images,
      storyItem: item,
      type: POST_STORY_TYPE.EDIT,
      onFinishUpdateStory: () => {
        onRefresh();
      },
    });
  };

  const onRefresh = () => {
    pageIndex.current = 1;
    fetchImageStories();
  };

  const fetchImageStories = async () => {
    var _imageStories = [...imageStories];
    try {
      setIsFetching(true);
      const response = await apiServices.getImageStories({
        id_user_post: storage.user.id,
        order_by: 'created_at',
        order: ORDER_VALUE.DESC,
        story_per_page: 6,
        page: pageIndex.current,
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        if (pageIndex.current === 1) {
          _imageStories = response.data.data.map(s => StoryImageItem.clone(s));
        } else {
          _imageStories = _imageStories.concat(
            response.data.data.map(s => StoryImageItem.clone(s)),
          );
        }
      } else {
        pageIndex.current = 0;
        return;
      }
      const currentIndex = pageIndex.current;
      pageIndex.current = currentIndex + 1;
      setImageStories(_imageStories);
    } catch (error) {
      console.log('fetch image stories error: ', error);
    } finally {
      setIsRefreshing(false);
      setIsFetching(false);
    }
  };

  const deleteImageStory = async id => {
    try {
      await apiServices.deleteImageStory({
        _method: 'DELETE',
        id: id,
      });
    } catch (error) {
      console.log('error: ', error);
    } finally {
      onRefresh();
    }
  };

  const showDeleteConfirmAlert = id =>
    Alert.alert(
      t('alertRemoveStoryTitle'),
      t('alertRemoveStoryMsg'),
      [
        {
          text: t('alertRemoveVideoButtonCancelTitle'),
          onPress: () => {},
          style: 'cancel',
        },
        {
          text: t('alertRemoveVideoButtonComfirmTitle'),
          onPress: () => deleteImageStory(id),
        },
      ],
      {
        cancelable: true,
      },
    );

  const onPressStoryComments = story => {
    showStoryCommentsView({ storyId: story.id });
  };

  const onPressImageStoryItem = item => {
    dispatch(setPassStoryImage(item));
    Navigation.mergeOptions(homeComponentId, {
      bottomTabs: {
        currentTabIndex: 3,
      },
    });
    Navigation.dismissAllModals();
  };

  const renderItem = ({ item }) => {
    const storyImage = item.images.map(img => {
      return img.directory;
    });
    return (
      <TouchableOpacity
        style={styles.parrentView}
        onPress={() => onPressImageStoryItem(item)}>
        <View style={styles.itemContainer}>
          <Text
            style={styles.description}
            numberOfLines={6}
            ellipsizeMode="tail">
            {item.description}
          </Text>
          <View style={styles.imageContainer}>
            <ImageThumbnailsView images={storyImage} />
          </View>
          <View style={styles.descriptionView}>
            <Text style={styles.time}>
              {Utils.getPostTime(
                new Date(item.createdAt.replace(' ', 'T') + '.000Z'),
              )}
            </Text>
            <TouchableOpacity onPress={() => onPressMenuButton(item)}>
              <Ionicons
                name={images.ionicons_menu}
                size={24}
                color={colors.flatGrey01}
              />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.footer}>
          <View style={[flexRow, alignCenter]}>
            <Ionicons
              name={images.ionicons_eye}
              size={18}
              color={colors.black}
            />
            <Text style={styles.footerItemText}>
              <Text style={{ fontWeight: 'bold' }}>
                {Utils.parseInteraction(item.numberOfViews)}
              </Text>
            </Text>
          </View>
          <View style={[flexRow, alignCenter]}>
            <Ionicons
              name={
                item.liked
                  ? images.icon_like_highlight_png
                  : images.icon_like_png
              }
              size={18}
              color={item.liked ? colors.red : colors.black}
            />
            <Text style={styles.footerItemText}>
              <Text style={{ fontWeight: 'bold' }}>
                {Utils.parseInteraction(item.numberOfLikes)}
              </Text>
            </Text>
          </View>
          <TouchableOpacity
            style={[flexRow, alignCenter]}
            onPress={() => onPressStoryComments(item)}>
            <Ionicons
              name={images.ionicons_chat_bubble}
              size={18}
              color={colors.black}
            />
            <Text style={styles.footerItemText}>
              <Text style={{ fontWeight: 'bold' }}>
                {Utils.parseInteraction(item.numberOfComments)}
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('manageImageStory')} />
      <ProfileView componentId={componentId} />
      <FlatList
        ref={scrollViewRef}
        data={imageStories}
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
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          if (pageIndex.current > 0 && !isFetching) {
            fetchImageStories();
          }
        }}
      />
    </Layout>
  );
};

export default ManageStoryImage;
