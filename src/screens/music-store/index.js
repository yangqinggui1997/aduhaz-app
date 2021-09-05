import React, { useCallback, useEffect, useState } from 'react';
import {
  Text,
  TouchableOpacity,
  View,
  TextInput,
  FlatList,
  Image,
  ScrollView,
  TouchableWithoutFeedback,
} from 'react-native';
import { Navigation } from 'react-native-navigation';
import { useTranslation } from 'react-i18next';
import apiServices from '../../services';
import Sound from 'react-native-sound';
import { NavBar, Layout } from '../../components';
import { useNavigation } from '../../hooks';
import style from './style';
import FastImage from 'react-native-fast-image';
import Screens from '../../screens/screens';
import images from '../../assets/images';
import Utils from '../../commons/utils';
import { RESPONSE_STATUS, RESPONSE_ERROR_CODE } from '../../commons/constants';
import colors from '../../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { wp } from '../../commons/responsive';

import _ from 'lodash';

var song;

const MusicStore = ({ componentId, onFinish }) => {
  const { t } = useTranslation();
  Sound.setCategory('Playback', true); // true = mixWithOthers
  const [topics, setTopics] = useState([]);
  const [listMusicByTopic, setListMusicByTopic] = useState([]);
  const [playedSong, setPlayedSong] = useState({
    song: null,
    isPlay: false,
    id: -1,
  });
  const navigation = useNavigation(componentId);

  const onLeftPress = useCallback(() => {
    Navigation.dismissModal(componentId);
  }, []);

  useEffect(() => {
    getTopics();
    getMusicByTopic();
  }, []);

  useEffect(() => {
    stopSound();
    if (playedSong.isPlay) {
      song = new Sound(playedSong.song, null, error => {
        if (error) {
          return;
        } else {
          if (song) {
            song.play(() => {
              song.release();
            });
            song.setVolume(0.5);
          }
        }
      });
    }
    return () => {
      stopSound();
    };
  }, [playedSong.isPlay, playedSong.song, playedSong.id]);

  const getTopics = async () => {
    try {
      const response = await apiServices.getTopics({
        order: 'asc',
        orderBy: 'id',
        itemPerPage: 4,
        page: 1,
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        setTopics(response.data.data);
      }
    } catch (error) {
      console.log('get topics error: ', error);
    }
  };

  const getMusicByTopic = async () => {
    var _musicByTopics = [...listMusicByTopic];
    try {
      const response = await apiServices.getMusicByTopic({
        musicPerTopic: 5,
        page: 1,
        topics: 7,
        topicOrder: 'asc',
        topicOrderBy: 'id',
      });
      if (response.data.status === RESPONSE_STATUS.OK) {
        _musicByTopics = response.data.data;
      }
      setListMusicByTopic(
        _musicByTopics.filter(topic => topic.songs.length > 0),
      );
    } catch (error) {
      console.log('get music by topic error: ', error);
    }
  };

  const refreshSound = () => {
    setPlayedSong({
      song: null,
      isPlay: false,
      id: -1,
    });
    stopSound();
  };

  const stopSound = () => {
    if (song) {
      song.stop();
    }
  };

  const onPlayPress = item => {
    setPlayedSong({
      song: item.directory,
      isPlay:
        item.id !== playedSong.id ? true : playedSong.isPlay ? false : true,
      id: item.id !== playedSong.id ? item.id : -1,
    });
  };

  const onMusicPress = newSong => {
    onFinish(newSong);
    Navigation.dismissModal(componentId);
  };

  const onPressSearch = () => {
    refreshSound();
    navigation.showModal(Screens.SearchMusic, {
      type: 'POST',
      onFinish: newSong => onMusicPress(newSong),
    });
  };

  const renderTopicItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          refreshSound();
          navigation.push(Screens.MusicList, {
            topic: item,
            type: 'topic',
            onFinish: newSong => onMusicPress(newSong),
          });
        }}
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

  const renderMusicByTopic = ({ item, index }) => {
    return (
      <View style={{ paddingHorizontal: wp(14), marginBottom: wp(10) }}>
        <View style={style.topicHeader}>
          <Text style={style.topicTitle}>{item.category_name}</Text>
          <TouchableOpacity
            onPress={() => {
              refreshSound();
              navigation.push(Screens.MusicList, {
                topic: item,
                type: 'topic',
                onFinish: newSong => onMusicPress(newSong),
              });
            }}
            style={style.viewMore}>
            <Text style={style.viewMoreTitle}>{t('viewMore')}</Text>
            <Ionicons
              name={images.ionicons_arrow_right}
              size={10}
              color={colors.flatGrey01}
            />
          </TouchableOpacity>
        </View>
        <FlatList
          data={item.songs}
          renderItem={renderMusicItem}
          bounces={false}
          ListFooterComponent={() => {
            return (
              <View
                style={index !== listMusicByTopic.length - 1 && style.separator}
              />
            );
          }}
          keyExtractor={index => index.toString()}
        />
      </View>
    );
  };

  const renderMusicItem = ({ item }) => {
    return (
      <TouchableOpacity
        style={style.musicItem}
        onPress={() => onMusicPress(item)}>
        <FastImage
          style={style.musicIcon}
          source={
            item.icon && item.icon != ''
              ? {
                  uri: item.icon,
                  priority: FastImage.priority.normal,
                }
              : images.icon_song_default
          }
          resizeMode={FastImage.resizeMode.cover}
        />
        <View style={style.musicDetail}>
          <Text numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text numberOfLines={1} ellipsizeMode="tail" style={style.author}>
            {item.single_name}
          </Text>
          <Text style={style.author}>{item.user_name_post}</Text>
          <Text style={style.author}>
            {Utils.getSongDurationString(item.duration)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => onPlayPress(item)}
          style={style.iconPlayContainer}>
          <Image
            style={style.iconPlay}
            resizeMode="contain"
            source={
              playedSong.id === item.id
                ? images.icon_pause_png
                : images.icon_play_video
            }
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Layout style={style.container}>
      <NavBar
        parentComponentId={componentId}
        showCloseButton
        onLeftPress={onLeftPress}
        title={t('music')}
      />
      <TouchableOpacity
        onPress={() => onPressSearch()}
        style={style.searchInputContainer}>
        <Ionicons
          name={images.ionicons_search}
          size={28}
          color={colors.flatBlack02}
        />
        <Text style={{ color: colors.flatGrey01 }}>
          {t('search_placeholder')}
        </Text>
      </TouchableOpacity>

      <ScrollView bounces={false} showsVerticalScrollIndicator={false}>
        <FlatList
          data={topics}
          numColumns={2}
          bounces={false}
          showsVerticalScrollIndicator={false}
          renderItem={renderTopicItem}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          style={style.topicList}
          ListFooterComponent={() => {
            return <View style={style.separator} />;
          }}
          ListHeaderComponent={() => {
            return (
              <View style={style.topicHeader}>
                <Text style={style.topicTitle}>{t('musicTopic')}</Text>
                <TouchableOpacity
                  onPress={() => {
                    refreshSound();
                    navigation.push(Screens.MusicTopics, {
                      onFinish: newSong => onMusicPress(newSong),
                    });
                  }}
                  style={style.viewMore}>
                  <Text style={style.viewMoreTitle}>{t('viewMore')}</Text>
                  <Ionicons
                    name={images.ionicons_arrow_right}
                    size={12}
                    color={colors.flatGrey01}
                  />
                </TouchableOpacity>
              </View>
            );
          }}
          keyExtractor={index => index.toString()}
        />

        <FlatList
          data={listMusicByTopic}
          renderItem={renderMusicByTopic}
          style={style.musicList}
          showsVerticalScrollIndicator={false}
          bounces={false}
          listKey={(item, index) => `_key${index.toString()}`}
          keyExtractor={(item, index) => `_key${index.toString()}`}
        />
      </ScrollView>
    </Layout>
  );
};

export default MusicStore;
