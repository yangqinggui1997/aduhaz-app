import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Dimensions,
  ScrollView,
  FlatList,
  Alert,
} from 'react-native';
import {
  Layout,
  NavBar,
  showStatisticalPopup,
  UserVideo,
  ImagePost,
  ImageView,
  ProfileView,
} from '../../components';
import Screens from '../screens';
import style from './style';
import { useTranslation } from 'react-i18next';
import {
  RESPONSE_STATUS,
  POST_MENU_TYPE,
  POST_TYPE,
} from '../../commons/constants';

const TabViewProfile = ({ posts, videos, navigation }) => {
  // console.log({ posts, videos });
  const { t } = useTranslation();
  const [interactItemIndex, setInteractItemIndex] = useState(0); // used for pause another video when play specify video
  const [isSelectPost, setIsSelectPost] = useState(true);

  const FirstRoute = (
    <View style={style.scene}>
      <View style={style.list}>
        {posts.data.map((item, index) => (
          <TouchableOpacity key={`post_item_${index.toString()}`}>
            <ImagePost
              showDate
              item={item}
              onPressItem={() => {
                // console.log('onPressItem -ImagePost');
                navigation.showModal(Screens.PostDetail, { postInfo: item });
              }}
            />
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const SecondRoute = (
    <View style={style.scene}>
      <View style={style.list}>
        {videos.data.map((item, index) => (
          <UserVideo
            key={`UserVideoKey_${index}`}
            item={item}
            isInteract={interactItemIndex === index}
            onInteract={() => onInteractItem(index)}
            onOnpenStatistical={() => onPressStatistical({ item })}
          />
        ))}
      </View>
    </View>
  );
  const onInteractItem = index => {
    setInteractItemIndex(index);
  };
  const onPressStatistical = ({ item }) => {
    showStatisticalPopup({
      item: item,
      type: POST_TYPE.VIDEO,
    });
  };

  return (
    <View style={style.tabar}>
      <View style={style.tabTitleView}>
        <TouchableOpacity
          style={[
            style.tabTitleItem,
            isSelectPost ? style.selectedTabItem : {},
          ]}
          onPress={() => setIsSelectPost(true)}>
          <Text
            style={[style.tabTextItem, isSelectPost ? style.selectedItem : {}]}>
            {t('view_listing') + `[${posts.total}]`}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            style.tabTitleItem,
            !isSelectPost ? style.selectedTabItem : {},
          ]}
          onPress={() => setIsSelectPost(false)}>
          <Text
            style={[
              style.tabTextItem,
              !isSelectPost ? style.selectedItem : {},
            ]}>
            {`${t('watch_video_posted')}[${videos.data.length}]`}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={style.tabContent}>
        {isSelectPost ? FirstRoute : SecondRoute}
      </View>
    </View>
  );
};

export default TabViewProfile;
