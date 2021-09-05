import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import { wp } from '../../commons/responsive';
import apiServices from '../../services';
import StoryImageItem from '../../models/story-imge';
import StoryVideoItem from '../../models/video-story';
import 'dayjs/locale/vi';
import relativeTime from 'dayjs/plugin/relativeTime';
import dayjs from 'dayjs';
import StoryView from '../../components/story-view';
import {
  setPassStoryImage,
  setPassStoryVideo,
  switchToTabIndex,
} from '../../redux/store/reducers/bottomTab/action';
import { Navigation } from 'react-native-navigation';
import storage from '../../storage';

dayjs.extend(relativeTime);
dayjs.locale(storage.userLanguage);

function Stories({ userId, componentId }) {
  const dispatch = useDispatch();
  const [stories, setStories] = React.useState([]);

  const getStories = React.useCallback(async () => {
    try {
      const response = await apiServices.userGetAllStory(userId);
      if (response && response.data && response.data.data) {
        const {
          data: { data = [] },
        } = response;
        if (data?.length) {
          const story = data.map(item => {
            let storyModel;
            if (item.type === 'story-image') {
              storyModel = StoryImageItem.clone(item);
              // if (!storyModel.images) {
              //   storyModel.images = [];
              // }
            } else {
              storyModel = StoryVideoItem.clone(item);
            }
            storyModel.type = item.type;
            return storyModel;
          });
          setStories(story);
        }
      }
    } catch (error) {
      console.log('getStories - error: ', error);
    }
  }, [userId]);

  React.useEffect(() => {
    getStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onPressVideoStoryItem = item => {
    dispatch(switchToTabIndex(4));
    dispatch(setPassStoryVideo(item));
    Navigation.dismissAllModals();
  };

  const onPressImageStoryItem = item => {
    dispatch(switchToTabIndex(3));
    dispatch(setPassStoryImage(item));
    Navigation.dismissAllModals();
  };

  return (
    <FlatList
      contentContainerStyle={styles.contentContainerStyle}
      data={stories}
      renderItem={({ item, index }) => {
        if (item.type === 'story-image') {
          return (
            <StoryView
              componentId={componentId}
              style={styles.story}
              post={item}
              onPress={() => {
                onPressImageStoryItem(item);
              }}
            />
          );
        } else {
          return (
            <StoryView
              componentId={componentId}
              style={styles.story}
              post={item}
              onPress={() => {
                onPressVideoStoryItem(item);
              }}
            />
          );
        }
      }}
      ItemSeparatorComponent={() => <View style={styles.separator} />}
      ListHeaderComponent={() => <View style={styles.separator} />}
      ListFooterComponent={() => <View style={styles.separator} />}
      showsHorizontalScrollIndicator={false}
      horizontal
      keyExtractor={(item, index) => `${item.id.toString()} - ${index}`}
    />
  );
}

export default Stories;

const styles = StyleSheet.create({
  contentContainerStyle: {
    alignItems: 'center',
  },
  story: {
    width: 100,
    height: 150,
  },
  separator: {
    width: wp(10),
  },
});
