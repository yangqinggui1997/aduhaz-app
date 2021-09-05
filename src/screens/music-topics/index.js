import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Image,
  ScrollView,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import apiServices from '../../services';

import { NavBar, Layout } from '../../components';
import style from './style';
import FastImage from 'react-native-fast-image';
import Screens from '../../screens/screens';
import images from '../../assets/images';
import Utils from '../../commons/utils';
import { useNavigation } from '../../hooks';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from '../../commons/constants';

const MusicTopics = ({ componentId, onFinish }) => {
  const { t } = useTranslation();
  const navigation = useNavigation(componentId);
  const [topics, setTopics] = useState({
    data: [],
    currentPage: 1,
  });

  useEffect(() => {
    getTopics();
  }, [topics.currentPage]);

  handleLoadMore = () => {
    setTopics({
      data: topics.data,
      currentPage: topics.currentPage + 1,
    });
  };

  const onFinishSelectSong = newSong => {
    onFinish(newSong);
    navigation.pop();
  };

  const getTopics = async () => {
    var _topicsData = [...topics.data];
    try {
      const response = await apiServices.getTopics({
        order: 'asc',
        orderBy: 'id',
        itemPerPage: 20,
        page: topics.currentPage,
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        if (topics.currentPage === 1) {
          _topicsData = response.data.data;
        } else {
          _topicsData = _topicsData.concat(response.data.data);
        }
        setTopics({
          data: _topicsData,
          currentPage: topics.currentPage,
        });
      }
    } catch (error) {
      console.log('get topics error: ', error);
    }
  };

  const renderTopicItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() =>
          navigation.push(Screens.MusicList, {
            topic: item,
            type: 'topic',
            onFinish: newSong => onFinishSelectSong(newSong),
          })
        }
        style={style.topicItem}>
        <FastImage
          style={style.topicIcon}
          source={
            item.icon && item.icon != ''
              ? {
                  uri: item.icon,
                  priority: FastImage.priority.normal,
                }
              : images.icon_music_topic_default
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        <Text style={style.topicName}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      <NavBar parentComponentId={componentId} title={t('musicTopic')} />
      <FlatList
        data={topics.data}
        showsVerticalScrollIndicator={false}
        renderItem={renderTopicItem}
        style={style.topicList}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0}
      />
    </Layout>
  );
};

export default MusicTopics;
