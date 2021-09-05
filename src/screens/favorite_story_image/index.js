import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '../../hooks';
import { FlatList, View } from 'react-native';
import { NavBar, ImagePost, Layout } from '../../components';
import Screens from '../../screens/screens';
import styles from './style';
import StoryImageItem from '../../models/story-imge';
import Utils from '../../commons/utils';
import moment from 'moment';
import apiServices from '../../services';
import { RESPONSE_STATUS } from '../../commons/constants';
import { mt, pb, pt } from '../../commons/styles';
import StoryView from '../../components/story-view';
import { setPassStoryImage } from '../../redux/store/reducers/bottomTab/action';
import { useDispatch } from 'react-redux';
import { Navigation } from 'react-native-navigation';

const FavoriteStoryImage = ({ homeComponentId, componentId }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const dispatch = useDispatch();

  const [stories, setStories] = useState({
    data: [],
    currentPage: 0,
  });

  useEffect(() => {
    fetchFavoriteImageStories();
  }, [stories.currentPage]);

  const onRefresh = () => {
    setStories({
      data: [],
      currentPage: 0,
    });
  };

  const handleLoadMore = () => {
    setStories({
      data: stories.data,
      currentPage: stories.currentPage + 1,
    });
  };

  const fetchFavoriteImageStories = async () => {
    var _stories = [...stories.data];
    try {
      const response = await apiServices.getFavoriteImageStories({
        page: stories.currentPage === 0 ? 1 : stories.currentPage,
        post_per_page: 6,
      });
      if (response.data.status == RESPONSE_STATUS.OK) {
        if (stories.currentPage <= 1) {
          _stories = response.data.data.map(obj => {
            const story = StoryImageItem.clone(obj);
            story.liked = true;
            return story;
          });
          setStories({
            data: _stories,
            currentPage: 1,
          });
        } else {
          _stories = _stories.concat(
            response.data.data.map(obj => {
              const story = StoryImageItem.clone(obj);
              story.liked = true;
              return story;
            }),
          );
          setStories({
            data: _stories,
            currentPage: stories.currentPage,
          });
        }
      }
    } catch (error) {
      console.log('error: ', error);
    }
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

  return (
    <Layout>
      <NavBar parentComponentId={componentId} title={t('favoriteImageStory')} />
      <View style={styles.contentView}>
        {/*Favorite Image Story */}
        <View style={[styles.list, pt(10), pb(10)]}>
          <FlatList
            data={stories.data}
            renderItem={({ item, index }) => (
              <View style={[styles.story]}>
                <StoryView
                  showFavorite={true}
                  post={item}
                  onFinish={onRefresh}
                  onPress={() => {
                    onPressImageStoryItem(item);
                  }}
                />
              </View>
            )}
            showsVerticalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            showsHorizontalScrollIndicator={false}
            numColumns={3}
            onEndReachedThreshold={0}
            onEndReached={handleLoadMore}
          />
        </View>
      </View>
    </Layout>
  );
};

export default FavoriteStoryImage;
