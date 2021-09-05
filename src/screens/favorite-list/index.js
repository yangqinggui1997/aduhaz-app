import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../hooks';
import {
  Text,
  TouchableOpacity,
  View,
  FlatList,
  ScrollView,
} from 'react-native';
import { NavBar, ImagePost, Layout, ProfileView } from '../../components';
import Screens from '../../screens/screens';
import styles from './style';
import { mt, pb, pt } from '../../commons/styles';
import StoryView from '../../components/story-view';
import { RESPONSE_STATUS } from '../../commons/constants';
import FavoritePostModel from '../../models/favorite-post';
import StoryVideoItem from '../../models/video-story';
import StoryImageItem from '../../models/story-imge';
import apiServices from '../../services';
import { useDispatch } from 'react-redux';
import {
  setPassStoryImage,
  setPassStoryVideo,
} from '../../redux/store/reducers/bottomTab/action';
import { Navigation } from 'react-native-navigation';

const FavoriteList = ({ homeComponentId, componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const dispatch = useDispatch();

  const [imagePosts, setImagePosts] = useState([]);
  const [videoPosts, setVideoPosts] = useState([]);
  const [imageStories, setImageStories] = useState([]);
  const [videoStories, setVideoStories] = useState([]);

  useEffect(() => {
    fetchFavoriteImagePosts();
    fetchFavoriteVideoPosts();
    fetchFavoriteImageStories();
    fetchFavoriteVideoStories();
  }, []);

  const fetchFavoriteImagePosts = async () => {
    var _imagePosts = [...imagePosts];
    try {
      const response = await apiServices.getFavoriteImagePosts({
        page: 1,
        post_per_page: 10,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        _imagePosts = response.data.data.map(obj =>
          FavoritePostModel.clone(obj),
        );
      }
      setImagePosts(_imagePosts);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchFavoriteVideoPosts = async () => {
    var _videoPosts = [...videoPosts];
    try {
      const response = await apiServices.getFavoriteVideoPosts({
        page: 1,
        post_per_page: 10,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        _videoPosts = response.data.data.map(obj =>
          FavoritePostModel.clone(obj),
        );
      }
      setVideoPosts(_videoPosts);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchFavoriteImageStories = async () => {
    var _imageStories = [...imageStories];
    try {
      const response = await apiServices.getFavoriteImageStories({
        page: 1,
        post_per_page: 10,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        console.log(
          '###fetchFavoriteImageStories - response.data.data: ',
          response.data.data,
        );
        _imageStories = response.data.data.map(obj => {
          const story = StoryImageItem.clone(obj);
          story.liked = true;
          return story;
        });
      }
      setImageStories(_imageStories);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const fetchFavoriteVideoStories = async () => {
    var _videoStories = [...videoStories];
    try {
      const response = await apiServices.getFavoriteVideoStories({
        page: 1,
        post_per_page: 10,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        console.log(
          '###fetchFavoriteVideoStories - response.data.data: ',
          response.data.data,
        );
        _videoStories = response.data.data.map(obj => {
          const story = StoryVideoItem.clone(obj);
          story.liked = true;
          return story;
        });
      }
      setVideoStories(_videoStories);
    } catch (error) {
      console.log('error: ', error);
    }
  };

  const renderItemFavoriteListings = (item, index, type) => {
    return (
      <View style={styles.itemListingsList} key={index.toString}>
        <ImagePost
          item={item}
          showPrice={type === 'imagePost'}
          onPressItem={() =>
            type === 'imagePost'
              ? navigation.showModal(Screens.PostDetail, { postInfo: item })
              : navigation.push(Screens.VideoList, { videoId: item.id })
          }
        />
      </View>
    );
  };

  const onPressImageStoryItem = item => {
    console.log('###onPressImageStoryItem - item: ', item);
    dispatch(setPassStoryImage(item));
    Navigation.mergeOptions(homeComponentId, {
      bottomTabs: {
        currentTabIndex: 3,
      },
    });
    Navigation.dismissAllModals();
  };

  const onPressVideoStoryItem = item => {
    dispatch(setPassStoryVideo(item));
    Navigation.mergeOptions(homeComponentId, {
      bottomTabs: {
        currentTabIndex: 4,
      },
    });
    Navigation.dismissAllModals();
  };

  return (
    <Layout>
      <NavBar title={t('favoriteList')} parentComponentId={componentId} />
      <ProfileView componentId={componentId} />
      <ScrollView
        style={styles.container}
        bounces={false}
        showsVerticalScrollIndicator={false}>
        <View style={styles.contentView}>
          {/*Favorite Listings */}
          {imagePosts.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.push(Screens.FavoriteListings)}>
              <Text style={[styles.screenTitle, mt(20)]}>
                {t('favoriteListings')}
              </Text>
            </TouchableOpacity>
          )}
          {imagePosts.length > 0 && (
            <FlatList
              data={imagePosts}
              renderItem={({ item, index }) =>
                renderItemFavoriteListings(item, index, 'imagePost')
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={() => <View style={styles.separator} />}
              ListFooterComponent={() => <View style={styles.separator} />}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              horizontal
            />
          )}

          {imagePosts.length > 0 && (
            <View style={styles.bottomSeparator}></View>
          )}

          {/*Favorite Video */}
          {videoPosts.length > 0 && (
            <TouchableOpacity
              onPress={() => navigation.push(Screens.FavoriteVideo)}>
              <Text style={[styles.screenTitle, mt(20)]}>
                {t('favoriteVideo')}
              </Text>
            </TouchableOpacity>
          )}
          {videoPosts.length > 0 && (
            <FlatList
              data={videoPosts}
              renderItem={({ item, index }) =>
                renderItemFavoriteListings(item, index, 'videoPost')
              }
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              ListHeaderComponent={() => <View style={styles.separator} />}
              ListFooterComponent={() => <View style={styles.separator} />}
              keyExtractor={item => item.id.toString()}
              showsHorizontalScrollIndicator={false}
              bounces={false}
              horizontal
            />
          )}

          {videoPosts.length > 0 && (
            <View style={styles.bottomSeparator}></View>
          )}

          {/*Favorite Image Story */}
          {imageStories.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.push(Screens.FavoriteStoryImage, {
                  homeComponentId: homeComponentId,
                })
              }>
              <Text style={[styles.screenTitle, mt(20)]}>
                {t('favoriteImageStory')}
              </Text>
            </TouchableOpacity>
          )}
          {imageStories.length > 0 && (
            <View style={pb(20)}>
              <FlatList
                contentContainerStyle={{
                  alignItems: 'center',
                }}
                data={imageStories}
                renderItem={({ item, index }) => (
                  <View key={index.toString}>
                    <StoryView
                      post={item}
                      style={styles.story}
                      onPress={() => {
                        onPressImageStoryItem(item);
                      }}
                    />
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => <View style={styles.separator} />}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal
                bounces={false}
              />
            </View>
          )}

          {imageStories.length > 0 && (
            <View style={styles.bottomSeparator}></View>
          )}

          {/*Favorite Video Story */}
          {videoStories.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.push(Screens.FavoriteStoryVideo, {
                  homeComponentId: homeComponentId,
                })
              }>
              <Text style={[styles.screenTitle, mt(20)]}>
                {t('favoriteVideoStory')}
              </Text>
            </TouchableOpacity>
          )}
          {videoStories.length > 0 && (
            <View style={pb(10)}>
              <FlatList
                contentContainerStyle={{
                  alignItems: 'center',
                }}
                data={videoStories}
                renderItem={({ item, index }) => (
                  <View key={index.toString}>
                    <StoryView
                      post={item}
                      style={styles.story}
                      onPress={() => {
                        onPressVideoStoryItem(item);
                      }}
                    />
                  </View>
                )}
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                ListHeaderComponent={() => <View style={styles.separator} />}
                ListFooterComponent={() => <View style={styles.separator} />}
                keyExtractor={item => item.id.toString()}
                showsHorizontalScrollIndicator={false}
                horizontal
                bounces={false}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </Layout>
  );
};

export default FavoriteList;
