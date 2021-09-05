import React, { useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View, Image } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';

import { ORDER_VALUE, RESPONSE_STATUS } from '../../commons/constants';
import { Layout } from '../../components';
import {
  useComponentDidAppearListener,
  useComponentDidDisappearListener,
} from '../../hooks';
import StoryVideoItem from '../../models/video-story';
import apiServices from '../../services';
import { Colors } from '../../theme';
import ImageStoriesRow from './image-stories-row';
import style from './style';

const HomeStoryVideos = ({ componentId }) => {
  const passStory = useSelector(state => state.bottomTab.passStoryVideo);

  const [listHeight, setListHeight] = useState(0);
  const [stories, setStories] = useState([]);
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);
  const [tabVisible, setTabVisible] = useState(false);

  const listRef = useRef(null);
  const canLoadMore = useRef(true);
  const firstAppear = useRef(false);

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
  };
  useComponentDidAppearListener(viewDidAppear, componentId);
  useComponentDidDisappearListener(viewDidDisappear, componentId);

  useEffect(() => {
    fetchStories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    }
  }, [passStory]);

  useEffect(() => {
    if (visibleItemIndex === stories.length - 3 && canLoadMore.current) {
      const pageIndex = Math.round(stories.length / 10);
      fetchStories(pageIndex + 1);
    }
  }, [visibleItemIndex]);

  const fetchStories = async (pageIndex = 1) => {
    try {
      const response = await apiServices.getVideoStories({
        order_by: 'created_at',
        order: ORDER_VALUE.DESC,
        story_per_page: 10,
        page: pageIndex,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        if (pageIndex === 1) {
          setStories(result.data.map(obj => StoryVideoItem.clone(obj)));
        } else {
          setStories(
            [...stories].concat(
              result.data.map(obj => StoryVideoItem.clone(obj)),
            ),
          );
        }
        canLoadMore.current = result.data.length === 10;
      }
    } catch (error) {}
  };

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

  const onChangeToNextStory = useCallback(() => {
    if (visibleItemIndex < stories.length - 2) {
      listRef.current.scrollToIndex({
        animated: true,
        index: visibleItemIndex + 1,
      });
      setVisibleItemIndex(visibleItemIndex + 1);
    }
  }, [visibleItemIndex, stories]);

  const renderRow = (item, index) => {
    return (
      <StoryRow
        componentId={componentId}
        key={index}
        style={[style.storyRow, { height: listHeight }]}
        item={item}
        listHeight={listHeight}
        onChangeToNextStory={() => onChangeToNextStory()}
        onFollowStatusChanged={onFollowStatusChanged}
        show={visibleItemIndex === index && tabVisible}
        preLoad={Math.abs(visibleItemIndex - index) <= 2}
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
        renderItem={({ item, index }) => renderRow(item, index)}
        keyExtractor={(_, index) => 'key' + index.toString()}
        pagingEnabled
        onMomentumScrollEnd={event => {
          onChangedVisibleRowIndex(event);
        }}
        showsVerticalScrollIndicator={false}
      />
    </Layout>
  );
};

HomeStoryVideos.options = {
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

export default HomeStoryVideos;
