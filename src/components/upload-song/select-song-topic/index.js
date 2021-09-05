import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, View, FlatList } from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import _ from 'lodash';

import { styles } from './style';
import colors from '../../../theme/colors';
import images from '../../../assets/images';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Screens from '../../../screens/screens';
import apiServices from '../../../services';
import { RESPONSE_STATUS } from '../../../commons/constants';

export default function showSelectSongTopicPopup({
  isClosedOnTouchOutside = true,
  componentId,
  onFinish = null,
}) {
  Navigation.showOverlay({
    component: {
      name: Screens.BottomSheet,
      options: {
        overlay: {
          interceptTouchOutside: _.isBoolean(isClosedOnTouchOutside)
            ? isClosedOnTouchOutside
            : false,
        },
        layout: {
          componentBackgroundColor: 'transparent',
        },
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        renderBody: ({ hideBottomSheet }) => (
          <SongTopics
            componentId={componentId}
            onClose={hideBottomSheet}
            onFinish={onFinish}
          />
        ),
        height: 480,
      },
    },
  });
}

const SongTopics = ({ onClose, onFinish }) => {
  const { t } = useTranslation();
  const [topics, setTopics] = useState({
    data: [],
    currentPage: 1,
  });

  useEffect(() => {
    getTopics();
  }, [topics.currentPage]);

  const handleLoadMore = () => {
    setTopics({
      data: topics.data,
      currentPage: topics.currentPage + 1,
    });
  };

  const onSelectTopic = item => {
    if (_.isFunction(onFinish)) {
      onFinish(item);
    }
    if (_.isFunction(onClose)) {
      onClose();
    }
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.screenTitle}>{t('uploadSong')}</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close-outline" size={28} color={colors.flatBlack02} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={topics.data}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              onPress={() => onSelectTopic(item)}
              style={styles.topicItem}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>{item.name}</Text>
                <Ionicons
                  name={images.ionicons_arrow_right}
                  size={15}
                  color={colors.black}
                />
              </View>
            </TouchableOpacity>
          );
        }}
        style={styles.listTopic}
        keyExtractor={item => item.id.toString()}
        onEndReachedThreshold={0}
        onEndReached={handleLoadMore}
      />
    </View>
  );
};
