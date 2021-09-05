import React, {
  Component,
  PureComponent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  useComponentDidAppearListener,
  useComponentDidDisappearListener,
} from '../../hooks';
import { View, FlatList } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { Layout } from '../../components';

import style from './style';

import apiServices from '../../services';
import { ORDER_VALUE, RESPONSE_STATUS } from '../../commons/constants';
import StoryImageItem from '../../models/story-imge';
import ImageStoriesRow from './image-stories-row';
import SoundPlayer from 'react-native-sound-player';
import { Colors } from '../../theme';

import { setPassStoryImage } from '../../redux/store/reducers/bottomTab/action';

const HomeStoryPictures = ({ componentId }) => {
  const dispatch = useDispatch();

  const [listHeight, setListHeight] = useState(0);
  const [stories, setStories] = useState([]);
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);
  const [tabVisible, setTabVisible] = useState(false);

  const passStory = useSelector(state => state.bottomTab.passStoryImage);

  const listRef = useRef(null);
  const canLoadMore = useRef(true);
  const firstAppear = useRef(false);

  useEffect(() => {
    fetchStories();
  }, []);

  useEffect(() => {
    if (passStory && stories.length > 0) {
      var _stories = [...stories];
      const storyIndex = _stories.findIndex(story => story.id === passStory.id);
      if (storyIndex >= 0) {
        const visibleStory = { ..._stories[visibleItemIndex] };
        _stories[visibleItemIndex] = passStory;
        _stories[storyIndex] = visibleStory;
      } else {
        _stories.splice(visibleItemIndex, 0, { ...passStory });
      }
      setStories(_stories);
      dispatch(setPassStoryImage(null));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [passStory]);

  const viewDidAppear = e => {
    setTabVisible(true);
    if (firstAppear.current === false) {
      listRef.current.scrollToIndex({
        animated: false,
        index: visibleItemIndex,
      });
      firstAppear.current = true;
    }
  };

  const viewDidDisappear = e => {
    setTabVisible(false);
    SoundPlayer.stop();
  };
  useComponentDidAppearListener(viewDidAppear, componentId);
  useComponentDidDisappearListener(viewDidDisappear, componentId);

  useEffect(() => {
    if (visibleItemIndex > stories.length - 3 && canLoadMore.current) {
      const pageIndex = Math.ceil(stories.length / 10);
      fetchStories(pageIndex + 1);
    }
  }, [visibleItemIndex]);

  const fetchStories = async (pageIndex = 1) => {
    try {
      const response = await apiServices.getImageStories({
        order_by: 'created_at',
        order: ORDER_VALUE.DESC,
        story_per_page: 10,
        page: pageIndex,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        if (pageIndex === 1) {
          if (passStory && stories.length === 0) {
            setStories(
              [{ ...passStory }].concat(
                result.data.map(obj => StoryImageItem.clone(obj)),
              ),
            );
          } else {
            setStories(result.data.map(obj => StoryImageItem.clone(obj)));
          }
          // dispatch(setPassData(null));
        } else {
          setStories(
            [...stories].concat(
              result.data.map(obj => StoryImageItem.clone(obj)),
            ),
          );
        }
        canLoadMore.current = result.data.length === 10;
      }
    } catch (error) {}
  };

  const onChangeToNextStory = useCallback(() => {
    if (visibleItemIndex < stories.length - 2) {
      listRef.current.scrollToIndex({
        animated: true,
        index: visibleItemIndex + 1,
      });
      setVisibleItemIndex(visibleItemIndex + 1);
    }
  }, [visibleItemIndex, stories]);

  const onChangedVisibleRowIndex = event => {
    let yOffset = event.nativeEvent.contentOffset.y;
    let value = Math.round(yOffset / listHeight);

    setVisibleItemIndex(value);
  };

  const onFollowStatusChanged = (userId, newFollowStatus) => {
    console.log('onFollowStatusChanged: ', userId, newFollowStatus);
    setStories(
      stories.map(item => {
        if (item.user.id === userId) {
          item.user.follow_status = newFollowStatus;
          console.log('onFollowStatusChanged - MAP: ', userId, newFollowStatus);
        }
        return item;
      }),
    );
  };

  const renderRow = ({ item, index }) => {
    return (
      <StoryRow
        key={index}
        style={[style.storyRow, { height: listHeight }]}
        listHeight={listHeight}
        item={item}
        onChangeToNextStory={() => onChangeToNextStory()}
        onFollowStatusChanged={onFollowStatusChanged}
        show={visibleItemIndex === index && tabVisible}
        preLoad={Math.abs(visibleItemIndex - index) <= 5}
        componentId={componentId}
      />
    );
  };

  return (
    <Layout style={style.container}>
      <FlatList
        ref={listRef}
        style={{ flex: 1 }}
        onLayout={layout => {
          setListHeight(layout.nativeEvent.layout.height);
        }}
        data={stories}
        renderItem={useMemo(
          () => renderRow,
          [stories, visibleItemIndex, tabVisible, listHeight],
        )}
        keyExtractor={(_, index) => 'key' + index.toString()}
        pagingEnabled
        onMomentumScrollEnd={event => onChangedVisibleRowIndex(event)}
        onScrollBeginDrag={event => {
          let yOffset = event.nativeEvent.contentOffset.y;
          let value = Math.round(yOffset / listHeight);

          if (value < stories.length - 1) {
            SoundPlayer.stop();
          }
        }}
        showsVerticalScrollIndicator={false}
      />
    </Layout>
  );
};

HomeStoryPictures.options = {
  statusBar: {
    backgroundColor: Colors.black,
    style: 'light',
  },
};

class StoryRow extends React.PureComponent {
  render() {
    return (
      <View style={this.props.style}>
        <ImageStoriesRow
          item={this.props.item}
          listHeight={this.props.listHeight}
          onChangeToNextStory={this.props.onChangeToNextStory}
          show={this.props.show}
          preLoad={this.props.preLoad}
          componentId={this.props.componentId}
          onFollowStatusChanged={this.props.onFollowStatusChanged}
        />
      </View>
    );
  }
}

export default HomeStoryPictures;
