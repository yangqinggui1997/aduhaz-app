import React, { useEffect, useMemo, useRef, useState } from 'react';
import { View, FlatList, Dimensions, Share, Alert } from 'react-native';
import { useTranslation } from 'react-i18next';
import style from './style';

import StoryPicturesView from '../../../components/story-pictures-view';
import showStoryCommentsView from '../../../components/story-comments';
import storage from '../../../storage';
import StoryImageItem from '../../../models/story-imge';
import _ from 'lodash';
import { ORDER_VALUE, RESPONSE_STATUS } from '../../../commons/constants';

import apiServices from '../../../services';
import Utils from '../../../commons/utils';

const ImageStoriesRow = ({
  componentId,
  item,
  listHeight,
  onChangeToNextStory,
  show,
  preLoad,
  onFollowStatusChanged,
}) => {
  const { t } = useTranslation();
  const [relatedStories, setRelatedStories] = useState([]);
  const [visibleItemIndex, setVisibleItemIndex] = useState(0);
  const canLoadMore = useRef(true);

  useEffect(() => {
    fetchRelatedStories();
  }, [item]);

  useEffect(() => {
    if (show && relatedStories.length === 0) {
      fetchRelatedStories();
    }
  }, [show]);

  useEffect(() => {
    if (visibleItemIndex === relatedStories.length - 2 && canLoadMore.current) {
      const pageIndex = Math.round(relatedStories.length / 3);
      fetchRelatedStories(pageIndex + 1);
    }
  }, [visibleItemIndex]);

  const fetchRelatedStories = async (pageIndex = 1) => {
    try {
      const response = await apiServices.getImageStories({
        id_user_post: item.user.id,
        order_by: 'created_at',
        order: ORDER_VALUE.DESC,
        story_per_page: 3,
        page: pageIndex,
      });
      const result = response.data;
      if (result.status == RESPONSE_STATUS.OK && result.data) {
        if (pageIndex === 1) {
          setRelatedStories(result.data.map(obj => StoryImageItem.clone(obj)));
        } else {
          setRelatedStories(
            [...relatedStories].concat(
              result.data.map(obj => StoryImageItem.clone(obj)),
            ),
          );
        }
        canLoadMore.current = result.data.length === 3;
      }
    } catch (error) {
      console.log('fetchRelatedStories', error);
    }
  };

  const onPressStoryShare = async item => {
    if (storage.isLoggedIn()) {
      try {
        const urlShare = item.shareLink;
        await Share.share({
          message: `${t('post_menu_share')} : ${urlShare}`,
          url: urlShare,
        });
      } catch (error) {
        console.log('share error: ', error);
      }
    } else {
      Alert.alert(t('alertLogin'));
    }
  };

  const onPressStoryComments = story => {
    showStoryCommentsView({ storyId: story.id });
  };

  const onMoveNext = () => {
    if (_.isFunction(onChangeToNextStory)) {
      onChangeToNextStory();
    }
  };

  const onChangedVisibleRowIndex = event => {
    let xOffset = event.nativeEvent.contentOffset.x;
    let value = Math.round(xOffset / Dimensions.get('screen').width);

    setVisibleItemIndex(value);
  };

  const onPressFollow = async _item => {
    if (storage.isLoggedIn()) {
      try {
        console.log('###onPressFollow - _item: ', _item);
        let res;
        if (_item.user?.follow_status) {
          // unfollow
          res = await apiServices.unfollow(_item.user?.id);
        } else {
          // follow
          res = await apiServices.follow(_item.user?.id);
        }
        if (res && Utils.isResponseSuccess(res)) {
          // update follow status
          const newFollowStatus = !_item.user.follow_status;
          if (onFollowStatusChanged) {
            onFollowStatusChanged(_item.user.id, newFollowStatus);
          }
          setRelatedStories(
            relatedStories.map(it => {
              if (it.user.id === _item.user.id) {
                it.user.follow_status = newFollowStatus;
                console.log(
                  'onFollowStatusChanged - relatedStories: ',
                  _item.user.id,
                  newFollowStatus,
                );
              }
              return it;
            }),
          );
        }
      } catch (error) {}
    } else {
      Alert.alert(t('requireLogin'));
    }
  };

  const renderStoryView = ({ item, index }) => {
    return (
      <StoryView
        key={index}
        style={[style.storyRow, { height: listHeight }]}
        show={show && visibleItemIndex === index}
        preLoad={preLoad && Math.abs(visibleItemIndex - index) <= 2}
        item={item}
        onShare={() => onPressStoryShare(item)}
        onFollow={() => onPressFollow(item)}
        onPressComments={item => onPressStoryComments(item)}
        onMoveToNext={() => onMoveNext()}
        componentId={componentId}
      />
    );
  };

  return (
    <FlatList
      style={{ flex: 1 }}
      data={[item].concat(relatedStories.filter(story => story.id !== item.id))}
      renderItem={useMemo(() => renderStoryView, [
        show,
        visibleItemIndex,
        listHeight,
      ])}
      keyExtractor={(_, index) => 'key' + index.toString()}
      pagingEnabled
      horizontal
      showsHorizontalScrollIndicator={false}
      bounces={false}
      onMomentumScrollEnd={event => onChangedVisibleRowIndex(event)}
    />
  );
};

class StoryView extends React.PureComponent {
  render() {
    return (
      <View style={this.props.style}>
        <StoryPicturesView
          show={this.props.show}
          preLoad={this.props.preLoad}
          style={style.storyPicturesView}
          item={this.props.item}
          onShare={this.props.onShare}
          onFollow={this.props.onFollow}
          onPressComments={this.props.onPressComments}
          onMoveToNext={this.props.onMoveToNext}
          componentId={this.props.componentId}
        />
      </View>
    );
  }
}

export default ImageStoriesRow;
